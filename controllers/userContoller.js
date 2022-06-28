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


exports.getUserDetail = async(req,res) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success: true,
      user,
    });


  } catch(error){
    console.log(error)
  }
}

exports.updateUserPassword = async(req,res) => {
  try {
    const user = await User.findById(req.user.id)

    const validPassword = await bcrypt.compare(
      req.body.oldPassword, user.password
    );
  
    if(!validPassword)
      return res.status(401).send({message: 'Password Incorrect'});

    if(req.body.newPassword !== req.body.confirmPassword){
      return res.status(401).send({message: 'Password does not match'});
    }

    user.password = req.body.newPassword;
    await user.save()

    sendToken(user,200,res)
  } catch(err){
    console.log(err)
  }
}

exports.updateUserProfile = async(req,res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email
    }

    if(!newUserData.email)
      return res.status(401).send({message: 'Please enter your email'});
    if(!newUserData.name)
    return res.status(401).send({message: 'Please enter your name'});

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })

    res.status(200).json({
      success: true,
    })

  }catch(error){
    console.log(error)
  }
}

exports.getAllUser = async(req,res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users
    })

  }catch(err){
    console.log(err)
  }
}


exports.getUser = async(req,res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user)
      return res.status(401).json({message: `User does not exist with Id: ${req.params.id}`})

    
    res.status(200).json({
      success: true,
      user
    })

  }catch(err){
    console.log(err)
  }
}

exports.updateUserRole = async(req,res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

    if(!newUserData.email)
      return res.status(401).send({message: 'Please enter your email'});
    if(!newUserData.name)
      return res.status(401).send({message: 'Please enter your name'});

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })

    res.status(200).json({
      success: true,
    })

  }catch(error){
    console.log(error)
  }
}

exports.deleteUser = async(req,res) => {
  try {

    const user = await User.findById(req.params.id)

    if(!user){
      return res.status(401).send({message: `User does not exist with Id: ${req.params.id}`});
    }

    await user.remove()

    res.status(200).json({
      success: true,
      message: 'User Successfully Deleted'
    })

  }catch(error){
    console.log(error)
  }
}