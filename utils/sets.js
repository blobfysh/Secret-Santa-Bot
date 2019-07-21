const config = require('../json/config.json');

//contains all banned user ids
var bannedUsers = new Set(); 

// Admin IDs, add yourself to this in config.json
const adminUsers = new Set(config.adminUsers);

module.exports = {
    bannedUsers,
    adminUsers
}