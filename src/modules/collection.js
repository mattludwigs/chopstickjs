"use strict";

let collection = {

		_byKeyQuery(store, key) {
			let req = store.get(key);
			return new Promise(function (resolve, reject) {
				req.addEventListener("success", function (e) {
					resolve(e.target.result);
				});
			});

		},

		_findAll(store) {
			let req = store.openCursor(),
					items = [];
			
			return new Promise(function (resolve, reject) {
				req.addEventListener("success", function (e) {
					let cursor = e.target.result;
					if (cursor) {
						let obj = cursor.value;
						items.push(obj);
						cursor.continue();
					} else {
						resolve(items);
					}
				});	
			});
		},

		_getQueryTypes (query) {

		},

		update (query, update) {

		},

		remove(query) {

		},

		size () {

		},

		insert (document, permissions) {
			permissions = permissions || "readwrite";
			document.timeStamp = new Date().getTime();

			let add = this.getStore(permissions)
				.add(document);

			return new Promise(function (resolve, reject){
				add.addEventListener("success", function (e) {
					resolve(e);
				});

				add.addEventListener("error", function (e) {
					console.log(e.target.error.name);
				});
			})
		},

		getStore (permissions) {
			let storage = this.name;
			return chopstick.db._dbInstance
				.transaction([storage], permissions)
				.objectStore(storage);
		},

		find(query) {
			let store = this.getStore("readonly")

			if (!query) {
				return new Promise(function (resolve, reject) {
					this._findAll(store)
						.then(function (res) {
							resolve(res);
						});
				}.bind(this));
			}

			if (query) {
				if (query.$byKey) {
					return new Promise(function (resolve, reject) {
						this._byKeyQuery(store, query.$byKey)
							.then(function (queryResult) {
								resolve(queryResult);
							});
						}.bind(this));
				}

				/// normal find
				let queryKeys = Object.keys(query),
						i = queryKeys.length,
						res = [];

				return new Promise(function (resolve, reject) {

					while(i--) {
						let index = store.index(queryKeys[i]);

						index.get(query[queryKeys[i]]).onsuccess = function (e) {
							resolve(e.target.result);
						}
					}

				});


			}// end query
		}// end find
	}


module.exports = collection	
