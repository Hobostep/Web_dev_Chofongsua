    // app for the main script
var express     = require("express"),
    app         = express(),
    // parse the request body
    bodyParser  = require("body-parser"),
    // for connect to database
    mongoose    = require("mongoose"),
    // using for authentication the most confusing
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    // for popup message
    flash        = require("connect-flash"),
    // model of databaseand schema of data base
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    // session for 
    session = require("express-session"),
    // just for test in pre version
    seedDB      = require("./seeds"),
    // use for method request that isn't get and post
    methodOverride = require("method-override");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
// connect to database   
mongoose.connect("mongodb://localhost/yelp_camp_v9");
// use for parse the body of the request from forms tag
app.use(bodyParser.urlencoded({extended: true}));
// set server to render deal with .ejs file
app.set("view engine", "ejs");
// set folder of stylesheet and js tag to be in public
app.use(express.static(__dirname + "/public"));
// use for other method from request except GET and POST
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
// using flash message
app.use(flash());
// passport encode decode line
app.use(passport.initialize());
app.use(passport.session());
// use for make user model to have function in all authenticate [register,logout,signin etc.]
passport.use(new LocalStrategy(User.authenticate()));
// not sure but important too
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use for flash
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// require the rotues from another file for good structure
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// use for listento the specific port
app.listen(8080, 'localhost', function(){
   console.log("The YelpCamp Server Has Started!");
});