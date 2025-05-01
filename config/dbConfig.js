const mongoose = require('mongoose');

let connected = false;

const connectDB = async () => {
    if (connected) return mongoose;
    try {
        mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
            serverSelectionTimeoutMS: 5000
        })
        mongoose.connection.on('connected', () => {
            console.log('Connected DB');
            connected = true;
        })
        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected DB');
            connected = true;
        })
        mongoose.connection.on('reconnected', () => {
            connected = false;
            console.log('🔄 MongoDB reconnected');
        });
        mongoose.connection.on('error', err => {
            connected = false;
            console.error('❌ MongoDB error:', err);
        });
        return mongoose;
    }
    catch (err) {
        console.log(err);
        throw err;
    }

}

module.exports = connectDB;