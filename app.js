const engine = require('ejs-mate');

const express = require('express');
const methodOverride = require('method-override');
const app = express();
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
// const seedDB = require('./seeds');
// seedDB();

// =====================================================================================//
// App Config ////////////////////////////////////////////////////////////////////////////
// use ejs-locals for all ejs templates
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// =====================================================================================//
// Database config ///////////////////////////////////////////////////////////////////
// mongoose.set('useFindAndModify', false) ///////////////////////////////////////////
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', () => {
  console.log('Database running ok');
});

// =====================================================================================//
////// Landing page /////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('landing');
});

////// RESTFul 1 Index //////////////////////////////////////////////////////////////////
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, dbCampgrounds) => {
    if (err) console.log(err);
    res.render('campgrounds/index', { camp: dbCampgrounds });
  });
});

////// RESTFul 2 New ////////////////////////////////////////////////////////////////////
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

////// RESTFul 3 Create /////////////////////////////////////////////////////////////////
app.post('/campgrounds', (req, res) => {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  Campground.create(req.body.camp, (err) => {
    if (err) console.log(err);
    res.redirect('/campgrounds');
  });
});

////// RESTFul 4 Show //////////////////////////////////////////////////////////////////
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, data) => {
      if (err) console.log(err);
      console.log(data);
      res.render('campgrounds/show', { camp: data });
    });
});

////// RESTFul 5 Edit //////////////////////////////////////////////////////////////////
app.get('/campgrounds/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (err, data) => {
    if (err) res.redirect('/campgrounds');
    res.render('campgrounds/edit', { camp: data });
  });
});

////// RESTFul 6 Update ////////////////////////////////////////////////////////////////
app.patch('/campgrounds/:id', (req, res) => {
  req.body.camp.body = req.sanitize(req.body.camp.body);
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err) => {
    if (err) res.redirect('/campgrounds');
    res.redirect('/campgrounds/' + req.params.id);
  });
});

////// RESTFul 7 Destroy //////////////////////////////////////////////////////////////
app.delete('/campgrounds/:id', (req, res) => {
  Campground.findByIdAndRemove(req.params.id, req.body.camp, (err) => {
    if (err) res.redirect('/campgrounds');
    res.redirect('/campgrounds');
  });
});

// ================================================================================= //
//COMMENTS//

////// RESTFul 2 New ////////////////////////////////////////////////////////////////////
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, camp) => {
    if (err) console.log(err);
    res.render('comments/new', { camp });
  });
});

////// RESTFul 3 Create /////////////////////////////////////////////////////////////////
app.post('/campgrounds/:id/comments', (req, res) => {
  Campground.findById(req.params.id, (err, camp) => {
    if (err) console.log(err);
    console.log(req.body.comment);
    Comment.create(req.body.camp, (err, comment) => {
      if (err) console.log(err);
      camp.comments.push(comment);
      camp.save();
      res.redirect(`/campgrounds/${camp._id}`);
    });
  });
});

// Server starter /////////////////////////////////////////////////////////////////////

app.listen('5500', '127.0.0.1', () => console.log('Server is online.'));
