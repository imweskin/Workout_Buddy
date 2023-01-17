const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

//get all workouts
const getWorkouts = async (request, response) => {
  const user_id = request.user._id;

  const workouts = await Workout.find({user_id}).sort({createdAt: -1});

  response.status(200).json(workouts);
}

//get a single workout
const getWorkout = async (request, response) => {
  const {id} = request.params;
  
  //check if the id is valid
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({error: 'No such workout'});
  }

  const workout = await Workout.findById(id);

  //check if that workout exists
  if(!workout) {
    return response.status(400).json({error: 'No such workout'});
  }

  response.status(200).json(workout);
}

//create new workout
const createWorkout = async (request, response) => {
  const {title, load, reps} = request.body;

  let emptyFields = [];

  if(!title) {
    emptyFields.push('title');
  }
  if(!load) {
    emptyFields.push('load');
  }
  if(!reps) {
    emptyFields.push('reps');
  }

  if(emptyFields.length > 0) {
    return response.status(400).json({error: 'Please fill in all the fields', emptyFields});
  }
  
  //add doc to db
  try {
    const user_id = request.user._id;
    const workout = await Workout.create({title, load, reps, user_id});
    response.status(200).json(workout);
  } catch (error) {
    response.status(400).json({error: error.message});
  }
};

//delete a workout
const deleteWorkout = async (request, response) => {
  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({error: 'No such workout'});
  }

  const workout = await Workout.findOneAndDelete({_id: id});

  if(!workout) {
    return response.status(404).json({error: 'No such workout'});
  }

  response.status(200).json(workout);
};

//update a workout
const updateWorkout = async (request, response) => {
  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({error: 'No such workout'});
  }
  
  const workout = await Workout.findByIdAndUpdate({_id: id}, {
    ...request.body
  });

  if(!workout) {
    return response.status(404).json({error: 'No such workout'});
  }

  response.status(200).json(workout);
};


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}