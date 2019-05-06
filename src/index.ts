import express = require('express');

var app = express();



app.use((req, res) => {
    res.status(200).send('Hello world')
})

app.listen(process.env.PORT || 5000, () => {
    console.log('App is listening for new connections')
})

