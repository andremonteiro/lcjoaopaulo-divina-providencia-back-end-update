// const Sequelize = require('sequelize');
// module.exports = function (app) {
//     const Plan = app.connector.define('plan', {
//         id: {
//             primaryKey: true,
//             type: Sequelize.INTEGER,
//             autoIncrement: true
//         },
//         text: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         price: {
//             type: Sequelize.DOUBLE,
//             allowNull: false,
//             unique: true
//         }
//     }, {
//         createdAt: false,
//         updatedAt: false,
//         deletedAt: false,
//         freezeTableName: true,
//         tableName: 'plan'
//     });
//     return Plan;
// };
