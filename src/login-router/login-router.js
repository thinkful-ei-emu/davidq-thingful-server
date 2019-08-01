const router = require('express').Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const parse = require('express').json();

router
  .post('/',parse, (req,res,next)=>{
    console.log(req.body);
    let {user_name, password} = req.body;
    //const [username, password] = Buffer.from(, 'base64').toString().split(':');
    if(!user_name || !password)
      return res.status(401).json({error:'your username or password is invalid'});
    req.app.get('db')('thingful_users')
      .where({user_name})
      .first()
      .then((result)=>{
        if(result === undefined)
          return res.status(401).json({error:'your username or password is invalid'});
        return bcrypt.compare(password,result.password)
          .then(isMatch=>{
            if(!isMatch)
              res.status(401).json({error:'your username or password is invalid'});
            else{
              //all checks passes this is a valid user, so give them a token
              let token = jwt.sign({user_id: result.id},process.env.JWT_SECERT,{
                subject: result.user_name,
                algorithm: 'HS256'
              });
              res.status(200).json({token});
            }
          }).catch(next);
  
      });
  });

module.exports = router;