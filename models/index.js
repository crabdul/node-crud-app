const Sequelize = require("sequelize");

const sequelize = new Sequelize('app', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

const models = {
    user: sequelize.import('./user.js'),
};

// Create associations between tables
Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
