const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'astoria_node',
    'homestead',
    'secret',
    {
        dialect: 'mysql',
        host: '192.168.10.100'
    }
);

module.exports = sequelize;