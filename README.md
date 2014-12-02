# Topcoder.com Wordpress site #

## Overview

The [topcoder] site is an AngularJS app backed by multiple REST APIs. The site 
stands as the primary entry point for a member into www.topcoder.com, and serves
the majority of functions on the www.topcoder.com domain.

Functions on the site are handled by a variety of REST APIs/services:
* [Topcoder API](http://docs.tcapi.apiary.io/)
* LowderCroud API
* Coderbits API

All APIs are authorized by a JWT (internally called tcjwt) issued by auth0. Site
login takes place by a coordination of authentication by auth0 and our legacy 
site. All data in the views, as well as actions that take place on the site,
should be coordinated by its respective API, no session state can be relied upon
from the legacy backend (wordpress).

The site has some legacy components that are being refactored:

* A wordpress backend - The impact here is that our pages need to be written as
wordpress template files rather than simple .html files. The wordpress admin 
interface is used by our marketing team to write blog entries and certain pages
on the site, but should only share a header and footer with the angular code.
* jQuery style code - As with most apps transitioning to angular.

Below, we explain some of the nuts and bolts to help new developers get
up-and-running.

## Local Env Setup ##

### The easiest way to get running fast is by running our [vagrant development
environment](https://github.com/appirio-tech/tc1-mf-vagrant). 

To install the site locally there are a few setup steps.

* Install a web server (Apapche or Nginx)
* Install PHP (mod_php for Apaache or PHP-FPM for Nginx)
* Install MySQL
* Clone this repo
* Make sure web server and php are capable of uploading a 20MB file.
* Modify /etc/hosts to have local.topcoder.com point to 127.0.0.1
* Your local webserver must be using port 80.
* Visit local.topcoder.com
* Install WordPress
* Import Prod Data
    * The data export is kept at https://github.com/topcoderinc/tc-site-data.
    * The XML file is imported at http://local.topcoder.com/wp-admin/admin.php?import=wordpress
* Enable plugins: TC API Hookup, Custom field Tempalte, Page-list, Per Page Widgets
* Activate TC Theme
* Import cft file from https://github.com/topcoderinc/tc-site-data at http://local.topcoder.com/wp-admin/options-general.php?page=custom-field-template.php
* Change Permlink to "postname" as http://local.topcoder.com/wp-admin/options-permalink.php
* Change the Home page to a static page and the front page to "New Home for QA and Profling" at http://www.topcoder.com/wp-admin/options-reading.php
* Add a env.php file to the `wp-content/themes/tcs-responsive/config` directory - the file should contain:
  <?php
    force_ssl_admin(false);
    force_ssl_login(false);
    ?>

## Environmental Variables ##

### After any change to your config.json, be sure to [update the CSS/JS registry](http://local.topcoder.com/wp-admin/themes.php?page=options.php) 

Environment variables are loaded form config.json. The config.json file is built during
grunt process, so be aware, when you run grunt, it will overwrite changes you have made.

The following command line options can be used ot customize the build:

* auth-client-id: The Auth0 ClientID to use
* auth-callback-url: The Auth0 callback 
* auth-ldap:  The Auth0 LDAP connection to use
* community-url: THe community URL to redirect to after login
* main-url: The main site URL.  This replaces WP_SITEURL and WP_HOME in env.php
* api-url: The API URL:  This replaces the TC_API_URL in env.php.
* cdn-url: This replaces the WP option on the theme settings page.
* use-cdn: This replaces the WP option on the theme settings page.
* use-min: This replaces the WP option on the theme settings page.
* use-ver: This replaces the WP option on the theme settings page.


## Javascript and CSS ##

There should be no Javascript or CSS in PHP template files; that is, all
Javascript and CSS should be in separate (and appropriately placed) `*.js` and
`*.css` files. The only acceptable time to include Javascript in a PHP template
is to pull data into a Javascript variable from PHP. You can break up Javascript
and CSS into as many files as is useful for organization without impacting
performance, since we minify and concatenate all our Javascript and CSS files in
production (that said, all your JS (especially Angular code) should be
minification-safe).

...that said, we should probably teach you how to

## add new JS and CSS files ##

Our JS and CSS files are concatenated and minified by [Grunt](http://gruntjs.com), which is
configured in `Gruntfile.js` in the root of this repo. The `grunt` process pulls
in the file `wp-content/themes/tcs-responsive/config/script-register.json` to
determine which files are to be concatenated and minified, as well as what
templates they are to be loaded on.

Each end-product of minification and concatenation is called a "package". Each
package has three properties: `name`, which is a *required* string that should
match the name of the package (i.e., the name of the property used to reference
the package); `js`, which is an array of strings referenced relative to
`wp-content/themes/tcs-responsive/js`; and `css`, which is an array referenced 
relative to `wp-content/themes/tcs-responsive/css`. After the "packages"
section, there is also a "templates" section that gives a mapping of package
names to PHP templates. This determines which packages will be loaded for which
templates.

While there is much JS and CSS that is more or less site-wide, you should
determine what CSS and JS your package uses and exclude everything else so as to
ensure optimal performance.

#### Example: ####

__Loading home page__:

1. Template used: front.php
2. The script loader will look at script-register.js and see that front.php is not included the "templates" object.
3. Since this page is not in the "templates" object, the page will default to
   using the "default" JS/CSS package. If minification is being used, this means
   `default.min.js` and `default.min.css` will be used; otherwise, all the files
   listed will be loaded individually.

For more information see `lib/scripts.php`

### Minification and the CDN ###

There are new theme options to control JS/CSS optimizations.
The options can be found at `/wp-admin/themes.php?page=options.php`.

* __Use CDN__:  This will change the base url for JS and CSS files to the url entered in the "CDN Base URL" setting.
  If CDN is being used it's assumed that JS/CSS is also minified.

  **Path**: "{$base_path}/{version}/{$type}/{$asset_name}.min.{$type}";

* __Use Minified JS/CSS__: If "Use CDN" is unchecked, this will attempt to use
  minified JS and CSS which is assumed to be in the folder
  `wp-content/themes/tcs-responsive/dist`. To build into this folder, simply run
  the `grunt` command with no arguments, and then move the files in `dist/js`
  and `dist/css` into the main `dist` folder. This Grunt script is also
  responsible for minifying and sending to CloudFront when the CDN is used.




## Development Guidelines ##

### Code Style ###

These are the formating rules our code should follow.

* Javascript
    * 2 spaces for indention and *no tabs*.
    * For Angular, first follow [our Angular style
      guide](https://gitlab.com/topcoderinc/angularjs-styleguide/tree/master)
    * Otherwise follow
    [Google's guidelines](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

### AngularJS ###

* Before you do any Angular development, you should look at our [detailed
  Angular
  guidelines](https://gitlab.com/topcoderinc/angularjs-styleguide/tree/master).

## Git Information ##

### Branch Model ###

To contribute to this repository, you must follow our branch model – *even if*
you're contributing from a fork of the repo. A branch for a given feature
takes the name format `<developer name>-<issue or feature ID>-<description>`.
Branches should be off of the tc-site `master` branch. When you are done with
your changes to this branch, you should submit a merge request against our
master branch.

Every Friday (sometimes postponed until Sunday), the `master` branch gets pushed to our QA server at
[http://tcqa1.topcoder.com](http://tcqa1.topcoder.com). If you need to make changes to your code that is
already in QA, you will need to do a pull against the most recent release branch, which will look like
`TC-<date>` (where `<date>` is the date of this coming Thursday – when our releases happen). The branch
you use for these changes should have the same format as usual, but something like
`-fix` should be appended to the end.

### Challenge Submission and Review ###

Registrants in a challenge should submit their work in Git as merge requests.
Challenge submissions should be in the form of a git patch.  We will
follow the [https://drupal.org](Drupal) methodology for patches.  This
description of a patch was taken from drupal.org:

> Patches are pieces of code that solve an existing issue. In fact, patches describe the changes between a before and
after state of either a module or core. By applying the patch the issue should no longer exist.

There is extensive documentation about how to create and apply patches. There are instructions https://drupal.org/patch

* Submitters should review the documentation on creating a patch:  https://drupal.org/node/707484
* Reviewers should review the documentation on applying a patch:  https://drupal.org/node/1399218

__Final Submissions should be in the form of a pull request.  See the section on Branch Model for more information__

### Recommend Workflow for Working on a Challenge ###

These are some recommended workflows to help you get started with Git.  Once
you become more familiar with Git, you can modify the workflow to fit your style.

**Working on a challenge**

1. Clone the repository. `git clone https://gitlab.com/topcoderinc/tc-site.git`
    * If you already have a repository setup, be sure to pull down the latest changes: `git pull origin master`
1. Create a new branch: `git checkout -b <branch_name>`
1. Make your changes, add new files, etc.
1. Commit changes as you make them with descriptive commit messages
1. If you create new files be sure to add them to git first `git add <file name>`

**Submitting a patch to a challenge**

1. Pull down the latest code: `git fetch origin`
1. Merge in the latest changes from the master branch: `git merge master`
1. Create a patch against the master branch:  `git diff master > patchn_ame.patch`
1. Submit the patch to the challenge

**Creating a pull request for for final approval**

1. Create a fork of the project on Gitlab if you haven't already.
1. Add the new remote to your local git repo.  `git remote add <remote_name> <remote_url>` for example
`git remote add mine git@gitlab.com:indytechcook/tc-site.git`.
1. Make sure all of the code is committed to the branch you were working on above.
1. Verify code is ready to be pushed by running `git status`
1. Push code to remote repository. `git push <remote_name> <branch_name>`
1. Create a pull request from your branch against the master branch on the main repository.

**More Git help**

More Git help can be found on several places online including the following:

* http://www.git-scm.com/book
* https://about.gitlab.com/getting-help/
* https://help.github.com/

If you prefer to use a GUI, I recommend using SourceTree.  SourceTree is available on Mac and Windows.  http://www.sourcetreeapp.com/
