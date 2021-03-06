CREATE TABLE Student(
	username VARCHAR(255) PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	tokens INTEGER NOT NULL DEFAULT 5,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	DOB DATE NOT NULL  -- Format is 'YYYY-MM-DD'
);

CREATE TABLE Majors(
	username VARCHAR(255) NOT NULL,
	major VARCHAR(255) NOT NULL,
	FOREIGN KEY (username) REFERENCES Student(username) ON DELETE CASCADE,
	PRIMARY KEY(username, major)
);

CREATE TABLE Minors(
	username VARCHAR(255) NOT NULL,
	minor VARCHAR(255) NOT NULL,
	FOREIGN KEY (username) REFERENCES Student(username) ON DELETE CASCADE,
	PRIMARY KEY (username, minor)
);

CREATE TABLE Document(
	DID INTEGER PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	DOU DATE NOT NULL, -- Format is 'YYYY-MM-DD'
	teacher_name VARCHAR(255) NOT NULL, -- Needs to reference teacher_name in Teachers table
	CID VARCHAR(255) NOT NULL, -- Needs to reference CID in Class table, NOT IN PHASE 2 EER diagram
	votes INTEGER NOT NULL DEFAULT 0,
	season VARCHAR(6) NOT NULL check(season = 'Fall' or season = 'Spring' or season = 'Summer'),
	year CHAR(4) NOT NULL,
	type_flag CHAR(1) NOT NULL check(type_flag = 'A' or type_flag = 'N'),
	grade INTEGER,
	digitalform VARCHAR(255)  -- Not sure what to do with this, bool?
);

CREATE TABLE Uploaded(
	username VARCHAR(255) NOT NULL,
	DID INTEGER NOT NULL,
	FOREIGN KEY (username) REFERENCES Student(username) ON DELETE CASCADE,
	FOREIGN KEY (DID) REFERENCES Document(DID) ON DELETE CASCADE,
	PRIMARY KEY(username, DID)
);

CREATE TABLE Comment(
	DID INTEGER NOT NULL,
	time_stamp DATETIME NOT NULL,  -- Format is 'YYYY-MM-DD HH:MM:SS'
	content VARCHAR(500) NOT NULL,
	anonymous BOOL NOT NULL,
	FOREIGN KEY (DID) REFERENCES Document(DID) ON DELETE CASCADE,
	PRIMARY KEY(DID, time_stamp)
);

-- Students Post Comments
CREATE TABLE Post(
	DID INTEGER NOT NULL,
	time_stamp DATETIME NOT NULL,
	username VARCHAR(255) NOT NULL,
	FOREIGN KEY (DID, time_stamp) REFERENCES Comment(DID, time_stamp) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES Student(username) ON DELETE CASCADE,
	PRIMARY KEY(DID, time_stamp, username)
);

CREATE TABLE Class(
	id INTEGER NOT NULL AUTO_INCREMENT,
	CID VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY(id)
);

-- Not listed in Phase 2 EER model
CREATE TABLE Teacher(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY(id)
);

ALTER TABLE Document ADD FOREIGN KEY (teacher_name) REFERENCES Teacher(name) ON DELETE CASCADE;
ALTER TABLE Document ADD FOREIGN KEY (CID) REFERENCES Class(CID) ON DELETE CASCADE;

-- Called Teachers in Phase 2 EER model
CREATE TABLE Teaches(
	CID VARCHAR(255) NOT NULL,
	teacher_name VARCHAR(255) NOT NULL,
	FOREIGN KEY (CID) REFERENCES Class(CID) ON DELETE CASCADE,
	FOREIGN KEY (teacher_name) REFERENCES Teacher(name) ON DELETE CASCADE,
	PRIMARY KEY(CID, teacher_name)
);

CREATE TABLE Department(
	abbreviation VARCHAR(255) NOT NULL PRIMARY KEY,
	dname VARCHAR(255) NOT NULL UNIQUE,
	location VARCHAR(255) NOT NULL
);

