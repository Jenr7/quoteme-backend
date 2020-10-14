var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth'); 

router.get('/', (req, res) => {

    let token = req.cookies.token;
    authService.verifyUser(token).then(user => {

        if(user == null){
            return res.json({message: "User not logged in."})
        }

        models.quotes.findAll({ where: {
            ownedBy: user.id
        }}).then(quotesFound =>{
            res.json({ quotes: quotesFound});
        })
    });
})

router.get('/:id', (req, res) => {

    let token = req.cookies.token;
    authService.verifyUser(token).then(user => {

        if(user == null){
            return res.json({message: "User not logged in."})
        }

        models.quotes
        .findOne({
            where: {
                id: parseInt(req.params.id),
                ownedBy: user.id
            }
        }).then(quoteFound => {
            res.json({quote: quoteFound})
        })
    })
})

router.post('/add', (req, res) => {
    let token = req.cookies.token;
    authService.verifyUser(token).then(user => {

        if(user == null){
            return res.json({message: "User not logged in."})
        }
        models.quotes.create({...req.body, ownedBy: user.id}).then(newQuote =>{
            res.json({quote: newQuote});
        }).catch(err => {
            res.status(400);
            res.send(err.message);
        });
    });
})

router.put('/:id', (req, res) => {
    let token = req.cookies.token;
    authService.verifyUser(token).then(user => {

        if(user == null){
            return res.json({message: "User not logged in."})
        }
        models.quotes.update(req.body, { where: { id: parseInt(req.params.id), ownedBy: user.id}})
        .then(result => res.json({message: "Quote has been updated!"}))
        .catch(err =>{
            res.status(400);
            res.json({message: "There was an error updating the quote!"})
        })
    });
})

router.delete('/:id', (req, res) => {
    let token = req.cookies.token;
    authService.verifyUser(token).then(user => {

        if(user == null){
            return res.json({message: "User not logged in."})
        }
        models.quotes.destroy({ where: { id: parseInt(req.params.id), ownedBy: user.id}})
        .then(result => res.json({message: "Quote has been deleted!"}))
        .catch(err =>{
            res.status(400);
            res.json({message: "There was an error deleting the quote!"})
        })
    });
});

module.exports = router;