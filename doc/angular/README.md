# Writing Angular for tc-site
* General AngularJS development guidelines can be found on the [AngularJS website](https://docs.angularjs.org/guide)
* Our root Angular directory is at [tcs-responsive/js/app](https://gitlab.com/topcoderinc/tc-site/tree/angular_service/wp-content/themes/tcs-responsive/js/app)
  * All our Angular apps are directories in this parent directory
  * Besides these apps, this directory contains the main application file and
    the `api` directory, which contains our core services that are shared across
    the apps
  * The main application file is [app.js](https://gitlab.com/topcoderinc/tc-site/blob/angular_service/wp-content/themes/tcs-responsive/js/app/app.js)
    * It handles global level configuration
    * ...and also sets up the main tc application
* In terms of the directory structure, code should be organized logically
  * (need to come up with specific standards here)
* Within each app, code should be separated into folders by type (controllers, services,
  filters, directives)
* All html should be contained in directives and templates 
* All DOM manipulation should be handled by directives. See the
  [Development Guide](https://docs.angularjs.org/guide/directive) for an example
  directive which manipulates the DOM.
  * There is still some jQuery cruft in the codebase, but code of this kind
    should be *avoided at all costs* and the existing cruft will soon by
    eliminated
<!-- TODO: figure out what the standard for controllers should be -->
* Controllers should be implemented by using the controller function on the main app object (the
  tc variable).
  (https://gitlab.com/topcoderinc/tc-site/blob/angular_service/wp-content/themes/tcs-responsive/js/app/challenges/controllers/challengeListingCtrl.js#L3)
* Services, filters and directives should all be their own modules
  (https://gitlab.com/topcoderinc/tc-site/blob/angular_service/wp-content/themes/tcs-responsive/js/app/challenges/services/challengeService.js#L3)
* Services should use Restangular (https://github.com/mgonto/restangular)
* Tables should use ngGrid: http://angular-ui.github.io/ng-grid/
* The use of external libraries is encourged but they must be approved before use.
* Use the Angular Loading Bar while the page is being loaded
  (http://chieffancypants.github.io/angular-loading-bar/)

## Approved AngularJS libraries

* ui-router for routing: https://github.com/angular-ui/ui-router
* ng-grid for tables: http://angular-ui.github.io/ng-grid/
* Restangular for AJAX requests: https://github.com/mgonto/restangular
* Angular Loading Bar for making AJAX requests less awkward: http://chieffancypants.github.io/angular-loading-bar/


# Modules and Namespacing

- You should wrap every file in an anonymous function so as not to pollute
  the global namespace
- Everything should be namespaced off of the root application `tc`
- Every application should create separate modules for its controllers,
  services, directives, filters, etc.
- For example:
  - An application calls "baz" would be created like this:
    `angular.module('tc.baz', 'tc.baz.controllers', 'tc.baz.services');`

# Services
- Core services are in the API module off of tc `tc.api`
- The idea behind this module is to create a new module for every API route as needed
- When writing a new application off of the `tc` module, you should aim to create small,
  generic services before writing anything application-specific
- If you need to do more advanced service logic, write a service off of your application
- The idea behind this is to create as much reusable code as possible and to never
  have to write to bare-bones services for the same API route
