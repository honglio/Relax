# Relax #
--------

Just another social media written with Node.js and MongoDB. Relax will allow creating a details profile page, adding photos, following other users, chat, private message, posting on other walls etc.

Relax is a work in progress.

[![Build Status](https://secure.travis-ci.org/honglio/Relax.png?branch=master)](http://travis-ci.org/andzdroid/mongo-express) - Master (stable) branch

[![Build Status](https://secure.travis-ci.org/honglio/Relax.png?branch=develop)](http://travis-ci.org/andzdroid/mongo-express) - Develop branch


Features
--------

Current features:

* Connect/Unconnected to contact
* register and authenticate an account
* view all contact of a user
* View/add/rename/delete articles
* View/add/update/delete users
* View/add/rename/delete comment
* REST interface

Limitations
-----------

* User login from 3rd party overwrite current user's profile info.
* No Chat support (might become a planned feature)
* add/cancel friends not tested

**Relax should only be used privately for development purposes**.


Screenshots
-----------

<img src="http://honglio.github.io/images/portfolio/big/3.jpg" title="Login Page" />
These screenshots are from version 0.3.0.


Usage
-----

**To install:**

    npm install

**To configure:**

Copy or rename `config.default.js` into a new file called `config.js`.

Fill in your MongoDB connection details, and any other options you want to change.

**To run:**

    node app

**To use:**

Visit `http://localhost:3000` or whatever URL/port you entered into your config.


License
-------
MIT License

Copyright (c) 2012 Hong Liu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
