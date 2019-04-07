const   express                 = require('express'),
        expressSession          = require('express-session'),
        app                     = express(),
        mongoose                = require('mongoose'),
        bodyParser              = require("body-parser"),
        passport                = require("passport"),
        LocalStrategy           = require("passport-local"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        User                    = require('./models/user')
        // =========================================================

        mongoose.connect('mongodb://localhost/fame_auth',{ useNewUrlParser: true });
        mongoose.set('useCreateIndex', true);

        app.use(require('express-session')({
            secret: "This is the secret password. Maybe, Flag",
            resave:false,
            saveUninitialized:false
        }))

        app.use(bodyParser.urlencoded({extended: true}));
        app.set('view engine','ejs')
        app.use(passport.initialize());
        app.use(passport.session());
        // Encode Decode session variable
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        // ======================= ROUTES ===============================

        app.get('/',(req,res)=>{
            res.render('main');
        });

        app.get('/secret',isLogin,(req,res)=>{
            res.render('secret');
        })
        // ======================= AUTH ROUTES ==========================

        app.get('/register',(req,res)=>{
            res.render('register');
        });

        app.post('/register',(req,res)=>{
            // strict line around here ==================================
            User.register(new User({username:req.body.username}), req.body.password, (err,data)=>{
               if(err){
                    console.log(err);
                    return res.render('register');
               }else{
                //    Essential line\/\/\/\/\/\/\/\/\/\/
                    passport.authenticate("local")(req,res,()=>{
                        res.redirect('/secret');
                    });
               }
                
            })
            
        });
        // =========================LOGIN ROUTES============================
        app.get('/login',(req,res)=>{
            res.render('login');
        });
                            // MIDDLEWARE compare username password to database
        app.post('/login',passport.authenticate("local",{
            successRedirect:'/secret',
            failureRedirect:'/login'
        }),(req,res)=>{
            
        });

        // =========================LOGOUT ROUTES============================
        app.get('/logout',(req,res)=>{
            req.logout();
            res.redirect('/');
        });

        function isLogin(req,res,next){
            if(req.isAuthenticated()){
                return next();
            }
            res.redirect('/login');
        }

        // ==================================================================
        app.listen(8080,'localhost',(err)=>{
            if(!err){
                console.log("================SERVER STARTED================")
            }
        })