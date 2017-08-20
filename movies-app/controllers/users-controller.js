const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

const usersController = {};

usersController.create = (req, res) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password_digest: hash,
    }).then(user => {
        req.login(user, (err) => {
            if (err) return next(err);
                res.json({
                    message: 'ok',
                    user: user,
                auth: true,
            })
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

usersController.index = (req, res) => {
    User.findUserMovies(req.params.id || null)
    .then(movies => {
        res.json({
        user: req.user,
        movies: movies,
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({err: err});
    });
}

module.exports = usersController;
