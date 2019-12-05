const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Channel = sequelize.define('channel', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Channel;