const express = require('express')
const router = express.Router()
const Reporters = require('../models/reporters')
const News = require('../models/news')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sign } = require('jsonwebtoken')
////////////////////////////signup
router.post('/signup', async (req, res) => {
    try {
        const reporter = new Reporters(req.body)
        await reporter.save()
        const token = reporter.generateToken()
        res.send({ reporter, token })
    }
    catch (e) {
        res.send(e.message)
    }
})
////////////////////////////login
router.get('/login', async (req, res) => {
    try {
        const reporter = await Reporters.findByCredentials(req.body.email, req.body.password)
        const token = reporter.generateToken()
        res.send({ reporter, token })
    }
    catch (e) {
        res.send(e.message)
    }
})
////////////////////////////profile
router.get('/profile', auth, (req, res) => {
    res.send(req.reporter)
})
///////////////////////////update
router.patch('/update', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const reporter = await Reporters.findById(req.reporter._id)
        if (!reporter) {
            res.send('No user is found')
        }
        updates.forEach((el) => reporter[el] = req.body[el])
        await reporter.save()
        res.send(reporter)
    }
    catch (e) {
        res.send(e.message)
    }
})
////////////////////////////delete
router.delete('/delete', auth, async (req, res) => {
    try {
        const reporter = await Reporters.findByIdAndDelete(req.reporter._id)
        if (!reporter) {
            res.send('No user is found')
        }
        res.send(reporter)
    }
    catch (e) {
        res.send(e.message)
    }
})

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cb(new Error('Please uplaod image'), null)
        }
        cb(null, true)
    }
})


router.post('/profileImg',auth,upload.single('avatar'),async(req,res)=>{
    try{
        req.reporter.image = req.file.buffer
        await req.reporter.save()
        res.send("success")
    }
    catch(e){
        res.send(e.message)
    }
})
module.exports = router