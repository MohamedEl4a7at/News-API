const jwt = require('jsonwebtoken')
const Reporters = require('../models/reporters')
const auth = async(req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decode = jwt.verify(token,'newsAPI')
    const reporter = await Reporters.findById({_id:decode._id})
    req.reporter = reporter
    next()
    }
    catch(e){
        res.send({error:'Please authenticate'})
    }
}

module.exports = auth