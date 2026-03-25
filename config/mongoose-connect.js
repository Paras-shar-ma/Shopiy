const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("database is connected")
        dbgr("database is connected")
    })
    .catch((err) => {
        console.error("database connection error:", err);
        dbgr(err);
    })
module.exports = mongoose.connection;
