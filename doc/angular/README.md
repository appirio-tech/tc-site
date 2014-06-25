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
