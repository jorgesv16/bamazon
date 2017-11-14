DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100),
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT NOT NULL
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) values (1, "levis", "clothing", 24.99, 300), 
	(2, "vans", "shoes", 30.00, 100),
	(3, "calculator", "electronics", 14, 50),
	(4, "iphone", "electronics", 249.99, 50),
	(5, "Think and Grow Rich", "books", 10, 20),
	(6, "printer", "electronics", 50, 10),
	(7, "coke", "groceries", 1.50, 100),
	(8, "rayban", "accessories", 99.00, 20),
	(9, "rolex", "accessories", 9000, 2),
	(10, "jansport", "accessories", 24.99, 30);