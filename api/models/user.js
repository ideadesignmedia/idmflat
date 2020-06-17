const mongo = require('mongoose');
const userSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    username: {type: String, required: false, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    superuser: {type: Boolean, required: false},
    ips: {type: Array, require: false},
    profileId: {type: String, require: false}
});
module.exports = mongo.model('User', userSchema);