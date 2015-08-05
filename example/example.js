/**
	This is the example usage for a simple todo app using chopstick.js

	This example should work in Chrome
**/
(function () {
	"use strict";

	// Set up a collection object
	// needs a name
	// and a schema
	let todoCollection = {
		name: "todos",
		schema: {
			todo: false,
			complete: false
		}
	}

	// Set a config object
	// version: Number
	// name: string
	// collection: Array
	let dbConfig = {
		version: 5,
		name: "todo",
		collections: [
			todoCollection
		]
	}

	let todoDb = chopstick.db.config(dbConfig).connect();

	// dom stuff
	let button = document.querySelector("input[type=submit]"),
			input = document.querySelector("input[type=text]"),
			todoUl = document.querySelector(".todos");

	function updateUi(todo) {
		let li = document.createElement("li");
		let html = "<p>" + todo.todo.todo + "</p>";
		if (todo.complete === "NO" || !todo.complete) {
			html += "<button>Done</button>";
		}
		
		li.innerHTML = html;
		todoUl.appendChild(li);
	}

	button.addEventListener("click", function (event) {
		event.preventDefault();

		let todo = {
			todo: input.value,
			complete: "NO"
		}

		updateUi(todo);
		input.value = "";
		
		todoDb
			.then(function (db) {
					db.useCollection("todos").insert({
						todo: todo,
						complete: "NO"
					})
						.then(function (e) {})
			},

			function (e) {
				console.log(e);
			});
	});

	window.onload = function () {
		todoDb
			.then(function (db) {

				db.useCollection("todos").find()
					.then(function (results) {
						console.log(results);
						results.forEach(function (v, i) {

							updateUi(v);
						});
					});
			});
	}

})();