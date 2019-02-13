//Copy this file and rename it to config.js, DON'T COMMIT config.js OR YOUR PASSWORD IS PUBLIC
//Every field is a string except for the port which is an int
var config = {};

config.db = {};
config.db.port = YOUR_MYSQL_PORT_HERE; //This normally defaults to 3306 unless you changed it while installing mysql
config.db.host = YOUR_MYSQL_HOST_HERE; //Likely localhost
config.db.user = YOUR_MYSQL_USER_HERE; //Whatever you set it to, depends on how you installed it
config.db.password = YOUR_MYSQL_PASSWORD_HERE; //Also whatever you set it to
config.db.database = YOUR_MYSQL_DATABASE_HERE; //Whatever you want to name the database

module.exports = config;
