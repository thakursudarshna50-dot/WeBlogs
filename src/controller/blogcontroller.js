import  Blog from "../model/blogs.js";


const errorResponse=(res,message,statusCode)=>{
    return res.status(statusCode).json({message})
}

const successResponse=(res,message,data,statusCode)=>{
    return res.status(statusCode).json({message,data})
}


export async function allBlogs(req,res){
    try {
        const {page,limit}=req.query;
        const blogs=await Blog.find().skip((page-1)*limit).limit(limit);
        if(!blogs){
            return errorResponse(res,"No blogs Fond",404)
        }
        return successResponse(res,"Blogs retrieved successfully",blogs,200)
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500)
    }
}

export async function blogById(req,res){
    try {
        const blog=await Blog.findById(req.params.id);
        // const requestingUser=await User.findById(req.user.id);
        if(!blog){
            return errorResponse(res,"No blog Fond",404)
        }
        return successResponse(res,"Blog retrieved successfully",blog,200)
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500)
    }
}
 
export async function createBlog(req,res){
    try {
        const {title,content}=req.body;
        const media=req.file.path;
        const blog=await Blog.create({title,content,media,author:req.user.id});
        return successResponse(res,"Blog created successfully",blog,201)
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500)
    }
}
