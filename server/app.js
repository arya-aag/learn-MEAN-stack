const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./app/routes/posts/post.routes');
const userRoutes = require('./app/routes/users/user.routes');

const app = express();

mongoose
  .connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true }
  )
  .then(
    response => {
      const date = new Date();
      console.info(
        `[${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
          'en-US'
        )}] Connected to MongoDB!`
      );
    },
    error => {
      const date = new Date();
      console.log(
        `[${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
          'en-US'
        )}] MongoDB connection failure!`,
        error
      );
    }
  );

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('app/assets/images')));

// routing logic
app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
