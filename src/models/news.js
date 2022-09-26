const mongoose = require('mongoose')
const News = mongoose.model('News',{
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        minlength:6
    },
    Owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporters'
    },
    image:{
        type:Buffer,
        ref:'Reporters'
    }
})

module.exports = News