if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log('An error occured:');
    console.log(e);
  });
mongoose.set('strictQuery', false);

app.get('/', (req, res) => {
  res.render('index', { title: 'Dashboard' });
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
