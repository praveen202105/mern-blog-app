import { Router } from "express";
import {createPost,deletePostById,updatepostById,allpost,likepost,createcomment, createReply, deletecomment, editComment} from "../controllers/post.controllers.js";
import upload from "../middlewares/multer.middleware.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
// allpost,deletepost,editpost}
const router =Router();

router.post('/createpost',isLoggedIn, upload.single("media"),createPost);
router.get('/allposts',isLoggedIn,allpost);
router.delete('/deletepost/:id',isLoggedIn,deletePostById);


router.put('/editpost/:id',isLoggedIn,upload.single("media"),updatepostById);
router.get('/likepost/:postid',isLoggedIn,likepost);

// router.get('/likepost/:postid',likepost);

router.post('/comment/:postid',isLoggedIn,createcomment);
// router.post('/comment/:postid',isLoggedIn,deletecomment);

router.delete('/:postId/comment/:commentId',isLoggedIn,deletecomment)
router.post('/:postId/comment/:commentId',isLoggedIn,createReply)
router.put('/:postId/comment/:commentId',isLoggedIn,editComment)


export default router;