const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
require('dotenv').config();



// Variable declaration to establish connection
const db = mysql.createConnection({
    host: 'localhost',
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
                addEmployee();
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
                    db.end();
                break;
        }
    })
}

const showAllEmployees = () => {
    let sql = 
    `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
    FROM employees e
    LEFT JOIN roles r 
    ON r.id = e.role_id 
    LEFT JOIN departments d 
    ON d.id = r.department_id
    LEFT JOIN employees m ON m.id = e.manager_id
    ORDER BY e.id;`
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(results)
        startApplication();
    })
}

const viewAllDepartments = () => {
    let sql = `SELECT * FROM departments`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(results)
        startApplication();
    })
}

const viewAllRoles = () => {
    let sql = `SELECT * FROM roles`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(results)
        startApplication();
    })
}

// const addEmployee = () => {
//     // connection.query(newEmployeeQuery, (err, results) => {
//     //     if (err) throw err;

//         inquirer.prompt([
//             {
//                 name: 'firstName',
//                 type: 'input',
//                 message: 
//             },
//             {
//                 name: 'lastName',
//                 type: 'input',
//                 message: 
//             },
//             {
//                 name: 'role',
//                 type: 'list',
//                 choices: roleList,
//                 message: 
//             },
//             {
//                 name: 'manager',
//                 type: 'list',
//                 choices: ['Cory Davis', 'Britton Gream'],
//                 message: 

//             }
//         ]).then((answer) => {
//             db.query(
//                 `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
//                 (SELECT id FROM roles WHERE title = ? ), 
//                 (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`, [answer.firstName, answer.lastName, answer.role]
//             )
//             startApplication();
//         })    
//     }


startApplication();