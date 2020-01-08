const express = require('express');
const path = require('path');
const session = require('express-session');
const expbs = require('express-handlebars');
const pageRouter = require('./routes/pages');

const app = express();

app.use(express.urlencoded( { extended : false}));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', expbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Session

app.use(session({
    secret : 'je_sais_pas_quoi_mettre',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 *30} //30min
}));

//////////////////////////////////////////////////////////////////////////////////


app.use('/', pageRouter)

////////////////////////////////////////////////////////////////////

/*app.get('/connexion', function(req, res) {
    res.render('connexion', {title : 'Connexion'});
});

app.get('/inscription', function(req, res) {
    res.render('inscription',  {title : 'Inscription'});
});*/ 

////////////////// ERROR //////////////////////////////////////////////////////////////

app.use((req,res, next) => {
    var err = new Error('Error on the page...');
    err.status = 404;
    next(err);
});

app.use((err, req,res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});


app.listen(3000, () => {
    console.log('Server running on port', 3000);
});

module.exports = app;