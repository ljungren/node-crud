/* Create database and example data */

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `programs` (
  `program_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`program_id`)
);

CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `program_id` int(11),
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (`program_id`) REFERENCES programs(program_id)
);

INSERT INTO `programs` (`program_id`, `name`) VALUES
(1, 'ID'),
(2, 'CS'),
(3, 'IE');

INSERT INTO `students` (`student_id`, `name`, `email`, `program_id`) VALUES
(1, 'Joakim Ljungren', 'joakim@ljungren.se', '1'),
(2, 'John Doe', 'johndoe@gmail.com', '1'),
(3, 'Jane DOe', 'janedoe@gmail.com', '3'),
(4, 'Tarzan', 'tarzan@gmail.com', '2');