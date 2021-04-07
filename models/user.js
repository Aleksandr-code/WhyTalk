const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    password:{
        type: String,
        require: true,
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    typeAccount: String,
    aboutMyselfInformation: String,
    // confences:[
    //     {
    //         conferenceId : {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Conference',
    //             require: true,
    //         }
    //     }
    // ]

})

module.exports = model('User', userSchema)