const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/ProjectTask");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

mongoose.plugin(plm);

module.exports = mongoose.model('User', userSchema);
