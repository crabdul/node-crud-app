const Sequelize = require("sequelize");
const config = require("./config");


// Provide fallback for NODE_ENV environment variable
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize('node_course_app', 'postgres', 'postgres', config[env]);

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
