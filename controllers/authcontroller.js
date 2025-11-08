const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSignupPage = (req, res, next) => {
    res.render('signup', {
        pageTitle: 'Sign Up',
    });
};

exports.postSignup = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword
        });
        
        await user.save(); 

        // console.log('User created!');
        res.redirect('/'); 

    } catch (err) {
        console.log(err);
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user; 
            
            req.session.save(err => {
                if(err) console.log(err);
                // console.log('User logged in!');
                res.redirect('/dashboard');
            });
        } else {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        // console.log('User logged out');
        res.redirect('/');
    });
};