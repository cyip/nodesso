nodesso
========

## What's nodesso?

nodesso is an sso server implemented with node.js and mongoDB

nodesso support the following requests:
* /authenticate.json?username=[username]&password=[password]
* /token_valid.json?token=[token]
* /otp_exchange.json?otp=otp

## Installation

Install node.js.
    $ git clone github.com:joyent/node.git
    $ ./configure
    $ make
    $ sudo make install


Install mongoDB.  Download package from www.mongodb.org

Install mongoose which is a mongoDB object modeling tool.

    $ sudo npm install mongoose

## To Run

First, start up mongoDB. Use mongo db client to populate the database
    $ db.users.save({username: 'testusr0', password: 'password', otp_required: false});

Then start nodesso with
    $node sso.js
  


