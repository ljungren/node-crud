/* filter procedure */
DELIMITER //
CREATE PROCEDURE sp_filter(IN programName VARCHAR(255))
BEGIN
SELECT s.name, s.email, p.program_name
FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id
WHERE p.program_name=programName;
END //
DELIMITER ;

/* transaction procedure */
DELIMITER //
CREATE PROCEDURE transactions()
BEGIN

START TRANSACTION;
INSERT INTO students (name, email, program_id)
SELECT 'kalle', 'kalle@gmail.com', program_id FROM programs
WHERE program_name='ID';

UPDATE students s INNER JOIN programs p ON s.program_id = p.program_id
SET s.name = 'lasse', s.email = 'lasse@gmail.com', s.program_id = 2 
WHERE s.name = 'kalle';

SELECT s.student_id, s.name, s.email, p.program_name
FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id;

COMMIT;

END //
DELIMITER ;