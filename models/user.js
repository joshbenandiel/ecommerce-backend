const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
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
})


userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: '7d'})
  return token
}

const User = mongoose.model('user', userSchema);


const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
    avatar: {
      public_id: Joi.string().required(),
      url: Joi.string().required()
    },
    role: Joi.string()
  })

  return schema.validate(data)
}

module.exports = {User, validate}


