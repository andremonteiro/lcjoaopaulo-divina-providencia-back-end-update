const Sequelize = require('sequelize');
module.exports = function () {
    const config = {
        host: 'divina-database.cuvvtyji1bfq.sa-east-1.rds.amazonaws.com',
        database: 'divina',
        user: 'divina',
        pass: 'divina123',
        adapter: 'postgres',
        reconnect: true,
        timezone: '-03:00',
        logging: console.log
    };
    // const config = {
    //     host: 'ec2-18-230-113-21.sa-east-1.compute.amazonaws.com',
    //     database: 'divina',
    //     user: 'ubuntu',
    //     pass: 'divina',
    //     adapter: 'postgres',
    //     reconnect: true,
    //     timezone: '-03:00',
    //     logging: console.log
    // };
    // const config = {
    //     host: 'localhost',
    //     database: 'divina-providencia',
    //     user: 'postgres',
    //     pass: 'adminpwd',
    //     adapter: 'postgres',
    //     reconnect: true,
    //     timezone: '-03:00',
    //     logging: console.log
    // };

    const connector = new Sequelize(config.database, config.user, config.pass, {
        host: config.host,
        dialect: config.adapter,
        timezone: config.timezone,
        reconnect: config.reconnect,
        logging: config.logging
    });

    return connector;
};