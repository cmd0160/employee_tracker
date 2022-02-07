const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const rolesQuery = 'SELECT * from roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employees e'


require('dotenv').config();
const employeeQuery_all = 
    `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
    FROM employees e
    LEFT JOIN roles r 
    ON r.id = e.role_id 
    LEFT JOIN departments d 
    ON d.id = r.department_id
    LEFT JOIN employees m ON m.id = e.manager_id
    ORDER BY e.id;`

// Connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to db.');
});

const startApplication = () => {
    inquirer.prompt({
        name: 'appOptions',
        type: 'list',
        message: 'Select an Option',
        choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View all Departments', 'Add Department', 'Exit']
    }).then((answer) => {
        switch (answer.appOptions) {
            case 'View all Employees':
                showAllEmployees();
                break;
            case 'Add Employee':
                addEmployees();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'View all Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View all Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                    connection.end();
                break;
        }
    })
}

const showAllEmployees = () => {
    connection.query(employeeQuery_all, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(results)
        startApplication();
    })

}



startApplication();