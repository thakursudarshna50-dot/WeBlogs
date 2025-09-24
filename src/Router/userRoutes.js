import {Router} from 'express'
const router=Router();
import User from '../model/users.js';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import auth from '../middleware/auth.js';
import { userRegister, userLogin, googleSignup, userProfile, allUsers, updateUserById, deleteUserById ,logout,refreshToken} from '../controller/userController.js';
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

router.get('/auth/google', passport.authenticate('google', {  scope: ['profile', 'email'] ,prompt:'select_account'   })  );
router.post('/signup',userRegister)
router.get('/google/callback',passport.authenticate('google', { session: false }),googleSignup)
router.post('/login',userLogin)
router.get('/profile',auth,userProfile)
router.get('/',auth,allUsers)
router.put('/:id',auth,updateUserById)
router.delete('/:id',auth,deleteUserById)
router.post('/logout',auth,logout)
router.post('/refresh',auth,refreshToken)
export default router