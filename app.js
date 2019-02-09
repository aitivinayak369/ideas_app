const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      MongoStore = require('connect-mongo')(session),
      passport = require('passport');

const app = express();
const port = process.env.PORT || 3000;
const {MONGO_URL} = require('./libs/db-connection');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'qwerty',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    url: MONGO_URL,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.errors = [];
  next();
})

app.set('view engine', 'ejs');

const ideasRoute = require('./routes/ideas');
const usersRoute = require('./routes/users');
app.use('/ideas', ideasRoute);
app.use('/users', usersRoute);
require('./config/passport')(passport);
const indexRoutes = require('./routes/')(app);

app.listen(port, err => {
  console.log(err ? `Error on port ${port}` : `App running on port ${port}`);
});
