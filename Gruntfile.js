/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // build config
    build: {
      themeRoot: 'wp-content/themes/tcs-responsive',
      themeJs: '<%= build.themeRoot %>/js',
      themeDist: '<%= build.themeRoot %>/dist',
      themeCss: '<%= build.themeRoot %>/css',
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      css: {
        src: [
          '<%= build.themeCss %>/base.css',
          '<%= build.themeCss %>/base-responsive.css',
          '<%= build.themeCss %>/blog-base.css',
          '<%= build.themeCss %>/blog.css'
        ],
        dest: '<%= build.themeDist %>/tc.concat.css'
      }
    },
    cssmin: {
      minify: {
        cwd: '<%= build.themeCss %>',
        ext: '.min.css',
        files: {
          '<%= build.themeDist %>/topcoder.min.css': ['<%= build.themeDist %>/tc.concat.css']
        } 
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      js: {
        files: {
          '<%= build.themeDist %>/topcoder.min.js': [
	    '<%= build.themeJs %>/blog.js',
	    '<%= build.themeJs %>/challenge-detail-software.js'
          ]
        }
      }
    },
    clean: ['<%= build.themeDist %>/'], 
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand:true, src: ['<%= build.themeDist %>/*.min.*', '!<%= build.themeDist %>/*.gz']}
        ] 
      } 
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'cssmin', 'uglify', 'compress']);

};
