const {Schema, model} = require('mongoose')

const conferenceSchema = new Schema({
    title: {
        type: String,
        require: true        
    },
    dateTime:{
        type: Date,
        require: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = model('Conference', conferenceSchema)