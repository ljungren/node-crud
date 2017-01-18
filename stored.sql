DELIMITER //
CREATE PROCEDURE sp_filter(IN programName VARCHAR(255))
BEGIN
SELECT s.name, s.email, p.program_name
FROM students AS s INNER JOIN programs AS p ON s.program_id=p.program_id
WHERE p.program_name=programName;
END //
DELIMITER ;