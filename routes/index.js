const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController')

console.log('router working')


router.get('/',homeController.home);
router.use('/users',require('./users'))
router.use('/posts',require('./posts'))
router.use('/comments',require('./comments'));

module.exports=router;
