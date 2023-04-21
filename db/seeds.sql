INSERT INTO department (name)
VALUES
("Marine"),
("Pirate"),
("Revolutionary"),
("Shichibukai"),
("Bounty Hunter");

INSERT INTO role (title, salary, department_id)
VALUES
("Captain", 100000, 2),
("Navigator", 90000, 1),
("First Mate", 82000, 2),
("Sniper", 4000, 5),
("Chef", 7000, 3);

INSERT INTO employee (last_name, first_name, role_id, manager_id)
VALUES
("Monkey D.", "Luffy", 1, NULL),
("Roronoa", "Zoro", 3, 1),
("Nami", "", 2, 1),
("Usopp", "", 4, 1),
("Sanji", "", 5, 1);
