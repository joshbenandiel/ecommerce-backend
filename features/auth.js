const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const jwt_decode = require("jwt-decode");


exports.isAuthenticatedUser = async(req,res, next) => {
  try {
    const {token} = req.cookies
    if(!token){
      return res.status(401).send({message: 'Please Login to access'});
    }
    // console.log(token)
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)

    next()
  } catch(err){
    console.log(err)
  }
}

exports.authorizedRole = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return res.status(401).send({message: `Role ${req.user.role} is not allowed`})
    } else {
      next()
    }
  }
}