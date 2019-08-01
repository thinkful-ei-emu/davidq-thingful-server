const bcrypt = require('bcryptjs');
module.exports = {
  getUserByUserName(db,user){//takes either a string or int to search by
    return db('thingful_users').select('*').where({user_name:user}).first();
  },
  addUser(db,user){//takes a user object
    return bcrypt.hash(user.password,12).then((hash)=>{
      console.log('user.password: ',user.password);
      user.password = hash;
      return db('thingful_users').insert(user).returning('id');
    });
  }
}