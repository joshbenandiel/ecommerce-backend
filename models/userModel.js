const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please Enter Your Name'],
    maxlength: [30,"Name Cannot Exceed 30 Characters"],
    minlength: [4, "Name should have more than 4 characters"]
  },
  email: {
    type: String,
    required: [true,'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter a valid Email']

  },
  password: {
    type: String,
    required: [true, 'Please Enter Your Password'],
    minlength:[8,'Password should be greater than 8 characters']
  },
  avatar: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken:String,
  resetPasswordExpire: Date,
})


userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10)
})


///JWT TOKEN


userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
  return token
}

//compare password

// userSchema.methods.comparePassword = (enteredPassword) => {
//   return bcrypt.compare(enteredPassword, this.password)
// }

///Password reset token
userSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
}


module.exports = mongoose.model('User', userSchema)