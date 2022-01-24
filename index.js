const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');



const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
const start = async () => {
   try {
      await mongoose.connect(
         'mongodb+srv://Roman:jjAAFPnZ46bgbbN@cluster0.w21j6.mongodb.net/Cluster0?retryWrites=true&w=majority'
      );
      app.listen(PORT, () => console.log(`server started on port ${PORT}`));
   } catch (error) {
      console.log(error);
   }
};

start();
