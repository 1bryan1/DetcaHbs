const express = require('express');
const router = express.Router();
var async = require("async");
var crypto = require("crypto");
const pool = require('../database');

const passport = require('passport');
const {isloggedIn, isNotloggedIn} = require("../lib/auth");

router.get('/signup', isNotloggedIn,(req, res) => {
    res.render('auth/signup')
});

router.post("/signup", passport.authenticate("local.signup", { //EJECUTA informacion del usuario
    successRedirect: "/signin", //se envia una vista cuando se loggea correctamente
    failureRedirect: "/signup", // Por si succede algun error en el loggueo
    failureFlash: true //Se envias los datos del cliente
}));

router.get("/signin", (req, res) => { //renderiza desde el get signin
    res.render("auth/signin"); //Lo muestra en el server el login
});

router.post("/signin", (req, res, next) => {
    passport.authenticate("local.signin", { //Validar el inicio session
        successRedirect: "/profile", //usuario loggeado correctamente pueda ser redireccionado a la siguiente pestaña
        failureRedirect: "/signin", //Sino se loguea correctamente , me regrese nuevamente al login 
        failureFlash: true //Me envie mensajes en pantalla del error
    })(req, res, next);
});

router.get('/forgot', (req, res) => {
    res.render('auth/forgot')
});

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            pool.findOne({
                correo: req.body.correo
            }, function (err, pool) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                pool.resetPasswordToken = token;
                pool.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                pool.save(function (err) {
                    done(err, token, pool);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'detcasoporte@gmail.com',
                    pass: sistemateca2
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'detcasoporte@gmail.com',
                subject: 'Detca Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + pool.correo + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

//cerrar sesion 

router.get("/logout" , isloggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
        
});
    
//Vista del perfil cuando inicie sesion
router.get('/profile', isloggedIn,(req, res) => {
    res.render('profile')
});

module.exports = router;