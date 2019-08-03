const router = require('express').Router();
const dbServ = require('../sevices/db_service');
function validateForm(full_name, nick_name, user_name, password){
  if(!/^\S([A-Za-z]+)\s([A-Za-z]+)\S$/.test(full_name))// matches 2 words with no numbers
    return false;
  if(!/\w{1,8}/.test(user_name))
    return false;
  if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/.test(password))//upper-lower-number-special
    return false;
  return true;
}
router
  .route('/')
  .post(require('express').json(),(req,res,next)=>{
    let {user_name,full_name,password,nickname = ''} = req.body;
    if(!user_name || !full_name ||!password)
      return res.status(400).json({error:'Must include name, username, password'});
    if(!validateForm(full_name,nickname,user_name,password))
      return res.status(400).json({error:'invalid user'});
    dbServ.getUserByUserName(req.app.get('db'),user_name).then(user=>{
      if(!user)
        return dbServ.addUser(req.app.get('db'),{user_name,full_name,password,nickname})
          .then((result)=>{
            return res.status(200).json({newUser:result});

          });
      else{
        return res.status(400).json({error:'A user already has that user name'});
      }
    });

    
  });
module.exports = router;