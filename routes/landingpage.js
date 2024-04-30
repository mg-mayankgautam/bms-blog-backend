const path = require('path');
const express = require('express');
const router = express.Router();

// const movieController = require('../controller/movieController');
 const authController = require('../controller/authController');
// const blogController = require('../controller/blogController');

router.post('/',authController.signUp);

router.post('/login',authController.logIn)

// router.post('/logout',authController.logout)
// router.get('/isauth',authController.isauth)
// router.get('/films', movieController.getMovies);
// router.get('/top10', movieController.getTop10);
// router.get('/boxoffice', movieController.getBoxOffice);
// router.get('/updateboxoffice', movieController.updateBoxOffice);

// router.post('/checkusername',authController.checkUsername);
// router.get('/getblogs',blogController.getblogs);

module.exports = router;