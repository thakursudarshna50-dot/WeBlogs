/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
import mongoose from 'mongoose'
const Schema= new mongoose.Schema({
    name:String,
    email:String,
    googleId:String,
    password:String,
    role:{
        type:[{
            type:String,
            enum:["READER","CREATER","ADMIN"],
        }],
        default:["READER"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }    
})

  const User=mongoose.model('User',Schema);
  export default User;
