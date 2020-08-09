const express = require('express');
const router = express.Router();

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