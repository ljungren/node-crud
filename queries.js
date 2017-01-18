//get all
var query = conn.query("SELECT s.name, s.email, p.program_name " + 
            "FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id",function(err,rows){

//get some 
var query = conn.query("SELECT s.name, s.email, p.program_name " + 
            "FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id" +
            "WHERE p.program_name= + " data.filter + ";",function(err,rows){

//post
var query = conn.query("INSERT INTO students (name, email, program_id) " +
            "SELECT '" + data.name + "', '" + data.email + "', program_id FROM programs " + 
            "WHERE program_name='" + data.program_name + "';", function(err, rows){

//get single and update
var query = conn.query("SELECT s.student_id, s.name, s.email, p.program_name FROM students AS s, programs AS p " + 
            "WHERE s.program_id=p.program_id AND student_id = " + student_id + ";", function(err,rows){

var query = conn.query("UPDATE students s INNER JOIN programs p ON s.program_id = p.program_id " + 
            "SET s.name = ?, s.email = ?, p.program_name = ? " + 
            "WHERE s.student_id = ?;", [data.name, data.email, data.program_name, student_id], function(err,rows){

//delete
var query = conn.query("DELETE FROM students WHERE student_id = ? ", [student_id], function(err, rows){