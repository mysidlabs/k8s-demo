const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  duration: String
});

module.exports = mongoose.model('Task', schema)