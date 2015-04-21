CREATE TABLE Student(
	username VARCHAR(255) PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	tokens INTEGER NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	DOB DATE NOT NULL  -- Format is 'YYYY-MM-DD'
);

CREATE TABLE Majors(
	username VARCHAR(255) NOT NULL REFERENCES Student(username),
	major VARCHAR(255) NOT NULL,
	PRIMARY KEY(username, major)
);

CREATE TABLE Minors(
	username VARCHAR(255) NOT NULL REFERENCES Student(username),
	minor VARCHAR(255) NOT NULL,
	PRIMARY KEY(username, minor)
);

CREATE TABLE Document(
	DID INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	DOU DATE NOT NULL, -- Format is 'YYYY-MM-DD'
	teacher_name VARCHAR(255) NOT NULL, -- Needs to reference teacher_name in Teachers table
	-- CID VARCHAR(255) NOT NULL, -- Needs to reference CID in Class table, NOT IN PHASE 2 EER diagram
	votes INTEGER NOT NULL DEFAULT 0,
	season VARCHAR(6) NOT NULL check(season = 'Fall' or season = 'Spring' or season = 'Summer'),
	year CHAR(4) NOT NULL,
	type_flag CHAR(1) NOT NULL check(type_flag = 'A' or type_flag = 'N'),
	grade INTEGER,
	digitalform VARCHAR(255)  -- Not sure what to do with this, bool?
);

CREATE TABLE Uploaded(
	username VARCHAR(255) NOT NULL REFERENCES Student(username),
	DID INTEGER NOT NULL REFERENCES Document(DID),
	PRIMARY KEY(username, DID)
);

CREATE TABLE Comment(
	DID INTEGER NOT NULL REFERENCES Document(DID),
	time_stamp DATETIME NOT NULL,  -- Format is 'YYYY-MM-DD HH:MM:SS'
	content VARCHAR(500) NOT NULL,
	anonymous BOOL NOT NULL,
	PRIMARY KEY(DID, time_stamp)
);

-- Students Post Comments
CREATE TABLE Post(
	DID INTEGER NOT NULL REFERENCES Document(DID),
	time_stamp DATETIME NOT NULL REFERENCES Comment(time_stamp),
	username VARCHAR(255) NOT NULL REFERENCES Student(username),
	PRIMARY KEY(DID, time_stamp, username)
);

CREATE TABLE Class(
	CID VARCHAR(255) PRIMARY KEY
);

-- Not listed in Phase 2 EER model
CREATE TABLE Teacher(
	name VARCHAR(255) NOT NULL PRIMARY KEY
);

ALTER TABLE Document ADD FOREIGN KEY(teacher_name) REFERENCES Teacher(name);
-- ALTER TABLE Document ADD FOREIGN KEY(CID) REFERENCES Class(CID); -- Removed CID from document table

-- Called Teachers in Phase 2 EER model
CREATE TABLE Teaches(
	CID VARCHAR(255) NOT NULL REFERENCES Class(CID),
	teacher_name VARCHAR(255) NOT NULL REFERENCES Teacher(name),
	PRIMARY KEY(CID, teacher_name)
);

CREATE TABLE Department(
	abbreviation VARCHAR(255) NOT NULL PRIMARY KEY,
	dname VARCHAR(255) NOT NULL UNIQUE,
	location VARCHAR(255) NOT NULL
);

INSERT INTO Department VALUES('CS', 'Computer Science', '325 Computer Science Bldg.');
INSERT INTO Department VALUES('CpE', 'Computer Engineering', '141 Emerson Electric Co. Hall');
INSERT INTO Department VALUES('EE', 'Electrical Engineering', '141 Emerson Electric Co. Hall');
INSERT INTO Department VALUES('ME', 'Mechanical Engineering', '194 Toomey Hall');

CREATE TABLE Offered_By(
	CID VARCHAR(255) NOT NULL REFERENCES Class(CID),
	dept_abbreviation VARCHAR(255) NOT NULL REFERENCES Department(abbreviation),
	PRIMARY KEY(CID, dept_abbreviation)
);

INSERT INTO Class VALUES('CS 2300');
INSERT INTO Offered_By VALUES('CS 2300', 'CS');
INSERT INTO Class VALUES('CS 3800');
INSERT INTO Offered_By VALUES('CS 3800', 'CS');
INSERT INTO Class VALUES('EE 3410');
INSERT INTO Offered_By VALUES('EE 3410', 'EE');
INSERT INTO Class VALUES('EE 2100');
INSERT INTO Offered_By VALUES('EE 2100', 'EE');
INSERT INTO Class VALUES('CpE 5410');
INSERT INTO Offered_By VALUES('CpE 5410', 'CpE');



-- Not sure if this table should exist
CREATE TABLE Class_Document(
	DID INTEGER NOT NULL REFERENCES Document(DID),
	CID VARCHAR(255) NOT NULL REFERENCES Class(CID),
	PRIMARY KEY(DID, CID)
);
-- ADD teacher_name to class document table??? Need some link of teacher to class to doc












