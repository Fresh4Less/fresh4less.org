//Gruntfile

var clientSrcDir = 'client';
var serverSrcDir = 'server';
var buildDir = 'build';
var distDir = 'dist';
var serverTestFiles = 'test/server';

module.exports = function(grunt) {

	//Config
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		env : {
			dev: {
				NODE_ENV: 'development',
			},
			test: {
				NODE_ENV: 'test'
			}
		},
		jshint : {
			options: {
			},
			test: {
				src: [serverSrcDir + '/**/*.js', clientSrcDir + '/**/*.js']
			}
		},
		concat : {
			options: {
				separator: ";\n",
				banner: "/*Fresh4Less.org - Fresh4Less [ Elliot Hatch, Samuel Davidson ]*/\n\n"
			},
			dist: {
				src: [buildDir + '/_javascript/**/*.js'],
				dest: buildDir + '/javascript/fresh.js',
			}
		},
		uglify: {
			build: {
				files: {
					//see end of config
				},
				sourceMap: true
			}
		},
		cssmin: {
			build: {
				files: {
					//see end of config
				}
			}
		},
		express: {
			dev: {
				options: {
					script: serverSrcDir + '/index.js'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: [clientSrcDir + '/**/*', serverSrcDir + '/**/*'],
				tasks: ['build', 'express:dev']
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: 'test/server/coverage/blanket'
				},
				src: serverTestFiles
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'logs/server-coverage.html'
				},
				src: serverTestFiles
			}
		},
		copy: {
			build: {
				cwd: clientSrcDir,  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: buildDir,    // destination folder
				expand: true           // required when using cwd
			}
		},
		clean: {
			build: [buildDir, distDir]
		},
		jekyll: {
			options: {
				src: buildDir,
			},
			dist: {
				dest: distDir
			}
		}
	};

	config.uglify.build.files[(distDir + '/javascript/fresh.min.js')] = [distDir + '/javascript/fresh.js'];
	config.cssmin.build.files[(distDir + '/css/main.min.css')] = [distDir + '/css/main.css'];

	grunt.initConfig(config);
	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.registerTask('default', ['jshint', 'build']);
	grunt.registerTask('build', ['env:dev', 'clean:build', 'copy:build', 'concat', 'jekyll:dist', 'uglify', 'cssmin']);
	grunt.registerTask('dev', ['build', 'express:dev']);
	grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest']);
	grunt.registerTask('watch', ['build', 'watch:js']);
};
