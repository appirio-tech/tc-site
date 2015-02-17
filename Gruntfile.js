/*global module:false*/
module.exports = function(grunt) {
  // Load grunt libraries from package.json
  require('load-grunt-tasks')(grunt);

  var pkg_config = grunt.file.readJSON('wp/wp-content/themes/tcs-responsive/config/script-register.json');
  
  var dependencies = grunt.file.read('src/dependencies.html');
  var analytics = grunt.file.read('src/analytics.html');
  var header = grunt.file.read('src/header.html');

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
    cdnURL: grunt.option('cdn-url') || '/mf',
    useVer: grunt.option('use-ver') || false,
    version: grunt.option('cdn-version') || '',

    // broken on challenge details 
    useGz: grunt.option('use-gz') || false,
    useMin: grunt.option('use-min') || false,
    // only used on wp setup
    useCND: grunt.option('use-cdn') || false,

    lcURL: grunt.option('lc-url') || 'http://dev-lc1-ext-challenge-service.herokuapp.com',
    lcDiscussionURL: grunt.option('lc-discussion-url') || 'http://dev-lc1-discussion-service.herokuapp.com',
    lcUserURL: grunt.option('lc-user-url') || 'http://dev-lc1-user-service.herokuapp.com',
    lcSiteUrl: grunt.option('lc-site-url') || 'http://dev-lc1-challenge-app.herokuapp.com',
    myFiltersURL: grunt.option('my-filters-url') || 'https://staging-user-settings-service.herokuapp.com',
    cbURL: grunt.option('cb-url') || 'https://coderbits.com'
  };

  var cdnPrefix =  tcconfig.cdnURL + (tcconfig.useVer ? '/' + tcconfig.version : '');
  var fileSuffix =  tcconfig.useMin ? '.min' : '';

  for (var name in pkg_config.packages) {
    var pkg = pkg_config.packages[name];
    if (pkg.url) {
      pkg.debugCssInclude = "";
      pkg.css.forEach(function(cssPath) {
        pkg.debugCssInclude += "<link rel='stylesheet' href='" + cdnPrefix + "/css/" + cssPath + "' type='text/css' media='all' />\r\n";
      });

      pkg.debugJsInclude = "";
      pkg.js.forEach(function(jsPath) {
        pkg.debugJsInclude += "<script type='text/javascript' src='" + cdnPrefix + "/js/" + jsPath + "'></script>\r\n";
      });
    }
  }

  // new config setting
  header = header.replace('@@tcconfig', JSON.stringify(tcconfig));

  // wp config.json file based on same settings
  grunt.registerTask('writeConfig', function() {
    // Write config to file
    grunt.file.write('wp/config.json', JSON.stringify(tcconfig, null, 2));
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
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'css',
              replacement: "<link rel='stylesheet' href='" + cdnPrefix + "/css/ng-details" + fileSuffix + ".css' type='text/css' media='all' />"
            },
            {
              match: 'scripts',
              replacement: "<script type='text/javascript' src='" + cdnPrefix + "/js/ng-details" + fileSuffix + ".js'></script>"
            },
            {
              match: 'dependencies',
              replacement: dependencies
            },
            {
              match: 'analytics',
              replacement: analytics
            },
            {
              match: 'header',
              replacement: header
            },
          ]
        },
        files: [
          { src: ['<%= build.src %>/js/app/challenge-details/index.html'], dest: '<%= build.dist %>/html/challenge-details/index.html' },
        ]
      },
      debug: {
        options: {
          patterns: [
            {
              match: 'css',
              replacement: pkg_config.packages['ng-details'].debugCssInclude
            },
            {
              match: 'scripts',
              replacement: pkg_config.packages['ng-details'].debugJsInclude
            },
            {
              match: 'dependencies',
              replacement: dependencies
            },
            {
              match: 'analytics',
              replacement: analytics
            },
            {
              match: 'header',
              replacement: header
            },
          ]
        },
        files: [
          { src: ['<%= build.src %>/js/app/challenge-details/index.html'], dest: '<%= build.dist %>/html/challenge-details/index.html' },
        ]
      },
      css: {
        options: {
          patterns: [
            {
              match: 'cdn',
              replacement: cdnPrefix
            },
          ]
        },
        files: [
          { cwd: '<%= build.src %>/css', src: '**/*.css', dest: '<%= build.dist %>/css', expand: true },
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      css: {
        files: {
          '<%= build.tmp %>/default.concat.css': addBaseFilePath(pkg_config.packages.default.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/challengelanding.concat.css': addBaseFilePath(pkg_config.packages.challengelanding.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/challenges.concat.css': addBaseFilePath(pkg_config.packages.challenges.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/challengeterms.concat.css': addBaseFilePath(pkg_config.packages.challengeterms.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/challengesubmit.concat.css': addBaseFilePath(pkg_config.packages.challengesubmit.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/ng-details.concat.css': addBaseFilePath(pkg_config.packages['ng-details'].css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/ngChallenges.concat.css': addBaseFilePath(pkg_config.packages.ngChallenges.css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/ng-member-profile.concat.css': addBaseFilePath(pkg_config.packages['ng-member-profile'].css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/ng-users.concat.css': addBaseFilePath(pkg_config.packages['ng-users'].css, '<%= build.dist %>/css/'),
          '<%= build.tmp %>/profile-builder.concat.css': addBaseFilePath(pkg_config.packages['profile-builder'].css, '<%= build.dist %>/css/')
        }
      }
    },
    cssmin: {
      minify: {
        cwd: '<%= build.srcCss %>',
        ext: '.min.css',
        files: {
          '<%= build.dist %>/css/default.min.css': ['<%= build.tmp %>/default.concat.css'],
          '<%= build.dist %>/css/challengelanding.min.css': ['<%= build.tmp %>/challengelanding.concat.css'],
          '<%= build.dist %>/css/challenges.min.css': ['<%= build.tmp %>/challenges.concat.css'],
          '<%= build.dist %>/css/challengeterms.min.css': ['<%= build.tmp %>/challengeterms.concat.css'],
          '<%= build.dist %>/css/challengesubmit.min.css': ['<%= build.tmp %>/challengesubmit.concat.css'],
          '<%= build.dist %>/css/ng-details.min.css': ['<%= build.tmp %>/ng-details.concat.css'],
          '<%= build.dist %>/css/ngChallenges.min.css': ['<%= build.tmp %>/ngChallenges.concat.css'],
          '<%= build.dist %>/css/ng-member-profile.min.css': ['<%= build.tmp %>/ng-member-profile.concat.css'],
          '<%= build.dist %>/css/ng-users.min.css': ['<%= build.tmp %>/ng-users.concat.css'],
          '<%= build.dist %>/css/profile-builder.min.css': ['<%= build.tmp %>/profile-builder.concat.css'],
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
        cwd: '<%= build.src %>/js',
        src: '**/*',
        dest: '<%= build.dist %>/js',
        expand: true
      }
      ]
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
    clean: ['<%= build.dist %>/', '<%= build.tmp %>/'],
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
  grunt.registerTask('default', ['clean', 'replace:dist', 'replace:css', 'concat',  'cssmin', 'copy', 'uglify', 'compress', 'writeConfig']);
  grunt.registerTask('dev', ['debug', 'watch'])
  grunt.registerTask('debug', ['clean', 'replace:debug', 'replace:css', 'concat', 'cssmin', 'copy', 'writeConfig']);


  // custom tasks
  grunt.registerTask('header', 'Build header based on supplied configuration', function(environment) {
    header = header.replace('@@tcconfig', JSON.stringify(tcconfig));
  });
};
