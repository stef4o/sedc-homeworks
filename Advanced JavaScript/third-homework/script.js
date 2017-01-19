function Employee(name, department) {
    this.name = name;
    this.department = department;
}

Employee.prototype.whoAreYou = function() {
    return `My name is ${this.name} and I am working in department ${this.department}`;
}

function Manager(name) {
    Employee.call(this, name, "general");
}

Manager.prototype = new Employee();
Manager.prototype.employees = []; // created prototype property of employees for global access of all managers
Manager.prototype.fireUp = function(name) {
    for (let i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].name == name) {
            this.employees.splice(i, 1);
            break;
        }
    }
};

function SalesPerson(name, quota) {
    Employee.call(this, name, "sales");
    this.quota = quota;
}
SalesPerson.prototype = new Employee();

// some testing
let john = new Employee("John", "IT");
let jane = new Employee("Jane", "Network");
let mike = new Employee("Mike", "DevOps");
let sara = new SalesPerson("Sara", 500);

let bob = new Manager("Bob");
bob.employees.push(john);
bob.employees.push(jane);
bob.employees.push(mike);
bob.employees.push(sara);

let jim = new Manager("Jim");