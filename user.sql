-- 创建用户表
CREATE TABLE
    user (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `level` INT(11) NOT NULL
    );

-- 触发器：学生用户表插入后触发
CREATE TRIGGER AFTER_STUDENT_USER_INSERT AFTER INSERT 
ON STUDENT_USERS FOR EACH ROW BEGIN INSERT 
	INSERT INTO
	    user (username, `password`, `level`)
	VALUES (
	        NEW.stu_username,
	        NEW.stu_password,
	        NEW.level
	    );
	END;


-- 触发器：学生用户表删除后触发
CREATE TRIGGER AFTER_STUDENT_USER_DELETE AFTER DELETE 
ON STUDENT_USERS FOR EACH ROW BEGIN DELETE 
	DELETE FROM user WHERE username = OLD.stu_username;
	END;


-- 触发器：教师用户表插入后触发
CREATE TRIGGER AFTER_TEACHER_USER_INSERT AFTER INSERT 
ON TEACHER_USERS FOR EACH ROW BEGIN INSERT 
	INSERT INTO
	    user (username, `password`, `level`)
	VALUES (
	        NEW.t_username,
	        NEW.t_password,
	        NEW.level
	    );
	END;


-- 触发器：教师用户表删除后触发
CREATE TRIGGER AFTER_TEACHER_USER_DELETE AFTER DELETE 
ON TEACHER_USERS FOR EACH ROW BEGIN DELETE 
	DELETE FROM user WHERE username = OLD.t_username;
	END;


/ /

DELIMITER;