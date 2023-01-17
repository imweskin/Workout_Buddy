const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  //1st arg = payload, 2nd arg = secret key , 3rd arg = options
  return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '3d'});
};

//login user
const loginUser = async (request, response) => {
  const {email, password} = request.body;

  try {
    const user = await User.login(email, password);

    //create token
    const token = createToken(user._id);

    response.status(200).json({email, token});
  } catch (error) {
    response.status(400).json({error: error.message});
  }

};

//signup user
const signupUser = async (request, response) => {

  const {email, password} = request.body;

  try {
    const user = await User.signup(email, password);

    //create token
    const token = createToken(user._id);

    response.status(200).json({email, token});
  } catch (error) {
    response.status(400).json({error: error.message});
  }
  
};

module.exports = {
  loginUser,
  signupUser
}