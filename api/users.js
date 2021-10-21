const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');

const  {ROLES} = require("../utility/constants");

// team
router.get('/team', (req, res) => res.render('team'));

// blog
router.get('/blog', (req, res) => res.render('blog'));

// blog
router.post('/blog', (req, res) => {
    const { name, email, phone, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2 || !phone) {
        errors.push({ msg: 'Please enter all fields' });
    }

    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!emailRegex.test(email)){
        errors.push({ msg: 'Invalid Email !' });
    }

    var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
    if(!phoneRegex.test(phone)){
        errors.push({ msg: 'Invalid Contact number !' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('blog', {
            errors,
            name,
            email,
            phone,
            password,
            password2
        });
    }
    else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('blog', {
                    errors,
                    name,
                    email,
                    phone,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    phone,
                    password,
                    role: ROLES.Organizer
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now bloged and can log in');
                                res.redirect('/users/team');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// team
router.post('/team', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/users/team',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});



module.exports = router;
