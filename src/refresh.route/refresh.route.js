const router = require('express').Router();
const tokenService = require('../sevices/jwtoken.service');
const auth = require('../middleware/auth');

router.route('/')
  .all(auth)
  .post((req,res)=>{
    res.status(200).json({auth:tokenService.getToken(req.user)});
  });

module.exports = router;