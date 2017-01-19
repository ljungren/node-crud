This is an example of RESTful CRUD in Node.js and mySQL. Lists students of programs in a university.

## Installation

    npm install

## Configuration (database)
server.js

      host: 'localhost',
      user: 'root',
      password : 'root',
      port : 3306, //port mysql
      database:'university'	

## Serve
    
    nodemon server.js

access:

    http://localhost:3000/api/student/
