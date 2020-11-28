const Sequelize = require('sequelize');
module.exports = function (app) {
    const User = app.connector.define('usuario', {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subscription: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        freezeTableName: true,
        tableName: 'usuario'
    });
    return User;
};
