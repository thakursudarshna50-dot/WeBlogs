import mongoose from 'mongoose'

const Schema=new mongoose.Schema({
    title:String,
    content:String,
    media:String,
    views:{
        type:Number,
        default:0
    },
    viewedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
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