INSERT INTO Department VALUES('CS', 'Computer Science', '325 Computer Science Bldg.');
INSERT INTO Department VALUES('CpE', 'Computer Engineering', '141 Emerson Electric Co. Hall');
-- INSERT INTO Department VALUES('EE', 'Electrical Engineering', '141 Emerson Electric Co. Hall');
-- INSERT INTO Department VALUES('ME', 'Mechanical Engineering', '194 Toomey Hall');

CREATE TABLE Offered_By(
	CID VARCHAR(255) NOT NULL,
	dept_abbreviation VARCHAR(255) NOT NULL,
	FOREIGN KEY (CID) REFERENCES Class(CID),
	FOREIGN KEY (dept_abbreviation) REFERENCES Department(abbreviation) ON DELETE CASCADE,
	PRIMARY KEY(CID, dept_abbreviation)
);


INSERT INTO Student(username, password, email, first_name, last_name, DOB) VALUES('mvf4z7', '1234', 'mvf4z7@mst.edu', 'Mike', 'Fanger', '1987-06-17');
INSERT INTO Majors VALUES('mvf4z7', 'CpE');
INSERT INTO Minors VALUES('mvf4z7', 'CS');


-- CS Teachers and Classes being added to database

INSERT INTO Class(CID) VALUES('CS 1200');
INSERT INTO Offered_By VALUES('CS 1200', 'CS');

INSERT INTO Class(CID) VALUES('CS 1510');
INSERT INTO Offered_By VALUES('CS 1510', 'CS');

INSERT INTO Class(CID) VALUES('CS 1570');
INSERT INTO Offered_By VALUES('CS 1570', 'CS');

INSERT INTO Class(CID) VALUES('CS 1972');
INSERT INTO Offered_By VALUES('CS 1972', 'CS');

INSERT INTO Class(CID) VALUES('CS 2200');
INSERT INTO Offered_By VALUES('CS 2200', 'CS');

INSERT INTO Class(CID) VALUES('CS 2300');
INSERT INTO Offered_By VALUES('CS 2300', 'CS');

INSERT INTO Class(CID) VALUES('CS 2500');
INSERT INTO Offered_By VALUES('CS 2500', 'CS');

INSERT INTO Class(CID) VALUES('CS 3100');
INSERT INTO Offered_By VALUES('CS 3100', 'CS');

INSERT INTO Class(CID) VALUES('CS 3200');
INSERT INTO Offered_By VALUES('CS 3200', 'CS');

INSERT INTO Class(CID) VALUES('CS 3500');
INSERT INTO Offered_By VALUES('CS 3500', 'CS');

INSERT INTO Class(CID) VALUES('CS 3600');
INSERT INTO Offered_By VALUES('CS 3600', 'CS');

INSERT INTO Class(CID) VALUES('CS 3800');
INSERT INTO Offered_By VALUES('CS 3800', 'CS');

INSERT INTO Class(CID) VALUES('CS 4096');
INSERT INTO Offered_By VALUES('CS 4096', 'CS');

INSERT INTO Class(CID) VALUES('CS 5401');
INSERT INTO Offered_By VALUES('CS 5401', 'CS');


INSERT INTO Teacher(name) VALUES('Zhaozheng Yin');
INSERT INTO Teaches VALUES('CS 1200', 'Zhaozheng Yin');
INSERT INTO Teaches VALUES('CS 2500', 'Zhaozheng Yin');

INSERT INTO Teacher(name) VALUES('Daniel Tauritz');
INSERT INTO Teaches VALUES('CS 1200', 'Daniel Tauritz');
INSERT INTO Teaches VALUES('CS 5401', 'Daniel Tauritz');

INSERT INTO Teacher(name) VALUES('Maggie Xiaoyan Cheng');
INSERT INTO Teaches VALUES('CS 1200', 'Maggie Xiaoyan Cheng');
INSERT INTO Teaches VALUES('CS 4096', 'Maggie Xiaoyan Cheng');

INSERT INTO Teacher(name) VALUES('Angel Morales');
INSERT INTO Teaches VALUES('CS 1510', 'Angel Morales');
INSERT INTO Teaches VALUES('CS 4096', 'Angel Morales');
INSERT INTO Teaches VALUES('CS 3100', 'Angel Morales');

