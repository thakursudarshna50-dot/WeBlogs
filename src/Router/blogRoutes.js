import Router from "express";
import {upload} from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import { allBlogs, blogById, createBlog, deleteBlog, updateBlog, addView } from "../controller/blogController.js";
const blogRouter=Router()

blogRouter.get('/',allBlogs);
blogRouter.get('/:id',blogById);
blogRouter.post('/',auth,upload.single('media'),createBlog);
blogRouter.put('/:id',auth,upload.single('media'),updateBlog);
blogRouter.delete('/:id',auth,deleteBlog);
blogRouter.put('/view/:id',addView);
export default blogRouter
