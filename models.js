var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

function defineModels(mongoose, fn) {
    User = new Schema({
        username    : { type: String, unique: true }
      , password    : String
      , realm       : String
//      , static: {
//            authenticate: function(username, password) {
//                return this.find({username: username, password: password});
//            }
//        }
    });

//    User.method('authenticate', function(password) {
//        return this.password === password;
//    });
//
//    User.method('randomToken', function() {
//        return Math.round((new Date().valueOf() * Math.random())) + '';
//    });

    User.static({
        authenticate: function(username, password) {
            this.findOne({username: username, password:password}, function(err, user) {
                if(!user) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    });

    Session = new Schema({
        username: String
      , token   : String
      , expire  : Date
    });

    Session.method('randomToken', function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    Session.method('updateExpiry', function() {
      return new Date(Date.now() + 2 * 604800000);
    });

    Session.pre('save', function(next) {
       // Automatically create the tokens
       //this.token = this.randomToken();
       this.expire = this.updateExpiry();

       if (this.isNew)
         this.series = this.randomToken();

       next();
    });


    //mongoose.model('User', {
    //    properties: ['username', 'password', 'realm'],
    //    indexes: ['username', 'password'],
    //    static: {
    //        authenticate: function(login, passwod) {
    //            return this.find({login: login, password: password});
    //        }
    //    }
    //});

    mongoose.model('User', User);
    mongoose.model('Session', Session);

    fn();
}

exports.defineModels = defineModels;


