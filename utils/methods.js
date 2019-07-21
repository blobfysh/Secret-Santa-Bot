const Discord = require("discord.js");
const { query } = require('../mysql.js');
const config = require('../json/config.json');
const fs = require("fs");

class Methods {
    async createNewUser(userId){
        try{
            await query(`INSERT IGNORE INTO users (
                userId,
                exchangeId,
                wishlist,
                partnerId) VALUES (
                    ?, 0, '', 0
                )
            `, [userId]);
            return true;
        }
        catch(err){
            return false;
        }
    }
}

module.exports = new Methods();