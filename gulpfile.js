var gulp = require("gulp"),
		browserify = require("browserify"),
		fs = require("fs"),
		uglify = require("gulp-uglify"),
		rename = require("gulp-rename"),
		babelify = require("babelify");


gulp.task("js", function () {
	browserify("./src/index.js", {debug: true})
		.transform(babelify)
		.bundle()
		.on("error", function (err) { console.log("Error: " + err.message) })
		.pipe(fs.createWriteStream("./dist/chopstick.js"));
});

gulp.task("mkdir", function () {
	try {
		fs.mkdirSync("./dist")
	} catch (e) {
		if (e.code !== "EEXIST") throw e;
	}
});

gulp.task("js:min",["js"], function () {
	gulp.src("./dist/chopstick.js")
		.pipe(rename("chopstick.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("./dist"));
});

gulp.task("build", ["mkdir", "js"],function () {
	gulp.watch("./src/**/*.js", ["js"]);
});
