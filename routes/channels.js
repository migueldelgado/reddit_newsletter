const express = require('express');

const { check } = require('express-validator/check');

const channelController = require('../controllers/channelController');

const router = express.Router();

router.get('/all', channelController.getAllChannels);
router.get('/:channelId', channelController.getChannelById);
router.put('/:channelId/edit', 
    check('name').notEmpty(),
    check('description').isString(),
    channelController.editChannelById);
router.post('/add',
    check('name').notEmpty(),
    check('description').isString(),
    channelController.addChannel);

module.exports = router;