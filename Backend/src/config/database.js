import mongoose from 'mongoose';

function connectToDatabase() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to Database...');
    })
    .catch((err) => {
      console.log('Error connecting to DB : ', err);
    });
}

export default connectToDatabase;