const mongo = require('mongoose');
const Visitor = require('../models/visitor');
module.exports = (req, res, next) => {
    const cat = req.ip;
    const inca = req.originalUrl;
    let dateDisplay = new Date();
    Visitor.findOne({ip: cat}).then(result => {
        if (result == null) {
            let visitor = new Visitor({
                _id: new mongo.Types.ObjectId(),
                ip: cat,
                visits: 1,
                visit: [{
                    date: dateDisplay,
                    page: [inca]
                }]
            })
            visitor.save().then(()=>{
                return next();
            }).catch((e) => {
                res.status(500).json({
                    message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5991'
                });
            });      
        }
        if (result) {
            Visitor.collection.updateOne( {_id: result._id}, {$inc: {visits: 1},
                $push: { visit: { date: dateDisplay, page: [inca] } }
            }).then(() => {
                return next();
            }).catch((e) => {
            res.status(500).json(
                {message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5990'}
                );
            });
        }
    }).catch((e)=>{
        res.status(500).json({
            message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5989'
        });
    });
}