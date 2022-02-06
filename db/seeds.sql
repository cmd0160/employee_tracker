INSERT INTO departments (department_name)
VALUES
('Management'),
('Accounting'),
('IT'),
('Human Resources'),
('Sales Team');

INSERT INTO roles (title, salary, department_id)
VALUES
('Manager', 140000, 1),
('Accountant', 70000, 2),
('Software Engineer', 90000, 3),
('HR Rep', 80000, 4),
('Sales Rep', 55000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Cory', 'Davis', 1, NULL),
('Britton', 'Gream', 1, NULL),
('Ron', 'Swanson', 5, 1),
('Andy', 'Dwyer', 4, 2),
('Ron', 'Dunn', 2, 1),
('Jeffrey', 'Lebowski', 3, 2),
('Troy', 'Aikman', 5, 1),
('Dak', 'Prescott', 5, 2),
('Ann', 'Perkins', 4, 1),
('Leslie', 'Knope', 3, 2),
('Ben', 'Wyatt', 2, 1);