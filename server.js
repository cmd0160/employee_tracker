const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');
require('dotenv').config();

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
startApplication();