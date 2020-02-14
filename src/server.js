const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { join } = require('path');
const path = p => join(__dirname, p);

require('./setupProxy')(app);

app.use(function(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV !== 'development'
  ) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

app.use(express.static(path('/../build')));

app.get('*', function(req, res) {
  res.sendFile(path('/../build/index.html'));
});

app.listen(port);
console.log(`::${port}`);
