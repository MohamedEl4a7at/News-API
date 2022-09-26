const express = require('express')
const News = require('../models/news')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const { Schema } = require('mongoose')
///////////////////////upload news
router.post('/news', auth, async (req, res) => {
    try {
        const news = new News({ ...req.body, Owner: req.reporter._id })
        await news.save()
        res.send(news)
    }
    catch (e) {
        console.log(e.message)
    }
})
//////////////////////////////////get news
router.get('/news', auth, async (req, res) => {
    try {
        await req.reporter.populate('news')
        res.send(req.reporter.news)
    }
    catch (e) {
        console.log(e.message)
    }
})
///////////////////////////////update news
router.patch('/update/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOneAndUpdate({ _id, Owner: req.reporter._id }, req.body, {
            new: true,
            runValidators: true
        })
        console.log(news)
        if (!news) {
            return res.send('No news is found')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})
//////////////////////////////delete
router.delete('/delete/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id,Owner:req.reporter._id})
        if(!news){
            return res.send('No news is found')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})

const uplaod = multer({
    fileFilter (req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error('Please uplaod image'), null)
        }
        cb(null, true)
    }
})

router.post('/newsImg',auth,uplaod.single('news'),async(req,res)=>{
    try{
        await req.reporter.populate('news')
         req.reporter.news.image = req.file.buffer
         console.log(req.reporter.news)
         await req.reporter.save()
         res.send("success")
    }
    catch(e){
        res.send(e.message)
    }
})
// router.get('/newsImg/:id',auth,async(req,res)=>{
//     try{
//         const _id = req.params.id
//         const news = await News.findOne({_id,Owner:req.reporter._id})
//         // News.image = req.file.buffer
//         console.log(news)
//         // await news.save()
//     }
//     catch(e){
//         res.send(e.message)
//     }
// })
module.exports = router