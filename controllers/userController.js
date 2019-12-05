const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const User = require('../models/user');
const Channel = require('../models/channel');

const Sequelize = require('sequelize');

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => {
            res.send({
                status: 200,
                data: users
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getUserById = (req, res) => {
    const userId = req.params.userId;
    User.findByPk(userId)
        .then(user => {
            if (user){
                res.send({
                    status: 200,
                    data: user
                })
            } else {
                res.status(404).send({
                    status: 404,
                    message: 'User not found'
                })
            }
        })
        .catch(err => console.log(err));
}

exports.addUser = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const favoriteIds = req.body.favorites;
    let favoriteChannels;
    const sendNewsletter = req.body.sendNewsletter;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }

    Channel.findAll({
        where: {
            id: favoriteIds
        }
    })
    .then(channels => {
        favoriteChannels = channels;
        return User.findAll({
            where: {
                email: email
            }
        })
    })   
    .then(users => {
        if (users.length > 0) {
            return res.status(422).send({
                    status: 422,
                    error: "There is a user with email: " + users[0].email
                });
        }

        User.create({
            firstName,
            lastName,
            email,
            sendNewsletter
        })
        .then(user => {
            user.setChannels(favoriteChannels)
                .then(favorites => {
                    res.send({
                        status: 200,
                        data: {
                            user,
                            favorites
                        }
                    });
                });

        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.editUserById = (req, res) => {
    const userId = req.params.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const sendNewsletter = req.body.sendNewsletter;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return user;
            }
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.sendNewsletter = sendNewsletter;
            return user.save();
        }).then(user => {
            if (!user) {
                return res.status(404).send({
                            status: 404,
                            message: 'User not found'
                        })
            }
            res.send({
                status: 200,
                data: user
            });
        })
        .catch(err => console.log(err));
}

exports.deleteUserById = (req, res) => {
//TODO finish delete user
}

exports.sendNewsLetter = async (req, res) => {
    let baseUrl = 'https://www.reddit.com/r/';
    let endUrl = '/top.json?limit=3';
    let favorites = [];
    try {
        const users = await User.findAll();


        for (let i = 0 ; i < users.length ; i++){
            let channels = await users[i].getChannels();
            let userId = users[i].name;
            for (let j = 0 ; j < channels.length ; j++){
                let channelId = channels[j].id;
                let results = [];
                results[channelId] = await axios.get(baseUrl + channels[j].name + endUrl);
                favorites[channelId] = results[channelId].data.data.children;
            }

        }

        res.send(favorites);
    }
    catch(err) {
        console.log(err);
    }
}

function generateTemplate(user, posts) {
    let html =  '<p>Hello' + user.name + '</p>';
    for (let i = 0; i < posts.data.data.children.length ; i++){
        html += '<p>' + posts.data.data.children + '</p>'
    }
}


function sendEmail(user, template) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: user.email,
        from: 'no-reply@hear.com',
        subject: 'Reddit Newsletter',
        html: template
    };
    sgMail.send(msg);
    res.send({
        status: 200,
        message: 'Email sent...'
    });
}