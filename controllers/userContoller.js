const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const sendToken = require('../features/jwtToken')
const sendEmail = require('../features/sendEmail')
const crypto = require('crypto')

exports.registerUser = async(req, res) => {

  try {
    let {name, email, password} = req.body
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'this is a sample id',
        url: 'sample url'
      }
    })

    // password = await bcrypt.hash(password,10)
    const token = user.generateAuthToken();
    res.status(200).json({
      success: true,
      token,
    });


  } catch(err){
    console.log(err)
    res.status(400).json(err)
  }
}

exports.loginUser = async(req,res) => {
  const {email, password} = req.body

  try {
    if(!email || !password){
      return res.status(401).send({message: 'Please Enter Email & Password'});
    }

    const user = await User.findOne({email})

    console.log(user)
    if(!user){
      return res.status(401).send({message: 'Invalid Email or Password'});
    }
    const validPassword = await bcrypt.compare(
      req.body.password, user.password
    );
  
    if(!validPassword)
      return res.status(401).send({message: 'Invalid Email or Password'});

    
    sendToken(user,201,res)
  
  } catch(error){
    console.log(error)
  }

}

exports.logoutUser = async(req,res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnle: true
  })

  res.status(200).json({
    success: true,
    message: "Logged Out"
  });
}



exports.forgotPassword = async(req,res) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if(!user)
    return res.status(401).send({message: 'User Not Found'});


    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/users/password/reset/${resetToken}` 

    const message = `Your password reset token is: - \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`


    try {

      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      })
      res.status(201).json({
        success: true,
        message: `Email sent to ${user.email} successfully`
      })

    } catch(error){
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;    


      await user.save({validateBeforeSave: false});
      console.log(error)
      return res.status(500).send({message: 'Internal Error'});
    }

  } catch(error){
    console.log(error)
  }
}


exports.resetPassword = async(req,res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()},
    })

  

    if(!user)
     return res.status(401).send({message: 'Reset password token is invalid or has been expired'});

    if(req.body.password !== req.body.confirmPassword){
      return res.status(401).send({message: 'Password does not match'});
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;  

    await user.save();

    sendToken(user,200,res)

  }catch(error){
    console.log(error)
  }
}