const express = require('express'); //MODULOS HTPP
const morgan = require('morgan');
const exphbs = require('express-handlebars');//Plantila para render vistas
const path = require('path');
const socketIo = require("socket.io"); //Llamando desde la biblioteca websockets
const http = require("http"); //modulos de http
const passport = require('passport');
const flash = require("connect-flash"); //Modulos para los mensajes
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


//Inicializando
const app = express();
const server = http.createServer(app); //Se llaman los modulos del servidor requerido
const io = socketIo.listen(server); //Usamos el objeto websockets para que se inicie en el server
require('./lib/passport');

//Password y correo


//Arduino
//Websockets actualizando

//ARDUINO SERIAL PORT
io.on('connection', function (socket) {
    console.log('Nuevo socket conectado');
});

const Serialport = require('serialport');
const { text } = require('express');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3', {
    baudRate: 9600
});

port.on('open', function () {
    console.log('Puerto serial conectado');
});

port.on('data', function (data) {
    //console.log(data.toString());
    io.emit('arduino:data', {
        value: data.toString()
    });
});

port.on('err', function (err) {
    console.log(err.message);
});

//SENSOR
// const parser = port.pipe(new Readline({
//     delimeter: '\r\n'
// }));

// parser.on('open', function () {
//     console.log('connection is opened');
// });

// parser.on('data', function (data) {
//     console.log(data);
//     io.emit('Alcohol', data);
// });

// parser.on('error', function (err) {
//     console.log(err);
// });

//Config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers : require ('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Peticiones Midlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); //Recivir datos de tipo string

app.use(session({
    
    secret: 'autosecretdetcalol',
    saveUninitialized: false,
    resave: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.urlencoded({ extended: false }));

//Variables Globales Autenticar
app.use((req, res, next) => { // Mensajes para el ussario en el login 
    app.locals.success = req.flash("success"); //Correcto login
    app.locals.message = req.flash("message"); //Contraseña incorrecta
    app.locals.alert = req.flash("alert"); //Correro no exite messageRegistro
    app.locals.messageRegistro = req.flash("messageRegistro");
    app.locals.user = req.user;
    //console.log(app.locals);
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authenticar'));
//app.use(require('./routes/crud'));
app.use('/Cruds', require('./routes/crud'));
app.use(require('./routes/crud'));


//Public
app.use(express.static(path.join(__dirname, 'public')));

//Iniciando Servidor
//  app.listen(app.get('port'), () => {
//      console.log('Servidor Conectado', app.get('port'));
//  });

 server.listen(4000, () => {
    console.log("Conexion en el puerto", 4000); //server ejecutando.

});