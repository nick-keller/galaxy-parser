var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
    _id: Number,
    x: Number,
    y: Number,
    system: Number,
    sector: Number,
    name: String,
    population: Number,
    defense: Number,
    resource: Number,
    science: Number,
    inhabitants: Number,
    resource_ratio: Number,
    science_bonus: Number,
    habitable: Boolean,
    owner: {
        id: Number,
        name: String
    },
    last_checked: {
        type: Date,
        default: Date.now
    }
}, { autoIndex: false });

mongoose.model('Place', PlaceSchema);