const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function(req,res,next){
  if(!req.get('Authorization').toLowerCase().startsWith('bearer'))
    return res.status(401).json({error: 'missing bearer token'});

  let token = req.get('Authorization').split(' ')[1] || '';
    jwt.verify(token,process.env.JWT_SECERT, async(err, payload) =>{
      //console.log(err);
      if(err)
        console.log('error from jwt: ',new Error(err));
      req.user = await req.app.get('db')('thingful_users').select('*').where({id: payload.user_id}).first();
      next();
    });
}
