require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('⚠️ MONGODB_URI không được tìm thấy trong file .env');
        }

        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);

        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 
