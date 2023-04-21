// Import necessary libraries
const cTable = require('console.table');
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

// Set the database password
const PASSWORD = 'Karate88!';

// Create a database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: PASSWORD,
    database: 'employees_db'
});

// Define SQL queries
const sqlEmployees = `
    SELECT employee.id AS eid, 
           first_name AS firstName, 
           last_name AS lastName, 
           role.title AS title, 
           department.name AS department, 
           role.salary AS salary, 
           manager_id AS manager 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    JOIN department ON department.id = role.department_id;
`;

const sqlRoles = 'SELECT * FROM role;';

const sqlDepartments = 'SELECT * FROM department;';

const insDept = 'INSERT INTO department (name) VALUES (?);';

const insRole = 'INSERT INTO role (title, salary, department_id) VALUES (?);';

const insEmp = 'INSERT INTO employee (last_name, first_name, role_id, manager_id) VALUES (?);';

// Function to retrieve data from the database and display it in a table
async function getData(queryString) {
    try {
        // Execute the query and get the results
        const [rows] = await db.query(queryString);
        // Clear the console and display the results in a table
        console.clear();
        console.table(rows);
        // Call the clearConsole() function (not shown here)
        clearConsole();
    } catch (err) {
        // Display any errors and return to the main menu
        console.log(err);
        return mainMenu();
    }
}

// Function to retrieve the departments from the database
async function selectDepartment() {
    const [rows] = await db.query('SELECT id AS value, name FROM department;');
    return rows;
}

// Function to retrieve the roles from the database
async function selectRole() {
    const [rows] = await db.query('SELECT id AS value, title as name FROM role;');
    return rows;
}

// Function to retrieve the employees from the database
async function selectEmployee() {
    const [rows] = await db.query('SELECT id AS value, last_name as name FROM employee;');
    return rows;
}


// Create the connection pool to the database
const pool = mysql.createPool({
host: 'localhost',
user: 'root',
password: 'karate88!',
database: 'employees_db'
});


// Generate the main menu
function mainMenu() {
inquirer
.prompt([
{
type: 'list',
message: 'What would you like to do?',
name: 'choice',
choices: [
{ name: 'View all departments', value: 'viewDep' },
{ name: 'View all roles', value: 'viewRoles' },
{ name: 'View all employees', value: 'viewEmp' },
{ name: 'Add a department', value: 'addDep' },
{ name: 'Add a role', value: 'addRole' },
{ name: 'Add an employee', value: 'addEmp' },
{ name: 'Update an employee role', value: 'upEmpRole' },
{ name: "Update an employee's manager", value: 'upEmpMgr' },
{ name: 'View employees by manager', value: 'viewEmpByMgr' },
{ name: 'End the program', value: 'stop' }
]
}
])
.then(async (answers) => {
try {
switch (answers.choice) {
case 'viewDep':
await displayTable(sqlDepartments);
break;
case 'viewEmp':
await displayTable(sqlEmployees);
break;
case 'viewRoles':
await displayTable(sqlRoles);
break;
case 'addDep':
await addDepartment();
break;
case 'addRole':
await addRole();
break;
case 'addEmp':
await addEmployee();
break;
case 'upEmpRole':
await updateEmployeeRole();
break;
case 'upEmpMgr':
await updateEmployeeMgr();
break;
case 'viewEmpByMgr':
await viewEmpByMgr();
break;
case 'stop':
console.clear;
console.log("Press control + c to finish.")
return;
}
} catch (error) {
console.error(error);
} finally {
await clearConsole();
}
})
};

// Helper function to display the table
async function displayTable(sqlQuery) {
const [rows, fields] = await pool.execute(sqlQuery);
console.clear();
console.table(rows);
}

