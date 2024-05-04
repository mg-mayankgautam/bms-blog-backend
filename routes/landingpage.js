const path = require('path');
const express = require('express');
const router = express.Router();
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// const movieController = require('../controller/movieController');
 const authController = require('../controller/authController');
const blogController = require('../controller/blogController');

router.post('/',authController.signUp);

router.post('/login',authController.logIn)

router.post('/blogdata',upload.single('image'),blogController.postBlog)
router.get('/getblogs',blogController.getBlogs)
router.post('/approveblog', blogController.approveBlog);
router.get('/getapprovedblogs', blogController.getApprovedBlogs);
router.post('/archiveblog', blogController.archiveBlog);
router.get('/getarchiveblog', blogController.getArchiveBlog);

 router.post('/deletearchive',blogController.deletearchive);
// router.get('/getblogs',blogController.getblogs);

module.exports = router;