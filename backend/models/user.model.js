var mongoose = require('mongoose');
var validator = require('validator')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var Schema = mongoose.Schema;

var userSchema = new Schema({

    admin:{type:Boolean,default:false},
    username:{type:String,lowercase:true,trim:true,required:true,validate(value){
        if(value.length < 2) throw new Error(`Username: ${value}, is to short!`)
    }},
    email:{type:String,trim:true,required:true,unique:true,validate(value){
        if(!validator.isEmail(value)) throw new Error(`Entered value: ${value} in not an E-mail `)
    }},
    password:{type:String,trim:true,required:true},
    userPhoto:{type:String},
    userCart:[{type: Schema.Types.ObjectId,ref:'Helmet'}],
    tokens:[{
        token:{type:String}
      }],
});

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisis')
    user.tokens = user.tokens.concat({token})
      await user.save()
    return token
  }
  
  userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('There is no user')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      throw new Error('There is no match bitch')
    }
  return user
  }
  
  userSchema.pre('save',async function(next){
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
  })

var User = mongoose.model('User', userSchema);

module.exports = User