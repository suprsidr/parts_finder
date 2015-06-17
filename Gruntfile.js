module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      dist: {
        files: {
          'js/main.min.js': 'js/main.js',
          'js/parts-finder.min.js': 'js/parts-finder.js'
        }
      }
    },

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/parts-finder.min.css': 'css/scss/parts-finder.scss'
        }        
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },
      
      uglify: {
        files: ['js/*.js', '!js/*.min.js'],
        tasks: ['uglify'],
        options: {
          livereload: true,
        }
      },
      
      sass: {
        files: 'css/scss/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      
      html: {
        files: '*.html',
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('build', ['sass', 'uglify']);
  grunt.registerTask('default', ['build','watch']);
}