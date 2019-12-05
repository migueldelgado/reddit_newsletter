const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    sendNewsletter: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = User;