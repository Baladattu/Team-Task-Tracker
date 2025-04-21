const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.localhost,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to Database');
    } catch (err) {
        throw new Error('Unable to connect to database', err);
    }
})();

module.exports = sequelize