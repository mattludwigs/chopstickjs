"use strict";

let expect = chai.expect;
let should = chai.should();


describe("import chopstick", function () {

	it("should import the chopstick should be in window", function () {
		expect(window.chopstick).not.to.equal(undefined);
	});

})