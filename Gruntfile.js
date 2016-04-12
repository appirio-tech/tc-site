/*global module:false*/
/**
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER
 * @version 1.1
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed LC related constants
 */
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
    domain: grunt.option || 'topcoder.com',
    mainURL: grunt.option('main-url') || 'http://local.topcoder.com',
    apiURL: grunt.option('api-url') || 'https://api.topcoder.com/v2',
    api3URL: grunt.option('api3-url') || 'https://api.topcoder.com/v3',
    apiGatewayURL: grunt.option('api-gateway-url') || 'https://internal-api.topcoder.com/v3',
    searchURL : grunt.option('search-url') || 'https://www.topcoder.com/search/members/?q=',
    cdnURL: grunt.option('cdn-url') || '/mf',
    useVer: grunt.option('use-ver') || false,
    version: grunt.option('cdn-version') || '',
    communityURL: grunt.option('community-url') || '//community.topcoder.com',
    reviewAppURL: grunt.option('review-app-url') || 'software.topcoder.com/review',
    helpAppURL: grunt.option('help-app-url') || 'help.topcoder.com',
    forumsAppURL: grunt.option('forums-app-url') || 'apps.topcoder.com/forums/',
    swiftProgramId: grunt.option('swift-program-id') || 3445,
    swiftProgramURL: grunt.option('swift-program-url') || 'http://ios.topcoder.com',
    arenaURL: grunt.option('arena-url') || '//arena.topcoder.com',

    // only used on wp setup
    useGz: grunt.option('use-gz') || false,
    useMin: grunt.option('use-min') || false,
    useCND: grunt.option('use-cdn') || false,

    myFiltersURL: grunt.option('my-filters-url') || '//lc1-user-settings-service.herokuapp.com',
    cbURL: grunt.option('cb-url') || 'https://coderbits.com',

    blogRSSFeedURL: grunt.option('blog-rss-feed') || 'https://www.topcoder.com/feed/?post_type=blog',
    photoLinkBaseURL: grunt.option('photo-link-base') || 'https://www.topcoder.com',

    marketingMessageMyDashURL: grunt.option('marketing-message-my-dash-url') || 'https://banners-r-us.herokuapp.com/serve?size=650x150'
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

  var concatCssFiles = {};
  var minifyCssFiles = {};
  var uglifyJsFiles = {};

  for (var name in pkg_config.packages) {
    concatCssFiles['tmp/' + name + '.concat.css'] = addBaseFilePath(pkg_config.packages[name].css, dist + '/css/');
    minifyCssFiles[dist + '/css/' + name + '.min.css'] = ['tmp/' + name + '.concat.css'];
    uglifyJsFiles[dist + '/js/' + name + '.min.js'] = addBaseFilePath(pkg_config.packages[name].js, dist + '/js/');
  }

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
        files: concatCssFiles
      }
    },
    cssmin: {
      minify: {
        cwd: '<%= build.srcCss %>',
        ext: '.min.css',
        files: minifyCssFiles
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
        files: uglifyJsFiles
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
