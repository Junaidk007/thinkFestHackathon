const mongoose = require('mongoose');



let dbConnection = async () => {
    await mongoose.connect(process.env.ATLASDB_URL)
    console.log('database connected');
}

module.exports = dbConnection;