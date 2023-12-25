-- Active: 1697098245110@@127.0.0.1@3306@小学教务系统

ALTER TABLE class ADD COLUMN c_type ENUM('0', '1', '2')

ALTER TABLE student ADD COLUMN stu_sex ENUM('0', '1');

ALTER TABLE class DROP COLUMN c_type;

ALTER TABLE student_extra DROP COLUMN task_id;

ALTER TABLE student DROP COLUMN stu_place;

ALTER TABLE student DROP COLUMN stu_bornDate;

CREATE Table
    user(
        id int(11) NOT NULL,
        username varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        phone varchar(255) NOT NULL,
        state enum('s', 't', 'd') not null
    );

# SELECT *
# FROM `user`;
/* 学校信息表 */
CREATE Table
    school(
        school_id int(11) NOT NULL AUTO_INCREMENT,
        school_name varchar(255) NOT NULL,
        school_address varchar(255) NOT NULL,
        school_type varchar(255) NOT NULL,
        school_linkman varchar(255) NOT NULL,
        school_phone varchar(255) NOT NULL,
        PRIMARY KEY (school_id)
    );

SELECT * FROM school;

/* 教职工信息表 */

CREATE Table
    teacher(
        t_id int(11) NOT NULL AUTO_INCREMENT,
        t_name varchar(255) NOT NULL,
        t_sex ENUM('0', '1'),
        t_phone varchar(255) NOT NULL,
        t_IDtype ENUM(
            '护照',
            '身份证',
            '军官证',
            '港澳通行证',
            '台胞证',
            '其他'
        ) NOT NULL,
        t_IDnumber VARCHAR(255) NOT NULL,
        t_m varchar(255) NOT NULL,
        t_address varchar(255) NOT NULL,
        t_email varchar(255),
        t_date DATETIME,
        t_status ENUM('0', '1', '2'),
        PRIMARY KEY (t_id)
    );

/* 教职工岗位信息表 */

CREATE Table
    Post(
        t_id int(11) NOT NULL,
        post_id int(11) NOT NULL,
        post_name varchar(255) NOT NULL
    );

/* 教职工教学科目信息表 */

CREATE Table
    teacher_subject(
        t_id int(11) NOT NULL,
        sub_id int(11) NOT NULL,
        g_id int(11) NOT NULL
    );

/* 学生基本信息表 */

CREATE Table
    student(
        stu_id int(11) NOT NULL AUTO_INCREMENT,
        stu_name VARCHAR(255) NOT NULL,
        stu_IDtype ENUM(
            '护照',
            '身份证',
            '军官证',
            '港澳通行证',
            '台胞证',
            '其他'
        ) NOT NULL,
        stu_IDnumber VARCHAR(255) NOT NULL,
        stu_createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stu_M VARCHAR(255),
        stu_bornDate DATE,
        stu_linkman VARCHAR(255) NOT NULL,
        stu_phone VARCHAR(255) NOT NULL,
        stu_place VARCHAR(255) NOT NULL,
        stu_address VARCHAR(255) NOT NULL,
        primary key (stu_id)
    );

/* 学生外键表 */

CREATE Table
    student_extra(
        stu_id int(11) NOT NULL,
        g_id int(11) NOT NULL,
        c_id int(11) NOT NULL,
        task_id int(11) NOT NULL
    );

/* 班级表 */

CREATE Table
    class (
        c_id int(11) NOT NULL AUTO_INCREMENT,
        c_name varchar(255) NOT NULL,
        c_headmaster int(11) NOT NULL,
        primary key (c_id)
    );

/* 班级额外信息表 */

CREATE Table
    class_extra(
        c_id int(11) NOT NULL,
        t_id VARCHAR(255) NOT NULL,
        g_id int(11) NOT NULL
    );

/* 年级表 */

CREATE Table
    grade (
        g_id int(11) NOT NULL AUTO_INCREMENT,
        g_name varchar(255) NOT NULL,
        g_headmaster int(11) NOT NULL,
        primary key (g_id)
    );

/* 必修课程表 */

CREATE Table
    main_class(
        mc_id int(11) NOT NULL AUTO_INCREMENT,
        mc_name varchar(255) NOT NULL,
        primary key (mc_id)
    );

/* 选修课程表 */

CREATE Table
    assist_class(
        ac_id int(11) NOT NULL AUTO_INCREMENT,
        ac_name varchar(255) NOT NULL,
        sub_year VARCHAR(255) NOT NULL,
        g_id int(11) NOT NULL,
        ac_status ENUM('0', '1'),
        primary key (ac_id)
    );

/* 排课 */

CREATE TABLE
    course_scheduling(
        cs_id int(11) NOT NULL AUTO_INCREMENT,
        cs_name VARCHAR(255) NOT NULL,
        cs_status ENUM('0', '1', '2'),
        cs_title VARCHAR(255),
        cs_max INT(11),
        cs_min INT(11),
        cs_date DATETIME,
        primary key (cs_id)
    );

CREATE Table
    course_scheduling_extra(
        cs_id int(11) NOT NULL,
        t_id int(11) NOT NULL,
        /* 可选课程为字符串类型 */
        sub_ids VARCHAR(255) NOT NULL,
        g_id int(11) NOT NULL,
        /* 可以选课得对象 */
        c_ids VARCHAR(255) NOT NULL primary key (cs_id)
    );

/* 选课互斥 */

CREATE Table
    course_scheduling_mutual(
        /* cs_id int(11) NOT NULL, */
        c_id1 int(11) NOT NULL,
        c_id2 int(11) NOT NULL
    );

/* 连选 */

CREATE Table
    course_scheduling_continue(
        /* cs_id int(11) NOT NULL, */
        c_id1 int(11) NOT NULL,
        c_id2 int(11) NOT NULL
    );

/* 禁选 */

CREATE Table
    course_forbid(
        cs_id int(11) NOT NULL,
        c_id1 int(11) NOT NULL
    );