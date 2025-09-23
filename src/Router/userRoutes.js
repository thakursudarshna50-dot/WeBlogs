import Router from 'express-router'
const router=Router();
import { auth } from '../middleware/auth.js';
router.post('/signup',userRegister)
router.post('/google',googleSignup)
router.post('/login',userLogin)
router.get('/profile',auth,userProfile)
router.get('/users',auth,allUsers)
router.put('/user/:id',auth,updateUserById)
router.delete('/user/:id',auth,deleteUserById)

