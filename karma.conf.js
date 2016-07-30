module.exports = function (config) {
	config.set({
		frameworks: ['browserify', 'jasmine'],
		files: [
			'src/**/*.js',
			'test/**/*_spec.js',
		],
		preprocessors: {
			'test/**/*.js': ['jshint', 'browserify'],
			'src/**/*.js': ['jshint', 'browserify']
		},
		browsers: ['PhantomJS'],
		browserify: {
			debug: true
			// Uncomment this if you get "Some of your tests did a full page reload!" message
			//,bundleDelay: 2000 
		}
	})
}