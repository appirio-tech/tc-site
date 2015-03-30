/*global module:false*/
module.exports = function(grunt) {
  // Load grunt libraries from package.json
  require('load-grunt-tasks')(grunt);

  var pkg_config = grunt.file.readJSON('wp/wp-content/themes/tcs-responsive/config/script-register.json');
  
  var dependencies = grunt.file.read('src/dependencies.html');
  var analytics = grunt.file.read('src/analytics.html');
  var header = grunt.file.read('src/header.html');
  var footer = grunt.file.read('src/footer.html');

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
    mainURL: grunt.option('main-url') || 'http://local.topcoder.com',
    apiURL: grunt.option('api-url') || 'https://api.topcoder.com/v2',
    cdnURL: grunt.option('cdn-url') || '/mf',
    useVer: grunt.option('use-ver') || false,
    version: grunt.option('cdn-version') || '',
    communityURL: grunt.option('community-url') || '//community.topcoder.com',

    // only used on wp setup
    useGz: grunt.option('use-gz') || false,
    useMin: grunt.option('use-min') || false,
    useCND: grunt.option('use-cdn') || false,
    

    lcURL: grunt.option('lc-url') || '//prod-lc1-ext-challenge-service.herokuapp.com',
    lcDiscussionURL: grunt.option('lc-discussion-url') || '//prod-lc1-discussion-service.herokuapp.com',
    lcUserURL: grunt.option('lc-user-url') || '//prod-lc1-user-service.herokuapp.com',
    lcSiteUrl: grunt.option('lc-site-url') || '//beta.topcoder.com',
    myFiltersURL: grunt.option('my-filters-url') || '//lc1-user-settings-service.herokuapp.com',
    cbURL: grunt.option('cb-url') || 'https://coderbits.com'
  };

  tcconfig.domain = function() {
    var domainSplits = tcconfig.mainURL.split('.');
    return domainSplits[domainSplits.length-2] + "." + domainSplits[domainSplits.length-1];
  }();

  var cdnPrefix =  tcconfig.cdnURL + (tcconfig.useVer ? '/' + tcconfig.version : '');
  var prodSuffix =  '.min'; //TODO fix gzip tcconfig.useMin ? '.min' : '';

  var replaces = { 
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
    },
    js: {
      options: {
        patterns: [
          {
            match: 'tcconfig',
            replacement: tcconfig
          },
          {
            match: 'community',
            replacement: tcconfig.communityURL
          }
        ]
      },
      files: [
        { cwd: '<%= build.src %>/js', src: '**/*', dest: '<%= build.dist %>/js', expand: true },
      ]
    },
  };

  // custom tasks
  grunt.registerTask('buildPackages', 'Build packages based on supplied configuration', function(environment) {



    var globalRepls = function(snippet) {
      return snippet
        .replace(/@@analytics/g, analytics)
        .replace(/@@dependencies/g, dependencies)
        .replace(/@@tcconfig/g, JSON.stringify(tcconfig))
        //.replace(/@@domain/g, cookieDomain)
        .replace(/@@community/g, tcconfig.communityURL);
    }

    header = globalRepls(header);
    footer = globalRepls(footer);

    for (var name in pkg_config.packages) {
      var pkg = pkg_config.packages[name];
      if (pkg.url) {
        var css = "";
        var scripts = "";
        if (environment == "debug") {
          var ts = new Date().getTime();
          pkg.css.forEach(function(cssPath) {
            css += "<link rel='stylesheet' href='" + cdnPrefix + "/css/" + cssPath + "?ver=" + ts + "' type='text/css' media='all' />";
          });
          pkg.js.forEach(function(jsPath) {
            scripts += "<script type='text/javascript' src='" + cdnPrefix + "/js/" + jsPath + "?ver=" + ts + "'></script>";
          });
        } else {
          css = "<link rel='stylesheet' href='" + cdnPrefix + "/css/" + name + prodSuffix + ".css?ver=<%= gitinfo.local.branch.current.shortSHA %>' type='text/css' media='all' />";
          scripts = "<script type='text/javascript' src='" + cdnPrefix + "/js/" + name + prodSuffix + ".js?ver=<%= gitinfo.local.branch.current.shortSHA %>'></script>";
        }

        var head = grunt.file.read(srcJS + 'app/' + pkg.url + '/head.html') || '<html lang="en" itemscope itemtype="http://schema.org/Article" ng-app="challengeDetails"><head>';

        replaces[name] = {
          options: {
            patterns: [
              {
                match: 'header',
                replacement: header.replace('@@css', css).replace('@@head', head)
              },
              {
                match: 'footer',
                replacement: footer.replace('@@scripts', scripts)
              },
            ]
          },
          files: [{ 
            src: ['<%= build.src %>/js/app/' + pkg.url + '/index.html'], 
            dest: '<%= build.dist %>/html/' + pkg.url + '/index.html' 
          }]
        };
      }
    }
  });

  // wp config.json file based on same settings
  grunt.registerTask('writeConfig', function() {
    // Write config to file
    grunt.file.write('wp/config.json', JSON.stringify(tcconfig, null, 2));
  });

  // Project configuration.
  grunt.initConfig({
    gitinfo : {},
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
    replace: replaces,
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
          '<%= build.dist %>/js/default.min.js': addBaseFilePath(pkg_config.packages.default.js, dist + '/js/'),
          '<%= build.dist %>/js/challengelanding.min.js': addBaseFilePath(pkg_config.packages.challengelanding.js, dist + '/js/'),
          '<%= build.dist %>/js/challenges.min.js': addBaseFilePath(pkg_config.packages.challenges.js, dist + '/js/'),
          '<%= build.dist %>/js/challengeterms.min.js': addBaseFilePath(pkg_config.packages.challengeterms.js, dist + '/js/'),
          '<%= build.dist %>/js/challengesubmit.min.js': addBaseFilePath(pkg_config.packages.challengesubmit.js, dist + '/js/'),
          '<%= build.dist %>/js/ng-details.min.js': addBaseFilePath(pkg_config.packages['ng-details'].js, dist + '/js/'),
          '<%= build.dist %>/js/ngChallenges.min.js': addBaseFilePath(pkg_config.packages.ngChallenges.js, dist + '/js/'),
          '<%= build.dist %>/js/ng-member-profile.min.js': addBaseFilePath(pkg_config.packages['ng-member-profile'].js, dist + '/js/'),
          '<%= build.dist %>/js/ng-users.min.js': addBaseFilePath(pkg_config.packages['ng-users'].js, dist + '/js/'),
          '<%= build.dist %>/js/profile-builder.min.js': addBaseFilePath(pkg_config.packages['profile-builder'].js, dist + '/js/')
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
  grunt.registerTask('default', ['gitinfo', 'clean', 'buildPackages:dist', 'copy', 'replace', 'concat',  'cssmin', 'uglify', 'compress', 'writeConfig']);
  grunt.registerTask('dev', ['debug', 'watch'])
  grunt.registerTask('debug', ['clean', 'buildPackages:debug', 'copy', 'replace', 'concat', 'cssmin', 'writeConfig']);
};
