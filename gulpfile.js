var gulp = require("gulp"),
		browserify = require("browserify"),
		uglify = require("gulp-uglify"),
		buffer = require("vinyl-buffer"),
		source = require("vinyl-source-stream"),
		rename = require("gulp-rename"),
		babelify = require("babelify");

gulp.task("js", function () {
		var b = browserify({
			entries: "./src/index.js",
			debug: true,
			transform: [babelify]
		});

		return b.bundle()
			.pipe(source("./chopstick.js"))
			.pipe(buffer())
			.pipe(gulp.dest("./dist/"));
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
