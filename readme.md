This is an example of RESTful CRUD in Node.js and mySQL.

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

http://localhost:3000/api/student/
