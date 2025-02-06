const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('connection secccesfully');
  } catch (error) {
    console.error(' err of coonection :', error);
    process.exit(1);
  }
};

module.exports = connectDB;
