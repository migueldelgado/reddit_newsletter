const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const User = require('../models/user');
const Channel = require('../models/channel');

const Sequelize = require('sequelize');

exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll();
        res.send({ status: 200, data: users });
    } catch(err) {
        console.log(err);
        res.send();
    }
}

exports.getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        let user = await User.findByPk(userId);
        if (user){
            let favorites = await user.getChannels();
            res.send({ status: 200, data: { user, favorites }});
        } else {
            res.status(404).send({ status: 404, message: 'User not found' })
        }
    } catch(err) {
        console.log(err);
        res.send();
    }
}

exports.addUser = async (req, res) => {
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

    try {
        favoriteChannels = await Channel.findAll({ where: { id: favoriteIds } });
        let users = await User.findAll({ where: { email: email } });

        if (users.length > 0) {
            return res.status(422).send({
                status: 422,
                error: "There is a user already with this email: " + users[0].email
            });
        }

        let user = await User.create({
            firstName,
            lastName,
            email,
            sendNewsletter
        });

        let favorites = await user.setChannels(favoriteChannels);

        res.send({
            status: 200,
            data: {
                user,
                favorites
            }
        });
    } catch(err) {
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.editUserById = async (req, res) => {
    const userId = req.params.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const sendNewsletter = req.body.sendNewsletter;
    const favoriteIds = req.body.favorites;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }
    try {
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: 'User not found'
            })
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.sendNewsletter = sendNewsletter;
        await user.setChannels(favoriteIds);
        await user.save();
        let favorites = await user.getChannels();

        res.send({ status: 200, data: { user, favorites } });

    } catch(err){
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.deleteUserById = (req, res) => {
//TODO finish delete user
}

exports.sendNewsLetter = async () => {
    let baseUrl = 'https://www.reddit.com/r/';
    let endUrl = '/top.json?t=day&limit=3';

    try {
        const users = await User.findAll();
        let results = [];

        (async () => {
            await asyncForEach(users, async (user, idx1) => {
                // With this condition we will check if the user is activate or not to received emails
                if (user.sendNewsletter) {
                    let channels = await user.getChannels();
                    let userCopy = {};
                    let template;
                    
                    userCopy.id = user.id;
                    userCopy.firstName = user.firstName;
                    userCopy.email = user.email;
                    userCopy.channels = [];

                    await asyncForEach(channels, async (channel, idx2) => {
                        let url = baseUrl + channel.name;
                        let redditChannel = await axios.get(url + endUrl);
                        userCopy.channels.push({
                            id: channel.id,
                            name: channel.name,
                            url: url,
                            posts: redditChannel.data.data.children
                        });
                    })
                    template = generateTemplate(userCopy);
                    sendEmail(userCopy.email, template);
                    results.push(userCopy);
                }
            });
            console.log(results);
        })();
    }
    catch(err) {
        console.log(err);
    }
}

function generateTemplate(user) {
    let html =  `
        <p>
            Hello ${ user.firstName },<br>
            See yesterday's top voted posts from your favorite channel
        </p>
        ${ user.channels.map(
            channel => {
                return `
                    <div class="main-title" style="margin-top: 30px;">
                        <span class="channelTitle" style="border: 2px solid; padding: 7px;">
                            <span class="channel" style="font-size: 20px; font-weight: bold;">${ channel.name }:</span> 
                            <a href="${ channel.url }/top" target="_blank">${ channel.url }/top</a>
                        </span>
                    </div>
                    ${ channel.posts.map(
                        post => {
                            let num = post.data.score;
                            let score = Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num);
                            return `
                                <div class="article" style="margin-top: 40px;">
                                    <span class="score" style="border: 1px solid; border-radius: 25px; padding: 12px; margin-right: 15px; background: rgb(245, 177, 50); color: white; font-weight: bold;">
                                        ${ score }
                                    </span>
                                    <span class="title">${ post.data.title }</span>
                                </div>
                            `
                        }).join('')
                    }
                `
            }).join('')
        }
    `
    return html;
}


function sendEmail(email, template) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'no-reply@hear.com',
        subject: 'Reddit Newsletter',
        html: template
    };
    sgMail.send(msg)
        .then(result => {
            console.log('email sent');
        })
        .catch(err => {
            console.log('there is a problem with sendgrid');
        });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}