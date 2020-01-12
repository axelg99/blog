const express = require('express');
const User = require('../core/user');
const pool = require('../core/pool');
const router = express.Router();

const user = new User();

router.get('/', (req,res, next) => {
    let user = req.session.user;
    if(user) {
        res.redirect('/home');
        return;
    }
    res.render('inscription', { title : "My Blog"});
    
});

router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {
     pool.query('SELECT * FROM articles', function(err, bddart) {
            
        res.render('home', {opp:req.session.opp, name: user.username, article : bddart});
        });
        return;
    }
    res.redirect('/');
});

router.post('/connexion', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result) {
        console.log(req.body);
        if(result) {

            req.session.user = result;
            req.session.opp = 1;

            res.redirect('/home');

        } 
        else {
            res.send('Identifiant ou Mot de passe incorrect.');
        }
    });
});

router.post('/inscription', (req, res, next) => {
    let userInput = {
        username: req.body.username,
        password: req.body.password
    };
    user.create(userInput, function(lastId) {
        if(lastId) {
           
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            })
        }
        else {
            console.log('Error creating a new user....');
        }
    });
});

router.get('/home/new_art', (req, res, next) => {
    res.render('new_art', { title : "My Blog"});
});

router.post('/home/new_art', async (req, res) => {
    const { name_art, article, tag} = req.body;
    const newlink = {
        name_art,
        article,
        tag
    };

    await pool.query('INSERT INTO articles set ?', [newlink]);
    res.redirect('/home');
    
});


router.get('/home/commentaires/', (req, res, next) => {
    res.render('comm', { title : "My Blog", name: user.username});
});

router.post('/home/commentaires/', async (req, res) => {
    pool.query('SELECT * FROM commentaires', function(err, bddcomm) {
            
        res.render('comm', {name: user.username, comm : bddcomm});
        });
        return;
    
});

router.get('/loggout', (req, res, next) => {
   
    if(req.session.user) {
       
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});
module.exports = router;