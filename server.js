const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
require("dotenv").config();

// Variable declaration to establish connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});
// Connect
db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to db.");
});

// Starts the application
const startApplication = () => {
  inquirer
    .prompt({
      name: "appOptions",
      type: "list",
      message: "Select an Option",
      choices: [
        "View all Employees",
        "Add Employee",
        "Update Employee Role",
        "View all Roles",
        "Add Role",
        "View all Departments",
        "Add Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.appOptions) {
        case "View all Employees":
          showAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View all Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View all Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
};

// Function that displays all current Employees
const showAllEmployees = () => {
  let sql = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
    FROM employees e
    LEFT JOIN roles r 
    ON r.id = e.role_id 
    LEFT JOIN departments d 
    ON d.id = r.department_id
    LEFT JOIN employees m ON m.id = e.manager_id
    ORDER BY e.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
};

// Adds an employee
const addEmployee = () => {
  let sql = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
    FROM employees e
    LEFT JOIN roles r 
    ON r.id = e.role_id 
    LEFT JOIN departments d 
    ON d.id = r.department_id
    LEFT JOIN employees m ON m.id = e.manager_id
    ORDER BY e.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the new employees first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the new employees last name?",
        },
        {
          name: "role",
          type: "list",
          choices: [
            "Manager",
            "Accountant",
            "Software Engineer",
            "HR Rep",
            "Sales Rep",
          ],
          message: "Which role will the new employee be taking on?",
        },
        {
          name: "manager",
          type: "list",
          choices: ["Cory Davis", "Britton Gream"],
          message: "Which manager is in charge of the new employee?",
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                (SELECT id FROM roles WHERE title = ? ), 
                (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`,
          [answer.firstName, answer.lastName, answer.role, answer.manager]
        );
        startApplication();
      });
  });
};

const updateEmployeeRole = () => {
  const sql = `SELECT first_name FROM employees;`
  db.query(sql, (err, results) => {
      if (err) throw err;

      inquirer.prompt([
          {
              name: 'empl',
              type: 'list',
              choices: results,
              message: 'Select an employee to update their role:'
          },
          {
              name: 'newRole',
              type: 'list',
              choices: results
          }
      ]).then((answer) => {
          db.query(`UPDATE employees 
          SET role_id = (SELECT id FROM roles WHERE title = ? ) 
          WHERE id = (SELECT id FROM(SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.newRole, answer.empl], (err, results) => {
                  if (err) throw err;
                  startApplication();
              })
      })


  })

}

// Views all roles
const viewAllRoles = () => {
  let sql = `SELECT * FROM roles`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
};

// Adds a new role
const addRole = () => {
  let sql = `SELECT * FROM roles LEFT JOIN departments ON roles.id=departments.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);

    inquirer
      .prompt([
        {
          name: "newTitle",
          type: "input",
          message: "Enter the new Title:",
        },
        {
          name: "newSalary",
          type: "input",
          message: "Enter the salary for the new Title:",
        },
        {
          name: "dept",
          type: "list",
          choices: [
            "Management",
            "Accounting",
            "Tech",
            "Human Resources",
            "Sales Team",
          ],
          message: "Select the Department for this new Title:",
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO roles(title, salary, department_id) 
                VALUES
                ("${answer.newTitle}", "${answer.newSalary}", 
                (SELECT id FROM departments WHERE department_name = "${answer.dept}"));`
        );
        startApplication();
      });
  });
};

// Views all departments
const viewAllDepartments = () => {
  let sql = `SELECT * FROM departments`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
};

// Adds a department
const addDepartment = () => {
  let sql = `SELECT department_name AS "Departments" FROM departments`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);

    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "Enter the name of the Department to add:",
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO departments(department_name) VALUES( ? )`,
          answer.newDept
        );
        startApplication();
      });
  });
};

startApplication();
