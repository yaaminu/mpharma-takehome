import express = require('express');
import DiagnosticCodesRouter from './routes/DiagnosticCodes'
import { DbHelper } from './db';
import BodyParser = require('body-parser')

require('dotenv').config()

var app = express();
const client = new DbHelper()

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    if (req.body) {
        let keys = Object.keys(req.body)
        keys.forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim()
            }
        })
    }
    next()
})

app.use('/api/v1/diagnostic_codes', new DiagnosticCodesRouter(client).getRouter())


/** Error Hanlders */
app.use((_, __, next) => {
    next({
        status: 404,
        message: 'Not Found'
    })
})

app.use((err: any, __: express.Request, res: express.Response, _: (err: any) => void) => {
    console.error(`An error occured while processing request: ${err.message} \n`)
    console.dir(err)
    res.status(err.status || 500).json({
        status: err.status || 500,
        code: err.code || 'unknown',
        message: err.message,
        stack_trace: process.env.NODE_ENV === 'development' ? err : {}
    })
})

client.connect().then(() => {
    console.log('Connection to database established!!!')
    app.listen(process.env.PORT || 5000, () => {
        console.log('App is listening for new connections')
    })
}).catch(err => {
    console.error('Error while connecting to the database, are you sure it\'s running')
    console.error(err)
})


