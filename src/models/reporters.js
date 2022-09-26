const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const News = require('./news')
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 20) {
                throw new Error('Too Young')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image:{
        type:Buffer
    }
})
Schema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
    }
})
Schema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporters.findOne({ email })
    if (!reporter) {
        throw new Error('Please check email or password')
    }
    const isMatch = await bcryptjs.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('Please check email or password')
    }
    return reporter
}

Schema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'newsAPI')
    return token
}

Schema.virtual('news',{
    localField:'_id',
    foreignField:'Owner',
    ref:'News'
})
const Reporters = mongoose.model('Reporters', Schema)
module.exports = Reporters