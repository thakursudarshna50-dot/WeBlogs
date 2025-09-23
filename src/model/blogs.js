import mongoose from 'mongoose'

const Schema=new mongoose.Schema({
    title:String,
    content:String,
    media:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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

const Blog=mongoose.model('Blog',Schema);
export default Blog;
