const { validationResult } = require('express-validator/check');

const Channel = require('../models/channel');

exports.getAllChannels = async (req, res) => {
    try {
        let channels = await Channel.findAll();
        res.send({ status: 200, data: channels });
    } catch(err) {
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.getChannelById = async (req, res) => {
    const channelId = req.params.channelId;

    try {
        let channel = await Channel.findByPk(channelId);
        if (channel){
            return res.send({ status: 200, data: channel });
        }

        res.status(404).send({
            status: 404,
            message: 'Channel not found'
        })
    } catch(err) {
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.addChannel = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }
    try {
        let channels = await Channel.findAll({ where: { name: name } });
        if (channels.length > 0) {
            return res.send({
                status: 422,
                error: "Channel name already exist: " + channels[0].name
            });
        }

        let channel = await Channel.create({ name, description });
        res.send({ status: 200, data: channel });
    } catch(err) {
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.editChannelById = async (req, res) => {
    const channelId = req.params.channelId;
    const name = req.body.name;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.status = 422;
        return res.status(422).send(errors);
    }

    try{
        let channel = await Channel.findByPk(channelId);
        if (!channel) {
            return res.status(404).send({
                        status: 404,
                        message: 'Channel not found'
                    })
        }

        channel.name = name;
        channel.description = description;
        await channel.save();

        res.send({ status: 200, data: channel });
    } catch(err) {
        console.log(err);
        res.send({ message: 'Internal Error' });
    }
}

exports.deleteChannelById = (req, res) => {
//TODO: Add delete Channel
}