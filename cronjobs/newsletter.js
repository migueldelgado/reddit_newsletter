const cron = require('node-cron');

const userController = require('../controllers/userController');

const newsletterCron = () => {
    //Will send an email everyday at 8am
    cron.schedule('0 8 * * *', () => { 
        console.log("Running Cron Job");
        userController.sendNewsLetter();
        console.log("---------------------");
        console.log('Newsletter Emails Sent...');
    });
}

module.exports = newsletterCron;