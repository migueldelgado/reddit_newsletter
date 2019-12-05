const express = require('express');

const bodyParser = require('body-parser');

// Routes
const userRoutes = require('./routes/users');
const channelRoutes = require('./routes/channels');

//Models
const User = require('./models/user');
const Channel = require('./models/channel');
const Favorite = require('./models/favorite');

const sequelize = require('./config/database');

const app = express();
app.get('/favicon.ico', (req, res) => res.status(204));

//will parse body parameters
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/channel', channelRoutes);

app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'Not found'
    });
});

//Relationships
User.belongsToMany(Channel, { through: Favorite });
Channel.belongsToMany(User, { through: Favorite });

// sequelize.sync({ force: true })
sequelize.sync()
    .then(res => {
        // console.log(res);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })