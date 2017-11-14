var inquirer = require("inquirer");
var mysql = require("mysql");
require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  askManager();
});

var low = false;

function askManager() {
	inquirer
	.prompt(
	{
		message: "Select an action",
		name: "options",
		type: "list",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	})
	.then(function(answer) {

		switch(answer.options) {
			case "View Products for Sale":
				displayProducts();
				break;

			case "View Low Inventory":
				low = true;
				displayProducts();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				newProduct();
				break;

			default:
				break;
		}
	});
}

function displayProducts() {
	var query = "SELECT * FROM products";

	if (low) {
		query += " WHERE stock_quantity<5";
	}

	connection.query(query, function(err, res) {
		if (err) throw err;
		console.table(res);
		connection.end();
	});
}

function addInventory() {
	inquirer
	.prompt([
	{
		name: "id",
		type: "input",
		message: "Enter the ID of the product you would like to add inventory to",
		validate: function(value) {
			if (parseInt(value)>0 && parseInt(value)<11) {
				return true;
			}
			return "Enter a valid ID";
		}
	}, {
		name: "quantity",
		type: "input",
		message: "How many would you like to add?"
	}])
	.then(function(answer) {
		var query = {item_id: parseInt(answer.id)};
		connection.query(
			"UPDATE products SET stock_quantity=stock_quantity+" + parseInt(answer.quantity) + " WHERE ?", query, function(err, res) {
				console.log("\n----------------------------------------\n");
				console.log("Inventory added");
				console.log("\n----------------------------------------\n");

				displayProducts();
			}
		);
	});
}

function newProduct() {
	inquirer
	.prompt([
	{
		name: "name",
		type: "input",
		message: "Enter the name of the product",
	}, {
		name: "id",
		type: "input",
		message: "Enter the product ID",
	}, {
		name: "department",
		type: "input",
		message: "Enter the name of the department",
	}, {
		name: "price",
		type: "input",
		message: "Enter the price of the product",
	}, {
		name: "quantity",
		type: "input",
		message: "Enter the quantity"
	}])
	.then(function(answer) {
		var query = {
			item_id: parseInt(answer.id),
			product_name: answer.name, 
			department_name: answer.department, 
			price: parseInt(answer.price),
			stock_quantity: parseInt(answer.quantity)
		};
		connection.query("INSERT INTO products SET ?", query, function (error, results, fields) {
			console.log("\n----------------------------------------\n");
			console.log("Product added");
			console.log("\n----------------------------------------\n");

			displayProducts();
		});
	});
}





