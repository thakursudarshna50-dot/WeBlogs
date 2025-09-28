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
        const blog=await Blog.findById(req.params.id).populate('author');
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
        const media=req.file?.path || '';
        const blog=await Blog.create({title,content,media,author:req.user.id});
        return successResponse(res,"Blog created successfully",blog,201)
    } catch (error) {
        console.log(error);
        return errorResponse(res,"Internal Server Error",500)
    }
}

export async function updateBlog(req,res){
    try {
        const {title,content}=req.body;
        const media=req.file?.path;
        const blog=await Blog.findById(req.params.id);
        if(!blog){
            return errorResponse(res,"No blog Fond",404)
        }
        if(blog.author!=req.user.id){
            return errorResponse(res,"You are not authorized to update this blog",401)
        }
        blog.title=title;
        blog.content=content;
        if(media){
            blog.media=media;
        }
        await blog.save();
        return successResponse(res,"Blog updated successfully",blog,200)
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500)
    }
}

export async function deleteBlog(req,res){
    try{

        const blog= await Blog.findById(req.params.id);

        if(!blog){
            return errorResponse(res,"No blog Fond",404)
        }
        if(blog.author!=req.user.id){
            return errorResponse(res,"You are not authorized to delete this blog",401)
        }
        await blog.deleteOne();
        return successResponse(res,"Blog deleted successfully",blog,200)
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500)
    }
}

export async function addView(req,res)
{
    try{
        const {id,viewedById}=req.params;
        
        if(!id){
            return errorResponse(res,"Blog Id is required",400)
        }
        const blog= await Blog.findById(id);
        if(!blog)
        {
            return errorResponse(res,"No such blog available",404)
        }
        blog.views+=1;
        if(!blog.viewedBy.includes(viewedById))
        {
            blog.viewedBy.push(viewedById);
        }
        await blog.save();
        return successResponse(res,"Views Updated Successfully",blog,200)
    }catch(error)
    {
        return errorResponse(res,"Internal Server Error",500)
    }
}


