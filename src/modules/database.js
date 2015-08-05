"use strict";

let collection = require("./collection");

module.exports = {

	collection: collection,

	supported () {
		return "indexedDB" in window;
	},

	config (opts) {
		this.opts = opts;
		this.name = opts.name;
		this.version = opts.version;
		return this;
	},

	useCollection (name) {
		return this.collections[name];
	},

	_collectionFactory () {
		let obj = {},
				i = this.opts.collections.length;

		this.collections = this.collections || {};

		while (i--) {
			this.collections[this.opts.collections[i].name] = Object.create(this.collection, {
				name: {
					value: this.opts.collections[i].name
				}
			});
		}		

	},

	_upgradeListener (e) {
		let thisDB = e.target.result,
				i = this.opts.collections.length;

		while(i--) {
			let schema = this.opts.collections[i].schema,
					schemaKeys = Object.keys(schema),
					j = schemaKeys.length;

			if (thisDB.objectStoreNames.contains(this.opts.collections[i].name)) {
				thisDB.deleteObjectStore(this.opts.collections[i].name)
			}

			if (!thisDB.objectStoreNames.contains(this.opts.collections[i].name)) {
				let _objStore = thisDB.createObjectStore(this.opts.collections[i].name, { autoIncrement: true });
				while(j--) {
					_objStore.createIndex(schemaKeys[j], schemaKeys[j], {unique:schema[schemaKeys[j]]});
				}
			}
		}
	},

		connect () {

		if (!this.openRequest) {
			this.openRequest = indexedDB.open(this.opts.name, this.opts.version);
		}

		this.openRequest.addEventListener("upgradeneeded", this._upgradeListener.bind(this));

		return new Promise(function (resolve, reject) {
			
			this.openRequest.addEventListener("success", function (e) {
				this._collectionFactory();
				this._dbInstance = e.target.result;

				resolve(this);

			}.bind(this));

			this.openRequest.addEventListener("error", function (e) {
				reject(e);
			});

		}.bind(this));
		
	}

}
