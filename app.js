const express = require("express");
const methodOverride = require("method-override");
const app = express();
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// =====================================================================================//
// App Config ////////////////////////////////////////////////////////////////////////////
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// =====================================================================================//
// Database config ///////////////////////////////////////////////////////////////////
// mongoose.set('useFindAndModify', false) ///////////////////////////////////////////
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error:"));
db.once("open", () => {
  console.log("Database running ok");
});

let campSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Campground = mongoose.model("Campground", campSchema);

// =====================================================================================//
////// Landing page /////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.render("landing");
});

////// RESTFul 1 Index //////////////////////////////////////////////////////////////////
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, dbCampgrounds) => {
    if (err) console.log(err);
    res.render("index", { camp: dbCampgrounds });
  });
});

////// RESTFul 2 New ////////////////////////////////////////////////////////////////////
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

////// RESTFul 3 Create /////////////////////////////////////////////////////////////////
app.post("/campgrounds", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Campground.create(req.body.camp, err => {
    if (err) console.log(err);
    res.redirect("/campgrounds");
  });
});

////// RESTFul 4 Show //////////////////////////////////////////////////////////////////
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id, (err, data) => {
    if (err) console.log(err);
    res.render("show", { camp: data });
  });
});

////// RESTFul 5 Edit //////////////////////////////////////////////////////////////////
app.get("/campgrounds/:id/edit", (req, res) => {
  Campground.findById(req.params.id, (err, data) => {
    if (err) res.redirect("/campgrounds");
    res.render("edit", { camp: data });
  });
});

////// RESTFul 6 Update ////////////////////////////////////////////////////////////////
app.patch("/campgrounds/:id", (req, res) => {
  req.body.camp.body = req.sanitize(req.body.camp.body);
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, err => {
    if (err) res.redirect("/campgrounds");
    res.redirect("/campgrounds/" + req.params.id);
  });
});

////// RESTFul 7 Destroy //////////////////////////////////////////////////////////////
app.delete("/campgrounds/:id", (req, res) => {
  Campground.findByIdAndRemove(req.params.id, req.body.camp, err => {
    if (err) res.redirect("/campgrounds");
    res.redirect("/campgrounds");
  });
});

// ================================================================================= //
// Server starter /////////////////////////////////////////////////////////////////////

app.listen("5500", "127.0.0.1", () => console.log("Server is online."));
