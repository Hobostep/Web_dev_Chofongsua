
const   express                 =   require("express"),
        app                     =   express(),
        mongoose                =   require("mongoose"),
        bodyParser              =   require('body-parser'),
        passport                =   require('passport'),
        passportLocal           =   require('passport-local'),
        passportLocalMongoose   =   require('passport-local-mongoose'),
        User                    =   require('./models/user');

    
    app.set('view engine','ejs')

    mongoose.connect('mongodb://localhost/auth_demo',{ useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);
    app.use(require('express-session')({
        secret: "1234567890",
        resave: false,
        saveUninitialized: false
    }))
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new passportLocal(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // ===================== ROUTES =======================
    
    app.get('/',(req,res)=>{
        res.render('main');
    });

    app.get('/secret',isLoggedIn,(req,res)=>{
        res.render('secret');
    });
    //====================Auth Routes=======================

    app.get('/register',(req,res)=>{
        res.render('register');
    });

    app.post('/register',(req,res)=>{
        // strict==============================!!!!!
        User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
           
            console.log(err);
            return res.render('register');
        }else{
            passport.authenticate("local")(req, res, function(){
                
                res.redirect("/secret");
             });
            
            
        }
        
        });
    });


    //login logic
    //middleware
    app.post("/", passport.authenticate("local",{
     successRedirect: "/secret",
     failureRedirect: "/"
        }) ,function(req, res){

        });
        
//  log out by req.logout()
 app.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
 });
 
//  checking if user is login or not
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }else{
        res.redirect("/");
     }
 }
 


    app.listen(8080,'localhost',(err)=>{
        console.log('server started!!!')
    });