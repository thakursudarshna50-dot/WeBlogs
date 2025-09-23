/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from '../model/users.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          password: '',
          role: ['READER']
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

// Helper function for standard success response
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

// Helper function for standard error response
function errorResponse(res, message = 'Error', statusCode = 400) {
  return res.status(statusCode).json({ success: false, message });
}

export async function googleSignup(req, res) {
  // eslint-disable-next-line no-unused-vars
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err) return errorResponse(res, 'Authentication error', 500);
    if (!user) return errorResponse(res, 'Invalid credentials', 400);

    try {
      
        const existingUser=await User.findOne({googleId:user.id});
        if(existingUser){
            const jwtToken=jwt.sign({id:existingUser._id,name:existingUser.name,role:existingUser.role},process.env.JWT_SECRET,{expiresIn:"2h"});
            return successResponse(res, { token: jwtToken }, 'Login successful');
        }else{
            const newUser=await User.create({name:user.name,email:user.email,googleId:user.id,password:"",role:["READER"]});
            const jwtToken=jwt.sign({id:newUser._id,name:newUser.name,role:newUser.role},process.env.JWT_SECRET,{expiresIn:"2h"});
            return successResponse(res, { token: jwtToken }, 'Login successful');
        }
      
    } catch (e) {
      console.error(e);
      return errorResponse(res, 'Token generation failed', 500);
    }
  })(req, res);
}

export async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return errorResponse(res, 'All fields (name, email, password) are required', 400);
    }
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: ['READER'],
      googleId: ''
    });

    const jwtToken = jwt.sign(
      { id: newUser._id, name: newUser.name, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return successResponse(res, { token: jwtToken }, 'Registration successful', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const jwtToken = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return successResponse(res, { token: jwtToken }, 'Login successful');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function userProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, user, 'User profile retrieved');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function allUsers(req, res) {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    return successResponse(res, users, 'All users retrieved');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function updateUserById(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim()) {
      return errorResponse(res, 'Name and email are required', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.name = name.trim();
    user.email = email.trim();

    if (password?.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response

    return successResponse(res, userResponse, 'User updated successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function deleteUserById(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response

    return successResponse(res, userResponse, 'User deleted successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}
