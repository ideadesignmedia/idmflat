// REQUIREMENTS FOR APP TO RUN
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const loggingtool = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const track = require('./api/sessions/track.js')
app.set('trust proxy', true);
dotenv.config();
app.use(loggingtool('dev'));
mongo.connect("mongodb://localhost/db1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => console.log('Successful MongoDB Connection'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use('/sw.js', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/javascript' })
    fs.readFile('./IDM_SW.js', (error, data) => {
        if (error) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
app.use('/manifest.webmanifest', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/web+manifest'})
    fs.readFile('./manifest.webmanifest', (err, data) => {
        if (err) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
app.use('/cache', track, async (req, res) => {
    let arr = []
    let readFiles = function(){
        return new Promise((res) => {
            fs.readdir('./public/cache', (err, data) => {
                if (err) {
                    console.log('Unable to scan directory: ' + err);
                }
                for (i = 0; i < data.length; i++) {
                    arr.push(`/static/cache/${data[i]}`)
                    if (i === data.length - 1) {
                        return res(true)
                    }
                }
            })
        })
    }
    readFiles().then(result => {
        return res.status(200).json({
            error: false,
            cache: arr
        })
    }).catch(e => {
        return res.status(500).json({
            error: true,
            message: e
        })
    })
})
app.use('/static', express.static('./public'))
//ROUTING



//ROUTING
app.use('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('./index.html', (error, data) => {
        if (error) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app