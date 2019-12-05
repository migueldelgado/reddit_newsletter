const express = require('express');

const { check } = require('express-validator/check');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/all', userController.getAllUsers);

router.post('/add', 
    check('email').isEmail(),
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('sendNewsletter').isBoolean(),
    userController.addUser);

router.get('/sendNewsletter', userController.sendNewsLetter);

router.put('/:userId/edit', 
    check('email').isEmail(),
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('sendNewsletter').isBoolean(),
    userController.editUserById);

router.get('/:userId', userController.getUserById);


module.exports = router;