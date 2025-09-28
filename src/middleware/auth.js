import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export default function auth(req,res,next){
    try {
        const authHeader = req.header('Authorization');
        console.log('this is authHeader',authHeader||"no token");
        const cookieToken = req.cookies?.token;
        console.log('this is cookieToken',cookieToken||"no token");
        const bearerToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : null;
        console.log('this is bearerToken',bearerToken||"no token");
        const token = cookieToken || bearerToken;

        if(!token){
            return res.status(401).json({message:"Unauthorized: No token provided"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log('this is decoded',decoded);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    } 
}