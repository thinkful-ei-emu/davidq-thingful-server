module.exports = function(){
  getUser(db,user){
    return db('thingful_users').select('*').where(user)

  }
}