const mongoose = require('mongoose');
const {mongo} = require('mongoose');
//import mongoose, {mongo} from 'mongoose';
const {Schema}=mongoose;


const dataSchema = new Schema({
    Username: {type:String},
    Password: {type:String}
//
});

module.exports = mongoose.model('Users',dataSchema);