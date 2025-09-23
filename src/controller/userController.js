
import dotenv from 'dotenv'
dotenv.config();
import jwt from 'jsonwebtoken'
import User from '../model/users.js'
import bcrypt from 'bcrypt'
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

export async function googleSignup(req,res){
    passport.authenticate('google', { session: false },async (err,user,info)=>{
        if(err || !user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const existingUser=await User.findOne({googleId:user.id});
        if(existingUser){
            const jwtToken=jwt.sign({id:existingUser._id,name:existingUser.name,role:existingUser.role},process.env.JWT_SECRET,{expiresIn:"2h"});
            res.json({token:jwtToken});
        }else{
            const newUser=await User.create({name:user.name,email:user.email,googleId:user.id,password:"",role:["READER"]});
            const jwtToken=jwt.sign({id:newUser._id,name:newUser.name,role:newUser.role},process.env.JWT_SECRET,{expiresIn:"2h"});
            res.json({token:jwtToken});
        }
    })(req,res);
}


export  async function userRegister(req,res){
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({name,email,password:hashedPassword,role:["READER"],googleId:""});
        const jwtToken=jwt.sign({id:newUser._id,name:newUser.name,role:newUser.role},process.env.JWT_SECRET,{expiresIn:"2h"});
        res.json({token:jwtToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export  async function userLogin(req,res){
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const jwtToken=jwt.sign({id:user._id,name:user.name,role:user.role},process.env.JWT_SECRET,{expiresIn:"2h"});
        res.json({token:jwtToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function userProfile(req,res){
    try {
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
            
export async function allUsers(req,res){
    try {
        const users=await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export async function updateUserById(req,res){
    try {
        const {name,email,password}=req.body;
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        user.name=name;
        user.email=email;
        user.password=password;
        await user.save();
        res.json(user); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}   
export async function deleteUserById(req,res){
    try {
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
        
        