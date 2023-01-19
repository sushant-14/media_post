const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../controllers/users_controller');

router.get('/about/:id',passport.checkAuthentication,userController.about);
router.post('/update/:id',passport.checkAuthentication,userController.update);

router.get('/sign-up',userController.signUp)
router.get('/sign-in',userController.signIn);

router.post('/create',userController.create);
// use passport at a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
)  ,userController.createSession);

router.get('/sign-out',userController.destroySession)
// router.post('/sign-out',userController.destroySession)
module.exports=router;