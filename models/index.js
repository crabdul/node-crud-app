import Sequelize from "sequelize";

const sequelize = new Sequelize('app', 'postgres', 'postgres');

const models = {
    user: sequelize.import('./user'),
};

// Create associations between tables
Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
