-- Active: 1697098245110@@127.0.0.1@3306@小学教务系统

CREATE TABLE
    student_users (
        stu_username VARCHAR (255) DEFAULT NULL,
        stu_password VARCHAR (255) DEFAULT NULL,
        `LEVEL` INT (11) DEFAULT 0
    );

CREATE TRIGGER AFTER_STUDENTS_INFO_INSERT AFTER INSERT 
ON STUDENT FOR EACH ROW BEGIN INSERT 
	INSERT INTO
	    student_users (
	        stu_username,
	        stu_password,
	        `LEVEL`
	    )
	VALUES (NEW.stu_id, '123456', 0);
	END;


CREATE TRIGGER AFTER_STUDENTS_INFO_DELETE AFTER DELETE 
ON STUDENT FOR EACH ROW BEGIN DELETE 
	DELETE FROM student_users WHERE stu_username = OLD.stu_id;
	END;