INSERT INTO Teacher(name) VALUES('Clayton Price');
INSERT INTO Teaches VALUES('CS 1570', 'Clayton Price');
INSERT INTO Teaches VALUES('CS 3500', 'Clayton Price');

INSERT INTO Teacher(name) VALUES('David Mentis');
INSERT INTO Teaches VALUES('CS 1510', 'David Mentis');
INSERT INTO Teaches VALUES('CS 1972', 'David Mentis');
INSERT INTO Teaches VALUES('CS 3600', 'David Mentis');

INSERT INTO Teacher(name) VALUES('Bushra Anjum');
INSERT INTO Teaches VALUES('CS 2200', 'Bushra Anjum');
INSERT INTO Teaches VALUES('CS 2500', 'Bushra Anjum');

INSERT INTO Teacher(name) VALUES('Dan Lin');
INSERT INTO Teaches VALUES('CS 1972', 'Dan Lin');
INSERT INTO Teaches VALUES('CS 2300', 'Dan Lin');
INSERT INTO Teaches VALUES('CS 3600', 'Dan Lin');

INSERT INTO Teacher(name) VALUES('Simone Silvestri');
INSERT INTO Teaches VALUES('CS 2500', 'Simone Silvestri');
INSERT INTO Teaches VALUES('CS 3100', 'Simone Silvestri');
INSERT INTO Teaches VALUES('CS 1510', 'Simone Silvestri');

INSERT INTO Teacher(name) VALUES('Fikret Ercal');
INSERT INTO Teaches VALUES('CS 3200', 'Fikret Ercal');
INSERT INTO Teaches VALUES('CS 3800', 'Fikret Ercal');


-- CpE Teacher sand Classes being added to database

INSERT INTO Class(CID) VALUES('CpE 2210');
INSERT INTO Offered_By VALUES('CpE 2210', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 3110');
INSERT INTO Offered_By VALUES('CpE 3110', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 3150');
INSERT INTO Offered_By VALUES('CpE 3150', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 5120');
INSERT INTO Offered_By VALUES('CpE 5120', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 5160');
INSERT INTO Offered_By VALUES('CpE 5160', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 5210');
INSERT INTO Offered_By VALUES('CpE 5210', 'CpE');

INSERT INTO Class(CID) VALUES('CpE 5310');
INSERT INTO Offered_By VALUES('CpE 5310', 'CpE');

INSERT INTO Teacher(name) VALUES('Ronald Stanley');
INSERT INTO Teaches VALUES('CpE 2210', 'Ronald Stanley');
INSERT INTO Teaches VALUES('CpE 3150', 'Ronald Stanley');

INSERT INTO Teacher(name) VALUES('Minsu Choi');
INSERT INTO Teaches VALUES('CpE 3110', 'Minsu Choi');
INSERT INTO Teaches VALUES('CpE 5120', 'Minsu Choi');

INSERT INTO Teacher(name) VALUES('Mihail Cutitaru');
INSERT INTO Teaches VALUES('CpE 3150', 'Mihail Cutitaru');
INSERT INTO Teaches VALUES('CpE 2210', 'Mihail Cutitaru');
INSERT INTO Teaches VALUES('CpE 3110', 'Mihail Cutitaru');

INSERT INTO Teacher(name) VALUES('William Hanna');
INSERT INTO Teaches VALUES('CpE 5120', 'William Hanna');
INSERT INTO Teaches VALUES('CpE 5310', 'William Hanna');

INSERT INTO Teacher(name) VALUES('Roger Younger');
INSERT INTO Teaches VALUES('CpE 5160', 'Roger Younger');
INSERT INTO Teaches VALUES('CpE 5210', 'Roger Younger');

INSERT INTO Teacher(name) VALUES('Yiyu Shi');
INSERT INTO Teaches VALUES('CpE 5210', 'Yiyu Shi');
INSERT INTO Teaches VALUES('CpE 2210', 'Yiyu Shi');

INSERT INTO Teacher(name) VALUES('Donald Wunsch');
INSERT INTO Teaches VALUES('CpE 5310', 'Donald Wunsch');


