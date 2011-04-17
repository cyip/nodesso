var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events"),
    mongoose = require('mongoose'),
    models = require('./models'),
    db,
    User;

var token_emitter = new events.EventEmitter();

models.defineModels(mongoose, function() {
    User = mongoose.model('User');
    Session = mongoose.model('Session');
    db   = mongoose.connect('mongodb://localhost/test');
})

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var params = url.parse(request.url, true).query;
    if(uri === "/authenticate.json") {
        sys.puts("/authenticate.json");
        User.findOne({username: params['username'], password: params['password']}, function(err, user) {
            if(!user) {
                sys.puts("failed");
                response.writeHead(401, { "Content-Type" : "text/plain" });
                response.write(JSON.stringify({token: "fail"}));
                response.end();
            } else {
                sys.puts("success");
		var session = new Session();
		var token = session.token = session.randomToken();
		session.username = params['username'];
                response.writeHead(200, { "Content-Type" : "text/plain" });
                response.write(JSON.stringify({token: token}));
                response.end();
		session.save();
            }
        });
    }
    else if(uri === "/token_valid.json") {
        sys.puts("/token_valid.json");
	Session.findOne({token: params['token']}, function(err, session) {
            if(!session) {
                response.writeHead(401, { "Content-Type" : "text/plain" });
                response.write(JSON.stringify({tokenValid: "false"}));
                response.end();
            } else {
                response.writeHead(200, { "Content-Type" : "text/plain" });
                response.write(JSON.stringify({tokenValid: "true"}));
                response.end();
                session.save(); //renew token expiry
            }
	});
    }
    else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Hello World!");
        response.end();
    }
}).listen(8080);

function purge_tokens() {
}

setInterval(purge_tokens, 5000);

sys.puts("Server running at http://localhost:8080/");

