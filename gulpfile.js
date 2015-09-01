var gulp = require('gulp'),
	path = require('path'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	karma = require('karma').server,
	jshintReporter = require('jshint-stylish'),
	pkg = require(path.join(__dirname, 'package.json')),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	fs = require('fs');

var config = {
	src: {
		files: 'src/**/*.js'
	}
};

var header = [
		'/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
	].join('\n');

gulp.task('jshint', function(done) {
	gulp.src(config.src.files)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
	done();
});

gulp.task('build', function() {
	return browserify({
			entries: 'filters.js',
			detectGlobals: false,
			basedir: './src/',
			debug: false,
			bundleExternal: true,
		})
		.bundle()
		.pipe(source('angular-br-filters.js'))
		.pipe(buffer())
		.pipe(plugins.header(header, {pkg: pkg}))
		.pipe(gulp.dest('./release/'))
		.pipe(plugins.uglify())
		.pipe(plugins.rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('./release/'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(config.src.files, ['jshint', 'build']);
});

gulp.task('test', function(done) {
	var karmaConfig = {
		singleRun: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

gulp.task('changelog', function(done) {
	var changelog = require('conventional-changelog');

	var options = {
		repository: pkg.homepage,
		version: pkg.version,
		file: path.join(__dirname, 'CHANGELOG.md')
	};

	changelog(options, function(err, log) {
		if (err) {
			throw err;
		}

		fs.writeFile(options.file, log, done);
	});
});

