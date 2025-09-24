import Router from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import { allBlogs, blogById, createBlog, deleteBlog, updateBlog, viewBlog } from "../controller/blogController.js";
const blogRouter=Router()

blogRouter.get('/',auth,allBlogs);
blogRouter.get('/:id',auth,blogById);
blogRouter.post('/',auth,upload.single('media'),createBlog);
blogRouter.put('/:id',auth,upload.single('media'),updateBlog);
blogRouter.delete('/:id',auth,deleteBlog);
blogRouter.post('/view/:id',auth,viewBlog);
// blogRouter.post('/like/:id',auth,likeBlog);
// blogRouter.post('/dislike/:id',auth,dislikeBlog);