// Helper function to prompt the user to continue and clear console
function clearConsole() {
return inquirer
.prompt([
{
type: 'input',
message: 'Press enter to proceed',
name: 'proceed'
}
])
.then(() => {
console.clear();
return;
}
)
}
// This function adds a role after being given info by the user
const addRole = async () => {
    // Prompt the user for role details
    return inquirer.prompt([
    {
    type: 'input',
    message: 'Please enter the name of the role.',
    name: 'role'
    },
    {
    type: 'input',
    message: 'Please enter the salary for this role.',
    name: 'salary'
    },
    {
    type: 'list',
    name: 'departmentRole',
    message: 'Which department does the role belong to?',
    choices: await selectDepartment()
    }
    ])
    .then(function(answers) {
    // Build an array of values to be inserted into the database
    let insSQLRole = [answers.role, answers.salary, answers.departmentRole];
    // Insert the new role into the database
    db.query(insRole, [insSQLRole]);
    console.clear();
    // Refresh the displayed data
    getData(sqlRoles);
    });
    };
    
    // This function adds an employee after being given info by the user
    const addEmployee = async () => {
    // Prompt the user for employee details
    return inquirer.prompt([
    {
    type: 'input',
    message: 'Please enter the first name of the employee.',
    name: 'fName'
    },
    {
    type: 'input',
    message: 'Please enter the last name of the employee.',
    name: 'lName'
    },
    {
    type: 'list',
    name: 'employeeRole',
    message: 'Which role does the employee fill?',
    choices: await selectRole()
    },
    {
    type: 'list',
    name: 'employeeMgr',
    message: 'Which manager does the employee report to?',
    choices: await selectEmployee()
    }
    ])
    .then(function(answers) {
    // Build an array of values to be inserted into the database
    let insSQLEmp = [answers.lName, answers.fName, answers.employeeRole, answers.employeeMgr];
    // Insert the new employee into the database
    db.query(insEmp, [insSQLEmp]);
    console.clear();
    // Refresh the displayed data
    getData(sqlEmployees);
    });
    };
    
   // Function to update an employee's role
const updateEmployee = async () => {
    // Prompt the user for employee and role details
    return inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Which employee's role would you like to update?",
        choices: await selectEmployee()
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's new role?",
        choices: await selectRole()
      }
    ])
      .then(function (answers) {
        // Build the SQL query to update the employee's role
        const employeeId = answers.employee;
        let upEmp = `UPDATE employee SET role_id = ${answers.role} WHERE id = ${employeeId}`;
        // Update the employee's role in the database
        db.query(upEmp);
        console.clear();
        // Refresh the displayed data
        getData(sqlEmployees);
      });
  };
  
    // This function updates an employee's manager
const updateManager = async () => {
    // Prompt the user to select an employee to update and their new manager
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's would you like to have report to a new manager?",
            choices: await selectEmployee()
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employees new manager?',
            choices: await selectEmployee()
        }
    ])
    .then(function(answers) {
        // Update the selected employee's manager in the database
        let upMgr = `UPDATE employee SET manager_id = ${answers.manager} WHERE id = ${answers.employee}`;
        db.query(upMgr, function (err, results) {
            if (err) {
                console.log(err);
                return mainMenu();
            } else {
                // Clear the console and display updated employee data
                console.clear();
                getData(sqlEmployees);
            };
        })
    })
};

// This function displays employees who report to a selected manager
const viewEmpMgr = async () => {
    // Prompt the user to select a manager to view their direct reports
    return inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Select a Manager to see their direct reports?',
            choices: await selectEmployee()
        }
    ])
    .then(function(answers) {
        // Query the database for all employees who report to the selected manager
        let getEmps = `SELECT employee.id AS eid, first_name AS firstName, last_name AS lastName, role.title AS title, department.name AS department, role.salary AS salary, manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id where employee.manager_id = ${answers.manager};`;
        db.query(getEmps, function (err, results) {
            if (err) {
                console.log(err);
                return mainMenu();
            } else {
                // Clear the console and display employee data in a table
                console.clear();
                console.table(results);
                clearConsole()
            };
        })
    })
};

// Call the mainMenu function to start the program
mainMenu();
