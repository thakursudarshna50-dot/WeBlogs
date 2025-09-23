import {Router} from 'express'
const router=Router();
import auth from '../middleware/auth.js';
import { userRegister, userLogin, googleSignup, userProfile, allUsers, updateUserById, deleteUserById } from '../controller/userController.js';
router.post('/signup',userRegister)
router.post('/google',googleSignup)
router.post('/login',userLogin)
router.get('/profile',auth,userProfile)
router.get('/users',auth,allUsers)
router.put('/user/:id',auth,updateUserById)
router.delete('/user/:id',auth,deleteUserById)

export default router