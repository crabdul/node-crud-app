const config = {
    development: {
        username: "root",
        password: null,
        database: "node_course_database_development",
        host: "localhost",
        dialect: "postgres"
    },
    production: {
        username: "root",
        password: null,
        database: "node_course_database_production",
        host: "localhost",
        dialect: "postgres"
    }
};

module.exports = config;
