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
  displayProducts();
});

function displayProducts() {

	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.table(res);
		askUser(res);
	});
}

// Ask the user to buy product
function askUser(res) {
	inquirer
	.prompt([
	{
		name: "id",
		type: "input",
		message: "Enter the ID of the product you would like to buy",
		validate: function(value) {
			if (parseInt(value)>0 && parseInt(value)<11) {
				return true;
			}
			return "Enter a valid ID";
		}
	}, {
		name: "quantity",
		type: "input",
		message: "How many would you like to buy?"
	}])
	.then(function(answer) {
		//console.log(res[answer.id-1].stock_quantity)
		if (parseInt(answer.quantity) > res[parseInt(answer.id-1)].stock_quantity) {
			console.log("Sorry, Insufficient quantity")
			askUser(res);
		} else {
			buyProduct(
				parseInt(answer.id), 
				res[parseInt(answer.id-1)].stock_quantity-parseInt(answer.quantity), 
				parseInt(answer.quantity),
				res[parseInt(answer.id-1)].price
			);
		}
	});
}

// Complete purchase and update stock quantity
function buyProduct(id, stockQuantity, purchaseQuantity, price) {
	var query = [{stock_quantity: stockQuantity}, {item_id: id}];

	connection.query(
		"UPDATE products SET ? WHERE ?", query, function(err, res) {
			// console.log("quantity: " + stockQuantity);
			// console.log("price: " + price);
			var cost = price*purchaseQuantity;

			console.log("Purchase successfully completed!");
			console.log("The total cost was: $" + cost);

			connection.end();
		}
	);
}








