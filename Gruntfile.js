/*global module:false*/
module.exports = function(grunt) {
  // Load grunt libraries from package.json
  require('load-grunt-tasks')(grunt);

  var pkg_config = grunt.file.readJSON('wp/wp-content/themes/tcs-responsive/config/script-register.json');

  function addBaseFilePath(files, base) {
    var new_names = [];
    files.forEach(function(file) {
      new_names.push(base + file);
    });

    return new_names
  }

  var src = 'src';
  var dist = 'dist';
  var tmp = 'tmp';
  var srcCSS = src + '/css/';
  var srcJS = src + '/js/';

  var tcconfig = {
    auth0ClientID: grunt.option('auth-client-id') || '6ZwZEUo2ZK4c50aLPpgupeg5v2Ffxp9P',
    auth0CallbackURL: grunt.option('auth-callback-url') || 'https://www.topcoder.com/reg2/callback.action',
    auth0LDAP: grunt.option('auth-ldap') || 'LDAP',
    auth0URL: grunt.option('auth-main-url') || 'topcoder.auth0.com',
    communityURL: grunt.option('community-url') || 'http://community.topcoder.com',
    mainURL: grunt.option('main-url') || 'http://local.topcoder.com',
    apiURL: grunt.option('api-url') || 'https://api.topcoder.com/v2',
    cdnURL: grunt.option('cdn-url') || '',
    useCND: grunt.option('use-cdn') || true,
    useMin: grunt.option('use-min') || true,
    useVer: grunt.option('use-ver') || false,
    version: grunt.option('cdn-version') || Date.now(),
    useGz: grunt.option('use-gz') || true,
    lcURL: grunt.option('lc-url') || 'http://dev-lc1-ext-challenge-service.herokuapp.com',
    lcDiscussionURL: grunt.option('lc-discussion-url') || 'http://dev-lc1-discussion-service.herokuapp.com',
    lcUserURL: grunt.option('lc-user-url') || 'http://dev-lc1-user-service.herokuapp.com',
    lcSiteUrl: grunt.option('lc-site-url') || 'http://dev-lc1-challenge-app.herokuapp.com',
    myFiltersURL: grunt.option('my-filters-url') || 'https://staging-user-settings-service.herokuapp.com',
    cbURL: grunt.option('cb-url') || 'https://coderbits.com'
  };

  grunt.registerTask('writeConfig', function() {
    // Write config to file
    grunt.file.write('config.json', JSON.stringify(tcconfig, null, 2));
  });

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // build config
    build: {
      src: src,
      dist: dist,
      tmp: tmp,
      srcJs: srcJS,
      srcCss: srcCSS,
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
          '<%= build.tmp %>/tc.default.concat.css': addBaseFilePath(pkg_config.packages.default.css, srcCSS),
          '<%= build.tmp %>/tc.challengelanding.concat.css': addBaseFilePath(pkg_config.packages.challengelanding.css, srcCSS),
          '<%= build.tmp %>/tc.challenges.concat.css': addBaseFilePath(pkg_config.packages.challenges.css, srcCSS),
          '<%= build.tmp %>/tc.challengeterms.concat.css': addBaseFilePath(pkg_config.packages.challengeterms.css, srcCSS),
          '<%= build.tmp %>/tc.challengesubmit.concat.css': addBaseFilePath(pkg_config.packages.challengesubmit.css, srcCSS),
          '<%= build.tmp %>/tc.ng-details.concat.css': addBaseFilePath(pkg_config.packages['ng-details'].css, srcCSS),
          '<%= build.tmp %>/tc.ngChallenges.concat.css': addBaseFilePath(pkg_config.packages.ngChallenges.css, srcCSS),
          '<%= build.tmp %>/tc.ng-member-profile.concat.css': addBaseFilePath(pkg_config.packages['ng-member-profile'].css, srcCSS),
          '<%= build.tmp %>/tc.ng-users.concat.css': addBaseFilePath(pkg_config.packages['ng-users'].css, srcCSS),
          '<%= build.tmp %>/tc.profile-builder.concat.css': addBaseFilePath(pkg_config.packages['profile-builder'].css, srcCSS)
        }
      }
    },
    cssmin: {
      minify: {
        cwd: '<%= build.srcCss %>',
        ext: '.min.css',
        files: {
          '<%= build.dist %>/css/default.min.css': ['<%= build.tmp %>/tc.default.concat.css'],
          '<%= build.dist %>/css/challengelanding.min.css': ['<%= build.tmp %>/tc.challengelanding.concat.css'],
          '<%= build.dist %>/css/challenges.min.css': ['<%= build.tmp %>/tc.challenges.concat.css'],
          '<%= build.dist %>/css/challengeterms.min.css': ['<%= build.tmp %>/tc.challengeterms.concat.css'],
          '<%= build.dist %>/css/challengesubmit.min.css': ['<%= build.tmp %>/tc.challengesubmit.concat.css'],
          '<%= build.dist %>/css/ng-details.min.css': ['<%= build.tmp %>/tc.ng-details.concat.css'],
          '<%= build.dist %>/css/ngChallenges.min.css': ['<%= build.tmp %>/tc.ngChallenges.concat.css'],
          '<%= build.dist %>/css/ng-member-profile.min.css': ['<%= build.tmp %>/tc.ng-member-profile.concat.css'],
          '<%= build.dist %>/css/ng-users.min.css': ['<%= build.tmp %>/tc.ng-users.concat.css'],
          '<%= build.dist %>/css/profile-builder.min.css': ['<%= build.tmp %>/tc.profile-builder.concat.css']

        }
      }
    },
    copy: { main: {
      files: [{
        cwd: '<%= build.src %>/fonts',
        src: '**/*',
        dest: '<%= build.dist %>/fonts',
        expand: true
      },
      {
        cwd: '<%= build.src %>/js/app',
        src: '**/*',
        dest: '<%= build.dist %>/html',
        expand: true
      }]
    }},
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false
      },
      js: {
        files: {
          '<%= build.dist %>/js/default.min.js': addBaseFilePath(pkg_config.packages.default.js, srcJS),
          '<%= build.dist %>/js/challengelanding.min.js': addBaseFilePath(pkg_config.packages.challengelanding.js, srcJS),
          '<%= build.dist %>/js/challenges.min.js': addBaseFilePath(pkg_config.packages.challenges.js, srcJS),
          '<%= build.dist %>/js/challengeterms.min.js': addBaseFilePath(pkg_config.packages.challengeterms.js, srcJS),
          '<%= build.dist %>/js/challengesubmit.min.js': addBaseFilePath(pkg_config.packages.challengesubmit.js, srcJS),
          '<%= build.dist %>/js/ng-details.min.js': addBaseFilePath(pkg_config.packages['ng-details'].js, srcJS),
          '<%= build.dist %>/js/ngChallenges.min.js': addBaseFilePath(pkg_config.packages.ngChallenges.js, srcJS),
          '<%= build.dist %>/js/ng-member-profile.min.js': addBaseFilePath(pkg_config.packages['ng-member-profile'].js, srcJS),
          '<%= build.dist %>/js/ng-users.min.js': addBaseFilePath(pkg_config.packages['ng-users'].js, srcJS),
          '<%= build.dist %>/js/profile-builder.min.js': addBaseFilePath(pkg_config.packages['profile-builder'].js, srcJS)
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
              '<%= build.srcJs %>/**/*.js',
              '!<%= build.srcJs %>/app/challenges/jsx/**'
            ],
            dest: '<%= build.dist %>/annotate'
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: ['<%= build.src %>/**/*'],
        tasks: ['debug'],
        options: {
          spawn: false,
        },
      },
    },
    clean: ['<%= build.dist %>/'],
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {
            expand: true,
            src: [
              '<%= build.dist %>/js/*.min.js',
              '!<%= build.dist %>/js/*.gz.js'
            ],
            ext: '.min.gz.js'
          },
          {
            expand: true,
            src: [
              '<%= build.dist %>/css/*.min.css',
              '!<%= build.dist %>/css/*.gz.css'
            ],
            ext: '.min.gz.css'
          }
        ]
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'cssmin', 'copy', 'uglify', 'compress', 'writeConfig']);

  grunt.registerTask('debug', ['clean', 'concat', 'cssmin', 'copy', 'writeConfig']);

};
