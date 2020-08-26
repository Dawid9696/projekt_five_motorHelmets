var mongoose = require('mongoose');
var validator = require('validator')

var Schema = mongoose.Schema;

var helmetSchema = new Schema({

    helmetName:{type:String,required:true,unique:true,trim:true},
    helmetPrice:{type:Number,required:true,trim:true,min:100},
    helmetDescription:{type:String},
    helmetPhotos:[{type:String}],
    helmetSalesPrice:{type:Number,validate(value){
        if(value < 0) throw new Error('Entered value can not be lower than 0')
        if(value > helmetPrice) throw new Error('Entered value must be lower!')
    }},
    helmetComments:[{
        commentText:{type:String,required:true,validate(value){
            if(value.length < 2) throw new Error(`Comment: ${value} is too short!`)
        }},
        commentDate:{type:Date,default:Date.now()},
        commentedBy:{type: Schema.Types.ObjectId,ref:'User'}
    }]
});

var Helmet = mongoose.model('Helmet', helmetSchema);

module.exports = Helmet

