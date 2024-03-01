
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'CommuniCraft'
  });

const controller = class UsersController {
    getUserByEmail(email){
        return new Promise((resolve,reject) => {
            connection.query('SELECT * FROM `users` WHERE `email` = "'+email+'"', function (err, result) {
                if (result.length < 1) {
                    reject(new Error("User not found"));
                } else {
                    resolve(result[0]);
                }
            });
        });
    }
}
module.exports = controller