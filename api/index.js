const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const checkIsInRole = require('../utility/auth');

const {ROLES, EVENT_CATEGORIES} = require('../utility/constants');

// load models
const Event = require('../models/Event');

// Welcome Page
router.get('/', (req, res) => res.redirect('/main'));

// main
router.get('/main', (req, res) =>{
  Event.find({}).then(events =>{
    res.render('main', {
      events, sortType: 'all'
    })
  })
});


// main sport
router.get('/main/sport', (req, res) =>{
  Event.find({category: EVENT_CATEGORIES.Sport}).then(events =>{
    res.render('main', {
      events, sortType: 'sport'
    })
  })
});

// main culture
router.get('/main/culture', (req, res) =>{
  Event.find({category: EVENT_CATEGORIES.Culture}).then(events =>{
    res.render('main', {
      events, sortType: 'culture'
    })
  })
});

// main other
router.get('/main/other', (req, res) =>{
  Event.find({category: EVENT_CATEGORIES.Other}).then(events =>{
    res.render('main', {
      events, sortType: 'other'
    })
  })
});

module.exports = router;
