const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//Inicializando
const app = express();

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
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//Variables Globales Autenticar
app.use((req, res, next) => {
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authenticar'));
//app.use('/Crud', require('./routes/Crud'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Iniciando Servidor
app.listen(app.get('port'), () => {
    console.log('Servidor Conectado', app.get('port'));
});