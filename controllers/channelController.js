const { validationResult } = require('express-validator/check');

const Channel = require('../models/channel');

exports.getAllChannels = (req, res) => {
    Channel.findAll()
        .then(channels => {
            res.send({
                status: 200,
                data: channels
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getChannelById = (req, res) => {
    const channelId = req.params.channelId;
    Channel.findByPk(channelId)
        .then(channel => {
            if (channel){
                res.send({
                    status: 200,
                    data: channel
                })
            } else {
                res.status(404).send({
                    status: 404,
                    message: 'Channel not found'
                })
            }
        })
        .catch(err => console.log(err));
}

exports.addChannel = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }

    Channel.findAll({
        where: {
            name: name
        }
    }).then(channel => {
        if (channel.length > 0) {
            return res.send({
                status: 422,
                error: "There is already one Channel with name: " + channel[0].name
            });
        } else {
            return Channel.create({
                        name,
                        description
                    }).then(channel => {
                        res.send({
                            status: 200,
                            data: channel
                        });
                    });
        }
    })
    .catch(err => {
        console.log(err);
    });
}

exports.editChannelById = (req, res) => {
    const channelId = req.params.channelId;
    const name = req.body.name;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }
    Channel.findByPk(channelId)
        .then(channel => {
            if (!channel) {
                return channel;
            }
            channel.name = name;
            channel.description = description;
            return channel.save();
        }).then(channel => {
            if (!channel) {
                return res.status(404).send({
                            status: 404,
                            message: 'Channel not found'
                        })
            }
            res.send({
                status: 200,
                data: channel
            });
        })
        .catch(err => console.log(err));
}

exports.deleteChannelById = (req, res) => {
//TODO: Add delete Channel
}