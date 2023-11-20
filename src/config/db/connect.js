const mongoose = require('mongoose');

async function connect () {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("success connect db");
    } catch (error) {
        console.log("fail connect db");
    }
}

module.exports = { connect };