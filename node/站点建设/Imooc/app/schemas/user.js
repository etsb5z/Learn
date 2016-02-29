var mongoose = require('mongoose')
/*
 * bcrypt在windows下 不可用，替换taobao 的方案
 * http://npm.taobao.org/package/bcryptjs
 */
var bcrypt = require('bcryptjs') //
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//每次在存储数据之前都会来调用一下这个方法
UserSchema.pre('save', function (next) {
  var user = this;

  //数据是否是新添加的
  if (user.isNew) {
      user.meta.createAt = user.meta.updateAt = Date.now();
  } else {
      user.meta.updateAt = Date.now();
  }


  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err)

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err)

      user.password = hash;

      next();
    })
  })

});


//添加实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb){
    bcrypt.compare(_password, this.password, function(err, isMatch){
      if(err) return cb(err);

      cb(null, isMatch);
    })
  }
}

//添加静态方法
UserSchema.statics = {
    fetch: function (cd) { // 取出数据库里所有数据
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cd)
    },
    findById: function (id, cd) { // 取出数据库里所有数据
        return this
            .findOne({_id: id})
            .exec(cd)
    }
};

module.exports = UserSchema;
