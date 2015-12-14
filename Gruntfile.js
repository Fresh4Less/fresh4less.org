//Gruntfile

var clientSrcDir = 'client';
var serverSrcDir = 'server';
var buildDir = 'build';
var distDir = 'dist';
var serverTestFiles = 'test/server';

module.exports = function(grunt) {

	//Config
	grunt.initConfig({
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
				src: [buildDir + 'javascript/**/*.js'],
				dest: buildDir + '/javascript/fresh.js',
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
				files: [clientSrcDir + '/**/*.js', serverSrcDir + '/**/*.js'],
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
			files: {
				cwd: clientSrcDir,  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: buildDir,    // destination folder
				expand: true           // required when using cwd
			}
		},
		jekyll: {
			options: {
				//src: buildDir,
				//dest: dist
				config: buildDir + '_config.yml'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-jekyll');
//	grunt.loadNpmTasks('grunt-contrib-uglify');
//	grunt.loadNpmTasks('grunt-contrib-sass');
//	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
//	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass', 'cssmin']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['env:dev', 'copy', 'concat', 'jekyll']);
	grunt.registerTask('dev', ['build', 'express:dev', 'watch:js']);
	grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest']);
	grunt.registerTask('watch', ['default', 'watch:js']);
};
