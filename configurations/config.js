const Sequelize = require("sequelize");
const config = new Sequelize("school", "user", "", {dialect: "mysql"});

module.exports = config;