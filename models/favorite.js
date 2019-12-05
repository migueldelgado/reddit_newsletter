const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Favorite = sequelize.define('favorite', {});

module.exports = Favorite;