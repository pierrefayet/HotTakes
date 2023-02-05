const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const helmet = require("helmet");
const app = express();
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/users');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config() ;


app.use(express.json())


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(process.env.MONGOOSE_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));
  app.use(
    helmet.frameguard({
      action: "sameorigin",
    })
  );

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;


