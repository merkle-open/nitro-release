const release = require('./tasks/release.js');

module.exports = function (gulp, config) {
	gulp.task('release', release(gulp, config));
};
