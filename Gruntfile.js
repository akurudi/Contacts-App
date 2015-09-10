module.exports = function (grunt) {
	// configure the tasks
	grunt.initConfig({
		concat: {
			options: {
				separator: ';\n',
				stripBanners: true
			},
			angularmods: {
				src: ['source/bower_components/angular/angular.min.js', 'source/bower_components/angular-animate/angular-animate.min.js', 'source/bower_components/angular-aria/angular-aria.min.js', 'source/bower_components/angular-material/angular-material.min.js', 'source/bower_components/angular-messages/angular-messages.min.js', 'source/bower_components/angular-route/angular-route.min.js'],
				dest: 'source/temp/angularmods.min.js',
			},
			appjs: {
				src: ['source/components/appFilters.js', 'source/components/app.js', 'source/components/appControllers.js', 'source/components/appDirectives.js'],
				dest: 'source/temp/application.js',
			},
			build: {
				src: ['source/temp/angularmods.min.js', 'source/temp/app.min.js'],
				dest: 'source/js/app.min.js',
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			appjs: {
				files: {
					'source/temp/app.min.js': ['source/temp/application.js']
				}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'source/css/styles.min.css': ['source/css/styles.css','source/bower_components/angular-material/angular-material.css']
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'source/components/app.js']
		},
		processhtml: {
			dist: {
				files: {
					'dist/index.html': ['dist/index.html']
				}
			}
		},
		copy: {
			main: {
				files: [
					// includes files within path and its sub-directories
					{ expand: true, cwd: 'source/', src: ['**', '!bower_components/**', '!components/**'], dest: 'dist/' }
				],
			},
		},
		clean: {
			build: {
				src: ["dist/"]
			},
			source: {
				src: ["source/temp/", "source/js"]
			}
		},
		wiredep: {
			task: {
				src: 'source/index.html'
			}
		},
		connect: {
			dev: {
				port: 8000,
				base: 'source'
			},
			prod: {
				port: 5000,
				base: 'dist'
			}
		}
	});
	// load the tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-connect');
	// define the tasks
	grunt.registerTask('build', ['concat:angularmods','concat:appjs','uglify:appjs','concat:build','cssmin','clean','copy','processhtml']);
};