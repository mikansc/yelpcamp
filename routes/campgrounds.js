const express = require("express");
const app = express();


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