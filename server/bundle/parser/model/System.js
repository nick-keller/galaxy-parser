var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SystemSchema = new Schema({
    _id: Number,
    x: Number,
    y: Number,
    dist: Number
}, { autoIndex: false });

mongoose.model('System', SystemSchema);