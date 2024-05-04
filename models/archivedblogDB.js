const mongoose = require('mongoose');
const {mongo} = require('mongoose');
//import mongoose, {mongo} from 'mongoose';
const {Schema}=mongoose;


const dataSchema = new Schema({
    name: {type:String},
    text: {type:String},
    title: {type:String},
    datestring:{type:String},
    publishtime:{type:String},
    s3name: {type:String},
    url: {type:String},
//
});

module.exports = mongoose.model('archivedblog',dataSchema);