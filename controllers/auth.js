//jshint esversion:9
const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const register = async(req,res)=>{
  // res.send('Register user');
  // const {name,email,password} = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password,salt);
  // const tempUser = {name,email,password:hashedPassword};
  // if(!name || !email || !password){
  //   throw new  BadRequestError('Please provide name, email and password');
  // }
  //above error-handling is done by mongoose validator
  // const user = await User.create({ ...tempUser});
  const user = await User.create({ ...req.body});
  const token = user.createJWT();
  // const token = jwt.sign({userId:user._id,name:user.name},'jwtSecret', {
  //   expiresIn : '30d',
  //
  // });
  // res.status(StatusCodes.CREATED).json({user});
  // res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
  res
  .status(StatusCodes.CREATED)
  // .json({user: {name : user.getName()}, token});
  .json({user: {name : user.name}, token});
};
const login = async(req,res)=>{
  // res.send('login user');
  const {email, password} = req.body;

  if(!email || !password){
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({email});
  if(!user){
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // compare password
  const token  = user.createJWT();
  res.status(StatusCodes.OK).json({user:{name:user.name},token});

};
module.exports ={
  register,
  login,
};
