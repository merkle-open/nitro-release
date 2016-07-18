const argv = require('yargs').argv;
const fs = require('fs');
const gulpBump = require('gulp-bump');
const gulpGit = require('gulp-git');

module.exports = function (gulp, config) {
	'use strict';

	/**
	 * Replaces Version placeholder with given version.
	 * @param {string} str The string with the Version placeholder.
	 * @param {string} version The current version, that should replace the Version placeholder.
	 * @returns {string} The string, where the Version placeholder has been replaced.
	 */
	function replaceVersion(str, version) {
		return str.replace('%VERSION%', version);
	}

	return function () {
		let pkg = {};
		const bumpType = argv.bump || 'patch';
		const releaseConf = config.release;
		let releaseMessage = '';

		/**
		 * @returns {Promise} The promise for bumping.
		 */
		function getBumpPromise() {
			return new Promise((resolve) => {
				gulp.src(releaseConf.bumpFiles)
					.pipe(gulpBump({ type: bumpType }))
					.pipe(gulp.dest('./'))
					.on('end', () => {
						pkg = JSON.parse(fs.readFileSync(`${config.nitro.base_path}package.json`, {
							encoding: 'utf-8',
							flag: 'r'
						}));
						resolve();
					});
			});
		}

		/**
		 * @returns {Promise} The promise for commiting.
		 */
		function getCommitPromise() {
			return new Promise((resolve) => {
				if (!releaseConf.commit) {
					resolve();
					return;
				}

				releaseMessage = replaceVersion(releaseConf.commitMessage, pkg.version);

				gulp.src(releaseConf.bumpFiles)
					.pipe(gulpGit.add())
					.pipe(gulpGit.commit(releaseMessage))
					.on('end', () => {
						resolve();
					});
			});
		}

		/**
		 * @returns {Promise} The promise for tagging.
		 */
		function getTagPromise() {
			return new Promise((resolve) => {
				if (!releaseConf.tag) {
					resolve();
					return;
				}
				const tagName = replaceVersion(releaseConf.tagName, pkg.version);
				gulpGit.tag(tagName, releaseMessage, (err) => {
					if (err) {
						throw err;
					}
					resolve();
				});
			});
		}

		/**
		 * @returns {Promise} The promise for pushing.
		 */
		function getPushPromise() {
			return new Promise((resolve) => {
				if (!releaseConf.push) {
					resolve();
					return;
				}
				gulpGit.push(releaseConf.pushTo, releaseConf.pushBranch, (err) => {
					if (err) {
						throw err;
					}
					gulpGit.push(releaseConf.pushTo, releaseConf.pushBranch, { args: '--tags' }, (errTags) => {
						if (errTags) {
							throw errTags;
						}
						resolve();
					});
				});
			});
		}

		return getBumpPromise()
			.then(getCommitPromise)
			.then(getTagPromise)
			.then(getPushPromise);
	};
};
