const express=require('express')
const router=express.Router();
const post2Api=require('../../../controllers/api/v2/post2_api');


router.get('/',post2Api.index);



module.exports=router;