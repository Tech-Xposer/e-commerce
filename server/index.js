const express = require('express');
const mongoose = require("mongoose");
const fs = require('fs');
const productRoute = require('./routes/productRoute');
const PORT = process.env.PORT || 3000;

const dotenv = require('dotenv');
dotenv.config();

const userRoute = require('./routes/userRoute');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json() );

app.use((req,res,next)=>{
  const text = `${Date.now()}: ${req.method} ${req.path}\n`;
  fs.appendFile('log.txt',text,(err,data)=>{
    next();
  })
})

app.use('/product', productRoute);
app.use('/user',userRoute)
app.use('/auth', authRouter)

app.get('*', (req, res) => {
    return res.status(404).json({message:'404 page not found'});
});

mongoose.connect('mongodb://localhost:27017/product_cart')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });