const mongoose = require('mongoose')
const { MONGO_URL } = require('../config')

const databaseConnection = () => {
    console.log(MONGO_URL, "=========== MONGO_URL =========");
    mongoose.connect(MONGO_URL).then(() => {
        console.log('Database connected successfully');
    }).catch((error) => {
        console.log('Database connection error', error);
    })
}
module.exports = databaseConnection 