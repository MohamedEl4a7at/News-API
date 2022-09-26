const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const reportersRouter = require('./routers/reporters')
const newsRouter = require('./routers/news')
require ('./db/mongoose')
app.use(express.json())
app.use(reportersRouter)
app.use(newsRouter)
app.listen(port,()=>{
    console.log('Server is running')
})