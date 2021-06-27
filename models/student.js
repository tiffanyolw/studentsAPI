const Sequelize = require("sequelize");
const config = require("./../configurations/config");

const Student = config.define("Student", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    section: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    gpa: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {timestamps:false});

module.exports = Student;