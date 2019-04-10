//Copy this file and rename it to config.js, DON'T COMMIT config.js OR YOUR PASSWORD IS PUBLIC
//Every field is a string except for the port which is an int
var config = {};

config.db = {};
config.db.port = '3306'; //This normally defaults to 3306 unless you changed it while installing mysql
config.db.host = 'localhost'; //Likely localhost
config.db.user = 'root'; //Whatever you set it to, depends on how you installed it
config.db.password = ''; //Also whatever you set it to
config.db.database = 'Bookstore'; //Whatever you want to name the database

config.session = {};
config.session.secret = "keyboard cat"; //This should be a sufficiently unique key to handle sessions
config.session.maxAge = 86400000; //Change this to how long you want the session to last in milliseconds.  This is one day

module.exports = config;
