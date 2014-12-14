/**
 * This code is copyright (c) 2014 Topcoder Corporation
 *
 * author: f3z0
 * version 1.0
 */
'use strict';

angular.module('tc.coderbitsService', [
    'restangular'
])

/**
 * To retrieve information from non api source .
 */
.factory('CoderbitsRestangular', ['CODERBITS_API_HOST', 'Restangular',
    function(host, Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('https://' + host);
        });
    }
])

/**
 * This service is a central place for methods to interact with API server.
 */
.factory('CoderbitsService', ['CoderbitsRestangular', '$q',
    function(CoderbitsRestangular, $q) {
        return {
            'getOverview': function(handle){
              var deferred = $q.defer();
              CoderbitsRestangular.one('', handle + '.json').get().then(function(coderbits){
                deferred.resolve([
                  {name: "Top Areas", data: coderbits.top_areas},
                  {name: "Top Environments", data: coderbits.top_environments},
                  {name: "Top Frameworks", data: coderbits.top_frameworks},
                  {name: "Top Interests", data: coderbits.top_interests},
                  {name: "Top Languages", data: coderbits.top_languages},
                  {name: "Top Skills", data: coderbits.top_skills},
                  {name: "Top Tools", data: coderbits.top_tools},
                  {name: "Top Traits", data: coderbits.top_traits}
                ]);
              });
              return deferred.promise;
            },
            'getDesigns': function(handle) {
              return CoderbitsRestangular.one('api/designs/' + handle).get();
            },
            'getUser': function(handle) {
              var deferred = $q.defer();
              var CoderbitsService = this;
              // Returns fetched restangular object of the fetched user
              var coderbits;
              CoderbitsRestangular.one('', handle + '.json').get().then(function(fetchedResult) {
                  coderbits = fetchedResult;
                  var p = {};

                  if(coderbits.showSummary){
                    p.summary = CoderbitsService.getCollection(handle, 'summary');
                    p.recentactivities = CoderbitsService.getCollection(handle, 'recentactivities');
                  }
                  
                  if (coderbits.showSkills) {
                      p.skills = CoderbitsService.getCollection(handle, 'skills');
                      p.languages = CoderbitsService.getCollection(handle, 'languages');
                      p.environments = CoderbitsService.getCollection(handle, 'environments');
                      p.frameworks = CoderbitsService.getCollection(handle, 'frameworks');
                      p.tools = CoderbitsService.getCollection(handle, 'tools');
                      p.traits = CoderbitsService.getCollection(handle, 'traits');
                      p.interests = CoderbitsService.getCollection(handle, 'interests');
                  }

                  if (coderbits.showCode) {
                      p.repositoriesown = CoderbitsService.getCollection(handle, 'repositoriesown');
                      p.repositoriescollaborate = CoderbitsService.getCollection(handle, 'repositoriescollaborate');
                      p.repositoriessupport = CoderbitsService.getCollection(handle, 'repositoriessupport');
                      p.repositorieswatch = CoderbitsService.getCollection(handle, 'repositorieswatch');
                      p.snippets = CoderbitsService.getCollection(handle, 'snippets');
                  }

                  if (coderbits.showBinaries) {
                      p.apps = CoderbitsService.getCollection(handle, 'apps');
                      p.packages = CoderbitsService.getCollection(handle, 'packages');
                  }

                  if (coderbits.showDesigns) {
                      p.designs = CoderbitsService.getCollection(handle, 'designs');
                  }

                  if (coderbits.showEducation) {
                      p.courses = CoderbitsService.getCollection(handle, 'courses');
                      p.readings = CoderbitsService.getCollection(handle, 'readings');
                      p.writings = CoderbitsService.getCollection(handle, 'writings');
                      p.answers = CoderbitsService.getCollection(handle, 'answers');
                      p.presentations = CoderbitsService.getCollection(handle, 'presentations');
                  }

                  if (coderbits.showCompetition) {
                      p.challenges = CoderbitsService.getCollection(handle, 'challenges');
                  }

                  if (coderbits.showAwards) {
                      p.recommendations = CoderbitsService.getCollection(handle, 'recommendations');
                      p.badges = CoderbitsService.getCollection(handle, 'badges');
                      p.badgesother = CoderbitsService.getCollection(handle, 'badgesother');
                  }

                  if (coderbits.showMemberships) {
                      p.memberships = CoderbitsService.getCollection(handle, 'memberships');
                  }

                  if (coderbits.showActivityStream) {
                      p.activities = CoderbitsService.getCollection(handle, 'activities');
                  }

                  return $q.all(p);
                  
              }, deferred.reject).then(function(fetchedResult) {
                  coderbits.pages = fetchedResult;

                  if(coderbits.showSummary) {
                    coderbits.pages.summary.Courses = _.map(coderbits.pages.summary.Courses, function(courseCollection){
                      var courseObj = {}
                      courseObj.external_account = courseCollection[0].external_account;
                      courseObj.count = courseCollection.length;
                      courseObj.name = courseObj.external_account.friendly_name;
                      courseObj.skills = _.reduce(
                        _.map(_.compact(_.pluck(courseCollection, 'skill')), function(skill){return skill.split(',')}),
                         function(skillSubArr, skillFullArr){
                          return (skillFullArr||skillSubArr).concat(skillSubArr);
                        },
                      []).join(',');
                      if(courseObj.skills === '') delete courseObj.skills;
                      var minDate = _.min(_.map(_.pluck(courseCollection, 'completed'), function(d){if(d) return new Date(d)}));
                      var maxDate = _.max(_.map(_.pluck(courseCollection, 'completed'), function(d){if(d) return new Date(d)}));
                      if(minDate instanceof Date && maxDate instanceof Date) courseObj.date_range = ((minDate.getMonth()+1)/100).toFixed(2).replace('0.','') + '/' + minDate.getFullYear() + ' - ' +  ((maxDate.getMonth()+1)/100).toFixed(2).replace('0.','') + '/' + maxDate.getFullYear();
                      return courseObj;
                    });
                  }

                  if(coderbits.showSkills) {
                    coderbits.pages.skills.title = 'Verified Skills';
                    coderbits.pages.skills.type = 'skill';
                    coderbits.pages.skills.desc = 'Skills the developer has proven experience and proficiency via actions taken on linked accounts. Actions can be source code shared on GitHub, answers given to question on Stack Overflow, packages shared on NuGet, courses completed on Treehouse, and much more.';
                    coderbits.pages.skills.more = CoderbitsService.more;
                    coderbits.pages.skills.handle = handle;
                    coderbits.pages.skills.endpoint = 'skills';

                    coderbits.pages.languages.title = 'Languages';
                    coderbits.pages.languages.type = 'skill';
                    coderbits.pages.languages.desc = 'Languages the developer has proven experience and proficiency via actions taken on linked accounts.';
                    coderbits.pages.languages.more = CoderbitsService.more;
                    coderbits.pages.languages.handle = handle;
                    coderbits.pages.languages.endpoint = 'languages';

                    coderbits.pages.environments.title = 'Environments';
                    coderbits.pages.environments.type = 'skill';
                    coderbits.pages.environments.desc = 'Environments the developer has proven experience and proficiency via actions taken on linked accounts.';
                    coderbits.pages.environments.more = CoderbitsService.more;
                    coderbits.pages.environments.handle = handle;
                    coderbits.pages.environments.endpoint = 'environments';

                    coderbits.pages.frameworks.title = 'Frameworks';
                    coderbits.pages.frameworks.type = 'skill';
                    coderbits.pages.frameworks.desc = 'Frameworks the developer has proven experience and proficiency via actions taken on linked accounts.';
                    coderbits.pages.frameworks.more = CoderbitsService.more;
                    coderbits.pages.frameworks.handle = handle;
                    coderbits.pages.frameworks.endpoint = 'frameworks';

                    coderbits.pages.tools.title = 'Tools';
                    coderbits.pages.tools.type = 'skill';
                    coderbits.pages.tools.desc = 'Tools the developer has proven experience and proficiency via actions taken on linked accounts.';
                    coderbits.pages.tools.more = CoderbitsService.more;
                    coderbits.pages.tools.handle = handle;
                    coderbits.pages.tools.endpoint = 'tools';

                    coderbits.pages.interests.title = 'Interests';
                    coderbits.pages.interests.type = 'skill';
                    coderbits.pages.interests.desc = 'Combination of verified skills and skills the developer has expressed an interest in via information on linked accounts. Interests can be from watching source code on GitHub, Meetup group categories, listed skills on LinkedIn, tags used on Forrst, and much more.';
                    coderbits.pages.interests.more = CoderbitsService.more;
                    coderbits.pages.interests.handle = handle;
                    coderbits.pages.interests.endpoint = 'interests';

                    coderbits.pages.traits.title = 'Traits';
                    coderbits.pages.traits.type = 'trait';
                    coderbits.pages.traits.desc = 'The core traits the developer exhibits through actions taken on linked accounts.';
                    coderbits.pages.traits.more = CoderbitsService.more;
                    coderbits.pages.traits.handle = handle;
                    coderbits.pages.traits.endpoint = 'traits';
                  }

                  if(coderbits.showCode) {
                    coderbits.pages.repositoriesown.title = 'Own';
                    coderbits.pages.repositoriesown.type = 'repository';
                    coderbits.pages.repositoriesown.desc = 'Code repositories the developer has created, owns, or administers. In some instances forked or cloned repositories will be included as well.';
                    coderbits.pages.repositoriesown.more = CoderbitsService.more;
                    coderbits.pages.repositoriesown.handle = handle;
                    coderbits.pages.repositoriesown.endpoint = 'repositoriesown';

                    coderbits.pages.repositoriescollaborate.title = 'Collaborate';
                    coderbits.pages.repositoriescollaborate.type = 'repository';
                    coderbits.pages.repositoriescollaborate.desc = 'Code repositories the developer has collaborated on.';
                    coderbits.pages.repositoriescollaborate.more = CoderbitsService.more;
                    coderbits.pages.repositoriescollaborate.handle = handle;
                    coderbits.pages.repositoriescollaborate.endpoint = 'repositoriescollaborate';

                    coderbits.pages.repositoriessupport.title = 'Support';
                    coderbits.pages.repositoriessupport.type = 'repository';
                    coderbits.pages.repositoriessupport.desc = 'Code repositories the developer has forked or cloned in order to support development. In most cases changes are made to the supported repository through pull requests.';
                    coderbits.pages.repositoriessupport.more = CoderbitsService.more;
                    coderbits.pages.repositoriessupport.handle = handle;
                    coderbits.pages.repositoriessupport.endpoint = 'repositoriessupport';

                    coderbits.pages.repositorieswatch.title = 'Watch';
                    coderbits.pages.repositorieswatch.type = 'repository';
                    coderbits.pages.repositorieswatch.desc = 'Code repositories the developer watches or follows driven by an interest in the repository, source code, or functionality.';
                    coderbits.pages.repositorieswatch.more = CoderbitsService.more;
                    coderbits.pages.repositorieswatch.handle = handle;
                    coderbits.pages.repositorieswatch.endpoint = 'repositorieswatch';

                    coderbits.pages.snippets.title = 'Snippets';
                    coderbits.pages.snippets.type = 'repository';
                    coderbits.pages.snippets.desc = 'Code snippets the developer has created and owns.';
                    coderbits.pages.snippets.more = CoderbitsService.more;
                    coderbits.pages.snippets.handle = handle;
                    coderbits.pages.snippets.endpoint = 'snippets';
                  }

                  if (coderbits.showBinaries) {
                    coderbits.pages.apps.title = 'Apps';
                    coderbits.pages.apps.type = 'repository';
                    coderbits.pages.apps.desc = 'Lorem ipsum';
                    coderbits.pages.apps.more = CoderbitsService.more;
                    coderbits.pages.apps.handle = handle;
                    coderbits.pages.apps.endpoint = 'apps';

                    coderbits.pages.packages.title = 'Packages';
                    coderbits.pages.packages.type = 'repository';
                    coderbits.pages.packages.desc = 'Libraries and tools the developer has created from source code and provided to the community for consumption.';
                    coderbits.pages.packages.more = CoderbitsService.more;
                    coderbits.pages.packages.handle = handle;
                    coderbits.pages.packages.endpoint = 'packages';
                  }

                  if(coderbits.showEducation) {
                    coderbits.pages.answers.title = 'Answers';
                    coderbits.pages.answers.type = 'answer';
                    coderbits.pages.answers.desc = 'Answers given to community questions in order to educate and help others in the community.';
                    coderbits.pages.answers.more = CoderbitsService.more;
                    coderbits.pages.answers.handle = handle;
                    coderbits.pages.answers.endpoint = 'answers';

                    coderbits.pages.readings.title = 'Articles Read';
                    coderbits.pages.readings.type = 'reading';
                    coderbits.pages.readings.desc = 'Articles read in order to increase knowledge of software development skills.';
                    coderbits.pages.readings.more = CoderbitsService.more;
                    coderbits.pages.readings.handle = handle;
                    coderbits.pages.readings.endpoint = 'readings';

                    coderbits.pages.writings.title = 'Articles Written';
                    coderbits.pages.writings.type = 'article';
                    coderbits.pages.writings.desc = 'Articles written in order to educate and help others in the community.';
                    coderbits.pages.writings.more = CoderbitsService.more;
                    coderbits.pages.writings.handle = handle;
                    coderbits.pages.writings.endpoint = 'writings';

                    coderbits.pages.courses.title = 'Courses';
                    coderbits.pages.courses.type = 'course';
                    coderbits.pages.courses.desc = 'Educational courses taken in order to increase knowledge of software development skills.';
                    coderbits.pages.courses.more = CoderbitsService.more;
                    coderbits.pages.courses.handle = handle;
                    coderbits.pages.courses.endpoint = 'courses';

                    coderbits.pages.presentations.title = 'Presentations';
                    coderbits.pages.presentations.type = 'presentation';
                    coderbits.pages.presentations.desc = 'Presentations created and shared in order to educate and help others in the community.';
                    coderbits.pages.presentations.more = CoderbitsService.more;
                    coderbits.pages.presentations.handle = handle;
                    coderbits.pages.presentations.endpoint = 'presentations';
                  }
                  if (coderbits.showCompetition) {
                    coderbits.pages.challenges.title = 'Challenges';
                    coderbits.pages.challenges.type = 'challenge';
                    coderbits.pages.challenges.desc = 'Competition based challenges entered and completed in order to increase skills and show coding prowess.';
                    coderbits.pages.challenges.more = CoderbitsService.more;
                    coderbits.pages.challenges.handle = handle;
                    coderbits.pages.challenges.endpoint = 'challenges'; 
                 }
                 if(coderbits.showAwards) {
                    coderbits.pages.recommendations.title = 'Recommendations';
                    coderbits.pages.recommendations.type = 'recommendation';
                    coderbits.pages.recommendations.desc = 'Recommendations about the coder by peers, supervisors, and others from the community.';
                    coderbits.pages.recommendations.more = CoderbitsService.more;
                    coderbits.pages.recommendations.handle = handle;
                    coderbits.pages.recommendations.endpoint = 'recommendations'; 

                    coderbits.pages.badges.title = 'Other Badges';
                    coderbits.pages.badges.type = 'badge';
                    coderbits.pages.badges.desc = 'All the badges earned on other sites such as Coderbits.';
                    coderbits.pages.badges.more = CoderbitsService.more;
                    coderbits.pages.badges.handle = handle;
                    coderbits.pages.badges.endpoint = 'badges'; 

                    coderbits.pages.badgesother.title = 'Other Badges';
                    coderbits.pages.badgesother.type = 'badgeother';
                    coderbits.pages.badgesother.desc = 'All the badges earned on other sites such as Coderwall, Treehouse, Channel 9, etc.';
                    coderbits.pages.badgesother.more = CoderbitsService.more;
                    coderbits.pages.badgesother.handle = handle;
                    coderbits.pages.badgesother.endpoint = 'badgesother'; 
                 }
                 if (coderbits.showMemberships) {
                    coderbits.pages.memberships.title = 'Membership';
                    coderbits.pages.memberships.type = 'membership';
                    coderbits.pages.memberships.desc = 'The teams, organizations, and groups the coder is a member of.';
                    coderbits.pages.memberships.more = CoderbitsService.more;
                    coderbits.pages.memberships.handle = handle;
                    coderbits.pages.memberships.endpoint = 'memberships'; 
                 }
                 if (coderbits.showDesigns) {
                    coderbits.pages.designs.title = 'Designs';
                    coderbits.pages.designs.type = 'design';
                    coderbits.pages.designs.desc = 'Designs the developer has created to either share their work with the community or to offer for purchase.';
                    coderbits.pages.designs.more = CoderbitsService.more;
                    coderbits.pages.designs.handle = handle;
                    coderbits.pages.designs.endpoint = 'designs'; 
                 }
                 if (coderbits.showActivityStream) {
                     coderbits.pages.activities.title = 'Activity';
                     coderbits.pages.activities.type = 'activity';
                     coderbits.pages.activities.desc = 'The full history of actions taken by the coder.';
                     coderbits.pages.activities.more = CoderbitsService.more;
                     coderbits.pages.activities.handle = handle;
                     coderbits.pages.activities.endpoint = 'activities'; 
                     coderbits.pages.activities.items
                 }
                  deferred.resolve(coderbits);
              }, function(e) {
                  coderbits.pages = {};
                  deferred.resolve(coderbits);
              });

              return deferred.promise;
            },
            'getCollection': function(handle, type) {
                return CoderbitsRestangular.one('api/' + type + '/' + handle).get();
            },
            'more': function(section) {
              section.isLoading = true;
              CoderbitsRestangular.one('api/' + section.endpoint + '/' + section.handle +'?page=' + (section.page+1)).get().then(function(page){
                section.isLoading = false;
                section.items = section.items.concat(page.items)
                section.page = page.page;
                section.has_more = page.has_more;
              })
            }
        }
    }
])