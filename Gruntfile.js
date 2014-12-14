/*global module:false*/
module.exports = function(grunt) {
  // Load grunt libraries from package.json
  require('load-grunt-tasks')(grunt);

  var pkg_config = grunt.file.readJSON('wp-content/themes/tcs-responsive/config/script-register.json');

  function addBaseFilePath(files, base) {
    var new_names = [];
    files.forEach(function(file) {
      new_names.push(base + file);
    });

    return new_names
  }

  var themeCSS = 'wp-content/themes/tcs-responsive/css/';
  var themeJS = 'wp-content/themes/tcs-responsive/js/';
  var themeAnnotate = 'wp-content/themes/tcs-responsive/dist/annotate/wp-content/themes/tcs-responsive/js/';

  grunt.registerTask('updateJsonConfig', function() {
    // Get env config from options
    var envConfig = {
      auth0ClientID: grunt.option('auth-client-id') || '6ZwZEUo2ZK4c50aLPpgupeg5v2Ffxp9P',
      auth0CallbackURL: grunt.option('auth-callback-url') || 'https://www.topcoder.com/reg2/callback.action',
      auth0LDAP: grunt.option('auth-ldap') || 'LDAP',
      auth0URL: grunt.option('auth-main-url') || 'topcoder.auth0.com',
      communityURL: grunt.option('community-url') || 'http://community.topcoder.com',
      mainURL: grunt.option('main-url') || 'http://local.topcoder.com',
      apiURL: grunt.option('api-url') || 'https://api.topcoder.com/v2',
      cdnURL: grunt.option('cdn-url') || '',
      useCND: grunt.option('use-cdn') || false,
      useMin: grunt.option('use-min') || false,
      useVer: grunt.option('use-ver') || false,
      version: grunt.option('cdn-version') || Date.now(),
      useGz: grunt.option('use-gz') || false
    };

    // Write config to file
    grunt.file.write('config.json', JSON.stringify(envConfig, null, 2));
  });

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // build config
    build: {
      themeRoot: 'wp-content/themes/tcs-responsive',
      themeJs: '<%= build.themeRoot %>/js',
      themeDist: '<%= build.themeRoot %>/dist',
      themeCss: '<%= build.themeRoot %>/css'
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
        files: {
          '<%= build.themeDist %>/tc.default.concat.css': addBaseFilePath(pkg_config.packages.default.css, themeCSS),
          '<%= build.themeDist %>/tc.challengelanding.concat.css': addBaseFilePath(pkg_config.packages.challengelanding.css, themeCSS),
          '<%= build.themeDist %>/tc.challenges.concat.css': addBaseFilePath(pkg_config.packages.challenges.css, themeCSS),
          '<%= build.themeDist %>/tc.challengeterms.concat.css': addBaseFilePath(pkg_config.packages.challengeterms.css, themeCSS),
          '<%= build.themeDist %>/tc.challengesubmit.concat.css': addBaseFilePath(pkg_config.packages.challengesubmit.css, themeCSS),
          '<%= build.themeDist %>/tc.ng-details.concat.css': addBaseFilePath(pkg_config.packages['ng-details'].css, themeCSS),
          '<%= build.themeDist %>/tc.ngChallenges.concat.css': addBaseFilePath(pkg_config.packages.ngChallenges.css, themeCSS),
          '<%= build.themeDist %>/tc.ng-member-profile.concat.css': addBaseFilePath(pkg_config.packages['ng-member-profile'].css, themeCSS),
          '<%= build.themeDist %>/tc.ng-users.concat.css': addBaseFilePath(pkg_config.packages['ng-users'].css, themeCSS)
        }
      }
    },
    cssmin: {
      minify: {
        cwd: '<%= build.themeCss %>',
        ext: '.min.css',
        files: {
          '<%= build.themeDist %>/css/default.min.css': ['<%= build.themeDist %>/tc.default.concat.css'],
          '<%= build.themeDist %>/css/challengelanding.min.css': ['<%= build.themeDist %>/tc.challengelanding.concat.css'],
          '<%= build.themeDist %>/css/challenges.min.css': ['<%= build.themeDist %>/tc.challenges.concat.css'],
          '<%= build.themeDist %>/css/challengeterms.min.css': ['<%= build.themeDist %>/tc.challengeterms.concat.css'],
          '<%= build.themeDist %>/css/challengesubmit.min.css': ['<%= build.themeDist %>/tc.challengesubmit.concat.css'],
          '<%= build.themeDist %>/css/ng-details.min.css': ['<%= build.themeDist %>/tc.ng-details.concat.css'],
          '<%= build.themeDist %>/css/ngChallenges.min.css': ['<%= build.themeDist %>/tc.ngChallenges.concat.css'],
          '<%= build.themeDist %>/css/ng-member-profile.min.css': ['<%= build.themeDist %>/tc.ng-member-profile.concat.css'],
          '<%= build.themeDist %>/css/ng-users.min.css': ['<%= build.themeDist %>/tc.ng-users.concat.css']

        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false
      },
      js: {
        files: {
          '<%= build.themeDist %>/js/default.min.js': addBaseFilePath(pkg_config.packages.default.js, themeJS),
          '<%= build.themeDist %>/js/challengelanding.min.js': addBaseFilePath(pkg_config.packages.challengelanding.js, themeJS),
          '<%= build.themeDist %>/js/challenges.min.js': addBaseFilePath(pkg_config.packages.challenges.js, themeJS),
          '<%= build.themeDist %>/js/challengeterms.min.js': addBaseFilePath(pkg_config.packages.challengeterms.js, themeJS),
          '<%= build.themeDist %>/js/challengesubmit.min.js': addBaseFilePath(pkg_config.packages.challengesubmit.js, themeJS),
          '<%= build.themeDist %>/js/ng-details.min.js': addBaseFilePath(pkg_config.packages['ng-details'].js, themeJS),
          '<%= build.themeDist %>/js/ngChallenges.min.js': addBaseFilePath(pkg_config.packages.ngChallenges.js, themeJS),
          '<%= build.themeDist %>/js/ng-member-profile.min.js': addBaseFilePath(pkg_config.packages['ng-member-profile'].js, themeJS),
          '<%= build.themeDist %>/js/ng-users.min.js': addBaseFilePath(pkg_config.packages['ng-users'].js, themeJS)

        }
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      js: {
        files: [
          {
            expand: true,
            add: true,
            remove: true,
            src: [
              '<%= build.themeJs %>/**/*.js',
              '!<%= build.themeJs %>/app/challenges/jsx/**'
            ],
            dest: '<%= build.themeDist %>/annotate'
          }
        ]
      }
    },
    clean: ['<%= build.themeDist %>/'],
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {
            expand: true,
            src: [
              '<%= build.themeDist %>/js/*.min.js',
              '!<%= build.themeDist %>/js/*.gz.js'
            ],
            ext: '.min.gz.js'
          },
          {
            expand: true,
            src: [
              '<%= build.themeDist %>/css/*.min.css',
              '!<%= build.themeDist %>/css/*.gz.css'
            ],
            ext: '.min.gz.css'
          }
        ]
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'cssmin', 'uglify', 'compress', 'updateJsonConfig']);

};
