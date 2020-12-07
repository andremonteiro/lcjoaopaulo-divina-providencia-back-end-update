const Sequelize = require('sequelize');
module.exports = function (app) {
    const Plan = app.connector.define('enviroment', {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        key: {
            type: Sequelize.STRING,
            allowNull: false
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        freezeTableName: true,
        tableName: 'enviroment'
    });
    return Plan;
};
