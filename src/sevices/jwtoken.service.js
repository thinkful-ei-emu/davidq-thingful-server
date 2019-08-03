const jwt = require('jsonwebtoken');
module.exports ={
  getToken(user){
    let token = jwt.sign({user_id: user.id},process.env.JWT_SECERT,{
      subject: user.user_name,
      expiresIn: '15m',
      algorithm: 'HS256'
    });
    return token;
  }
};