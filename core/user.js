const pool = require('./pool');

const shajs = require('sha.js');




function User() {};

User.prototype = {
    find : function(user = null, callback)
    {
        if(user) {
            var field = Number.isInteger(user) ? 'id_user' : 'username';
        }
        let sql = `SELECT * FROM members WHERE ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
        });
    },

    create : function(body, callback)
    {
        var pwd = body.password;
        let sha = shajs('sha256');
        body.password = sha.update(pwd).digest('hex');

        var bind = [];

        for(prop in body){
            bind.push(body[prop]);
        }
        let sql = `INSERT INTO members(username, password) VALUES (?, ?)`;

        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            callback(result.insertId);
        });
    },
    
    login : function(username, password, callback)
    {
        this.find(username, function(user) {
            if(user) {
                sha = shajs('sha256');
                console.log("password : "+ password);
                console.log("passSQL : "+user.password);

                   let hasedpwd = sha.update(password).digest('hex');
                    console.log("hasedpwd : "+hasedpwd);
                    if(hasedpwd === user.password) {
                        callback(user);
                        return;
                }
            }
            callback(null);
        });
    }

}

module.exports = User;