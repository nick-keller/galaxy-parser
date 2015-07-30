var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommanderSchema = new Schema({
    name: String,
    level: String,
    pev: Number,
    compo: [Number]
}, { _id: false });

var PlaceSchema = new Schema({
    _id: Number,
    x: Number,
    y: Number,
    system: Number,
    sector: Number,
    position: Number,

    name: String,
    habitable: Boolean,
    owner: {
        id: Number,
        name: String
    },

    population: Number,
    defense: Number,
    resource: Number,
    science: Number,

    inhabitants: Number,
    resource_ratio: Number,
    science_bonus: Number,

    warehouses: Number,
    counterintelligence: Number,
    trade_routes: Number,

    first_line: [CommanderSchema],
    second_line: [CommanderSchema],

    last_checked: {
        type: Date,
        default: Date.now
    },
    last_report: Number
}, { autoIndex: false });

mongoose.model('Place', PlaceSchema);