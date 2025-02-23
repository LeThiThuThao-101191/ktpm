const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://thao101191:dBM8FYL4lcdSCyTX@cluster0.clm1j.mongodb.net/vegetable', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failure');
    }

}


module.exports = { connect }