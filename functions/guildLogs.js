const Sequelize = require('sequelize');

const guildLogsInit = function() {
    // sequelize initialization for punishmentLog
    const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'guildLogs.sqlite',
    });

    //punishment log definition
    const punishmentLog = sequelize.define('punishmentLog', {
    guildid: Sequelize.STRING,
    userid: Sequelize.STRING,
    username: Sequelize.STRING,
    punishment: Sequelize.STRING,
    reason: Sequelize.STRING,
    punishmentTime: Sequelize.INTEGER,
    staffName: Sequelize.STRING,
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    });

    const ticketLog = sequelize.define('ticketLog', {
    guildid: Sequelize.STRING,
    userid: Sequelize.STRING,
    ticketReason: Sequelize.STRING,
    closeReason: Sequelize.STRING,
    });

    return {
        punishmentLog, ticketLog,
    };
};

module.exports = {
    guildLogsInit,
};