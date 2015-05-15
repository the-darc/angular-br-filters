var gulp = require('gulp'),
	path = require('path'),
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

gulp.task('jshint', function(done) {
	gulp.src(config.src.files)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
	done();
});

gulp.task('build', function() {
	var pkg = require('./package.json');

	var header = ['/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		'(function (angular) {',
		'	var global = {};',
		'',
		''].join('\n');

	var footer = [
		'',
		'})(angular);',
		''].join('\n');

	gulp.src([
		'bower_components/br-masks/releases/br-masks-standalone.js',
		'src/filters.js'
	])
	.pipe(plugins.concat('angular-br-filters.js'))
	.pipe(plugins.header(header, {pkg: pkg}))
	.pipe(plugins.footer(footer))
	.pipe(gulp.dest('./release/'))
	.pipe(plugins.uglify())
	.pipe(plugins.concat('angular-br-filters.min.js'))
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

