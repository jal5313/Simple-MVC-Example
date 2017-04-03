
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let DogModel = {};

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: string,
    required: true,
    trim: true,
  },
    
  age: {
      type: number,
      required: true,
      min: 0, 
  }

  createdData: {
    type: Date,
    default: Date.now,
  },

});

DogSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return DogModel.findOne(search, callback);
};

DogModel = mongoose.model('Dog', DogSchema);

module.exports.DogModel = DogModel;
module.exports.DogSchema = DogSchema;
