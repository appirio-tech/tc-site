<?php
/**
 * Template Name: Challenges Active Contest List Page - Angular
 */

/**
 * @file
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER, ecnu_haozi
 * @version 1.2
 *
 * This template shows a list of challenges
 *
 * Changed in 1.1
 * Add two templates my-filters and save-filters to support "My filters" feature.
 *
 * Changed in 1.2 (topcoder new community site - Removal proxied API calls)
 * Removed LC related conditionals and calls
 */

function add_base_url() {
  $output = "<base href=\"" . get_site_url() . "/" . ACTIVE_CONTESTS_PERMALINK . "/\" />";
  echo $output;
}

add_action('wp_head', 'add_base_url');

// Register FullCalendar Print Stylesheet to get a more printer-friendly calendar. Note that we need to set media='print' so we have to do it here.
wp_enqueue_style('fullcalendar-print', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.1.1/fullcalendar.print.css', array(), null, 'print');

// Add the angluar libraries to WP
tc_setup_angular(); //tcs_responsive_scripts();
// Get the default header
get_header(); ?>
  <script>
    window.wordpressConfig = {
      permalink: '<?php echo get_permalink();?>',
      stylesheetDirectoryUri: '<?php echo get_stylesheet_directory_uri(); ?>'
    }
  </script>
<!-- moved ng-app to <html> element so page titles can be updated with angular -->
  <div class="content">
  <div id="main">
      <div ng-view>
      </div>


  <script type="text/ng-template" id="challenge-list.html">
    <article id="mainContent" class="layChallenges">
      <div class="container">
        <header>
          <h1>
            {{titles[contest.contestType]}}
            <span class="subscribeTopWrapper">
              <a class="feedBtn" target="_self" href="{{feedUrl}}" title="Subscribe to challenges"></a>
            </span>
          </h1>
          <aside class="rt">
            <span class="views">
              <a href="" ng-click="view = 'grid'" class="gridView" ng-class="{isActive: view == 'grid'}" qtip title="Layout" text="Grid View" community="design"></a>
              <a href="" ng-click="view = 'table'" class="listView" ng-class="{isActive: view == 'table'}" qtip title="Layout" text="List View" community="design"></a>
              <a href="" ng-show="contest.contestType === 'data'" ng-click="view = 'calendar'" class="calendarView" ng-class="{isActive: view == 'calendar'}" qtip title="Layout" text="Calendar View" community="design"></a>
            </span>
          </aside>
        </header>

        <div ng-hide="view === 'calendar'">
          <div data-tc-challenges-actions contest="contest" show-filters="showFilters" ng-show="contest.contestType && contest.contestType != ''"></div>

          <div  advanced-search
                apply-filter="searchSubmit"
                technologies="technologies"
                platforms="platforms"
                challenge-community="contest.contestType"
                challenge-status="contest.listType"
                show-on="showFilters"
                filter="filter"
                authenticated="authenticated"></div>

          <div class="upcomingCaption" ng-show="contest.listType === 'upcoming' && challenges.length != 0">All upcoming challenges may change</div>
          <div class="pastCaption" ng-show="contest.listType === 'past' && challenges.length != 0">Displaying all challenges from the past year. View longer time ranges at your own risk!</div>
            <div ng-show="dataDisplayed && challenges.length == 0 && contest.listType !== 'upcoming'">
            <br />
            <h3>
              There are no challenges at this time. Please check back later.
            </h3>
          </div>
          <div ng-show="dataDisplayed && challenges.length == 0 && contest.listType === 'upcoming'">
            <br />
            <h3>
              There are no upcoming challenges at this time. Please check back later.
            </h3>
          </div>
          <div class="dataChanges"  ng-show="challenges && challenges.length > 0">
            <div class="lt">
              <span ng-show="pagination.last">{{(pagination.pageIndex-1)*pagination.pageSize+1}}-{{pagination.last}} of {{pagination.total}}</span><span ng-show="challenges.length < pagination.total && contest.listType != 'past'"> | </span><a class="viewAll" ng-show="challenges.length < pagination.total && contest.listType != 'past'" ng-click="all()">View All</a>
            </div>
            <div id="challengeNav" class="rt">
              <a class="prevLink" ng-show="pagination.pageIndex > 1 && challenges.length > 0" ng-click="prev()">
                <i></i> Prev
              </a>
              <a class="nextLink" ng-show="pagination.total > pagination.pageIndex * pagination.pageSize" ng-click="next()">
                Next <i></i>
              </a>
            </div>
            <div class="mid onMobi">
              <a ng-hide="contest.listType === 'active'" href="/challenges/develop/active/" class="viewActiveCh">
                View Active Challenges<i></i>
              </a>
              <a ng-hide="contest.listType === 'past'" href="/challenges/develop/past/" class="viewPastCh">
                View Past Challenges<i></i>
              </a>
            </div>
          </div>
          <div ng-show="challenges.length > 0">
            <div id="tableView" class="viewTab" ng-show="view == 'table'">
              <div class="tableWrap tcoTableWRap dataTable tcoTable challengesGrid" ng-grid="gridOptions"></div>
            </div>
          </div>
          <div id="gridView2" class="viewTab hide" style="display: block;" ng-show="view == 'grid'" ng-class="{contestAll: contest.contestType == ''}">
            <div class="alt" id="gridAll" ng-class="{contestGrid: true}">
              <!-- React Implementation -->
              <div tc-contest-grid-react></div>
            </div>
          </div>
          <div class="dataChanges" ng-show="challenges && challenges.length > 0">
            <div class="lt">
              <span ng-show="pagination.last">{{(pagination.pageIndex-1)*pagination.pageSize+1}}-{{pagination.last}} of {{pagination.total}}</span><span ng-show="challenges.length < pagination.total && contest.listType != 'past'"> | </span><a class="viewAll" ng-show="challenges.length < pagination.total && contest.listType != 'past'" ng-click="all()">View All</a>
            </div>
            <div id="challengeNav" class="rt">
              <a class="prevLink" ng-show="pagination.pageIndex > 1 && challenges.length > 0" ng-click="prev()">
                <i></i> Prev
              </a>
              <a class="nextLink" ng-show="pagination.total > pagination.pageIndex * pagination.pageSize" ng-click="next()">
                Next <i></i>
              </a>
            </div>
            <div class="mid onMobi">
              <a ng-hide="contest.listType === 'active'" href="/challenges/develop/active/" class="viewActiveCh">
                View Active Challenges<i></i>
              </a>
              <a ng-hide="contest.listType === 'past'" href="/challenges/develop/past/" class="viewPastCh">
                View Past Challenges<i></i>
              </a>
            </div>
          </div>
          <div style="font-size:17px;display: none;margin: 50px auto; width:500px" ng-show="!challenges.length && !loading">There are no challenges under this category. Please check back later.</div>
        </div>
        <div ng-show="view === 'calendar'">
          <div class="dataCalendar" ng-model="calendarEventSources" calendar="dataCalendar" ui-calendar="calendarConfig.calendar"></div>
        </div>
        <div style="font-size:17px;margin: 50px auto; width:500px" ng-show="!challenges.length && loading == false">There are no challenges under this category. Please check back later.</div>
      </div>
    </article>
  </div>
  <div class="clear"></div>
</div>
</script>

<script type="text/ng-template" id="actions.html">
  <div class="actions">
    <div class="lt challengeType">
      <ul>
        <li><a href="/challenges/{{contest.contestType}}/active/" class="link" ng-class="{active: isActive('active')}">Open Challenges</a></li>
        <li><a href="/challenges/{{contest.contestType}}/past/" class="link" ng-class="{active: isActive('past')}">Past Challenges</a></li>
        <li><a href="/challenges/{{contest.contestType}}/upcoming/" class="link" ng-class="{active: isActive('upcoming')}">Upcoming Challenges</a></li>
        <!-- Coming soon!  <li><a href="//www.topcoder.com/review-opportunities/develop/" class="link">Review Opportunities</a></li> -->
      </ul>
    </div>

  </div>
</script>

<script type="text/ng-template" id="tooltip.html">
  <div class="tooltip" >
    <div class="inner">
      <header>{{popoverTitle}}{{title}}</header>
      <div class="data">
        <p class="contestTy">{{content}}</p>
      </div>
      <div class="arrow"></div>
    </div>
  </div>
</script>


<script type="text/ng-template" id="advanced-search.html">
  <div class="clear new-search-box" ng-if="challengeCommunity !== ''">
    <form ng-submit="addKeywords(tempOptions.text)">
      <input type="text" class="search-text" placeholder="Type a keyword" ng-model="tempOptions.text">
    </form>
    <a href="javascript:;" class="searchLink advSearch" ng-click="addKeywords(tempOptions.text)">
        <i></i>
    </a>
    <div class="clear"></div>
    <div class="selected-tags">
        <div class="wrapper">
            <ul class="left tags">
                <li class="left li-date-range" ng-if="filterOptions.startDate || filterOptions.endDate">
                  <div class="selecting-tag-wrapper">
                    <div class="date-ranges selected-tag">
                      <span class="selected-range left">
                        From {{formatDate(filterOptions.startDate)}} {{filterOptions.endDate ? ('to ' + formatDate(filterOptions.endDate)) : ''}}
                      </span>
                      <span class="tag-closedate right" ng-click="clearDates()"></span>
                    </div>
                  </div>
                </li>
                <li class="left remove challenges-type" ng-repeat="ch in filterOptions.challengeTypes">
                  <div class="selecting-tag-wrapper challenge-value">
                    <div class="selected-tag">
                      <span class="tag-text left">{{contestTypes[ch]}}</span>
                      <span class="tag-close right" ng-click="removeChallengeType(ch)"></span>
                    </div>
                  </div>
                </li>
                <li class="left remove platform-type" ng-repeat="plat in filterOptions.platforms">
                  <div class="selecting-tag-wrapper platform-value">
                    <div class="selected-tag">
                      <span class="tag-text left">{{plat}}</span>
                      <span class="tag-close right" ng-click="removePlatform(plat)"></span>
                    </div>
                  </div>
                </li>
                <li class="left remove technology-type" ng-repeat="tech in filterOptions.technologies">
                  <div class="selecting-tag-wrapper technology-value">
                    <div class="selected-tag">
                      <span class="tag-text left">{{tech}}</span>
                      <span class="tag-close right" ng-click="removeTechnology(tech)"></span>
                    </div>
                  </div>
                </li>
                <li class="left remove keyword-type" ng-repeat="token in filterOptions.keywords">
                  <div class="selecting-tag-wrapper keyword-value">
                    <div class="selected-tag">
                      <span class="tag-text left">Text: {{token}}</span>
                      <span class="tag-close right" ng-click="removeKeyword(token)"></span></div>
                  </div>
                </li>
            </ul>
            <div class="closetag right"  ng-show="hasFilters()">
                <a href="javascript:;" ng-click="reset()" >
                     <span>x</span><i>Clear All Tags</i>
                 </a>
                <save-filter ng-show="authenticated"></save-filter>           
             </div>
            <div class="clear"></div>
        </div>
    </div>
    <!-- Begin Dropdown filter -->
    <div class="filter-dropdown">
        <div class="wrapper">
            <div class="left challenge-type-selector" ng-hide="challengeCommunity === 'data'" tc-select2-hover>
                <select ui-select2="{placeholder: 'Challenge Type', searchInputPlaceholder: 'Enter a Challenge Type', width: '100%', noFocus: true}"
                  ng-model="tempOptions.challengeType" class="challenge-type" ng-change="addChallengeType(tempOptions.challengeType)">
                    <option></option>
                    <option ng-repeat="(ct, name) in contestTypes" ng-disabled="filterOptions.challengeTypes.indexOf(ct) !== -1" ng-value="ct">{{name}}</option>
                </select>
            </div>
            <div class="date-picker-wrapper left" tc-date-picker options="filterOptions">
                <div class="date-text">
                    <span class="picker-text">Submission End Date Range</span>
                    <span class="right datepicker-icon"></span>
                    <div class="clear"></div>
                </div>
                <div class="pickers">
                    <div class="pickers-wrapper">
                        <div class="picker-cal left">
                            <div class="pickers-content">
                                <label class="left datepic-head">Custom Date Range</label>
                                <div class="left from-wrapper">
                                    <div class="from-text-box left">
                                        <span class="limit-label left">From</span>
                                        <input type="text" class="right from-picker-text" name="from" disabled ng-value="formatDate(filterOptions.startDate)">
                                    </div>
                                </div>
                                <div class="left from-wrapper">
                                    <div class="to-text-box left">
                                        <span class="limit-label left">To</span>
                                        <input type="text" class="right to-picker-text" name="to" disabled ng-value="formatDate(filterOptions.endDate)">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="calendar">
                                <div class="from-datepicker"></div>
                                <div class="to-datepicker"></div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="quick-pick left">
                            <ul class="quick-pick-list" ng-if="challengeStatus === 'past'">
                                <li><a href="javascript:;" ng-click="dateCtrl.today()">Today</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.yesterday()">Yesterday</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.last7Days()">Last 7 days</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.pastThisMonth()">This Month</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.lastMonth()">Last Month</a>
                                </li>
                            </ul>
                            <ul class="quick-pick-list" ng-if="challengeStatus !== 'past'">
                                <li><a href="javascript:;" ng-click="dateCtrl.today()">Today</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.tomorrow()">Tomorrow</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.next7Days()">Next 7 days</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.thisMonth()">This Month</a>
                                </li>
                                <li><a href="javascript:;" ng-click="dateCtrl.nextMonth()">Next Month</a>
                                </li>
                            </ul>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>

            <div class="left platform-selector" ng-show="platforms && platforms.length > 0" tc-select2-hover>
                <select ui-select2="{placeholder: 'Platform', searchInputPlaceholder: 'Enter a Platform Tag', width: '100%'}"
                  ng-model="tempOptions.platform" class="platform" ng-change="addPlatform(tempOptions.platform)">
                    <option></option>
                    <option ng-repeat="plat in platforms track by $index" ng-disabled="filterOptions.platforms.indexOf(plat) !== -1">{{plat}}</option>
                </select>
            </div>

            <div class="left technology-selector" ng-show="technologies && technologies.length > 0" tc-select2-hover>
                <select ui-select2="{placeholder: 'Technology', searchInputPlaceholder: 'Enter a Technology Tag', width: '100%'}"
                  ng-model="tempOptions.technology" ng-change="addTechnology(tempOptions.technology)" class="technology">
                    <option></option>
                    <option ng-repeat="tech in technologies track by $index" ng-disabled="filterOptions.technologies.indexOf(tech) !== -1">{{tech}}</option>
                </select>
            </div>
            <div class="right filtersSectn" ng-show="authenticated">
              <div class="checkbox myChallenges chkWrap" ng-show="challengeStatus === 'active' && challengeCommunity !== 'data'">
                <label class="myChallengesLabel"><input type="checkbox" class="chk" ng-model="filterOptions.userChallenges" ng-change="applyFilter()"><span class="chkLbl">My Challenges Only</span></label>
              </div>
              <my-filters></my-filters>
            </div>
    </div>
    <!-- End Dropdown filter -->
  </div>
</script>

<script type="text/ng-template" id="save-filter.html">
  <a class="btn btnAlt btnSave" ng-click="saveFilterCtrl.openDialog($event)">Save</a>
  <div class="filterWidget" click-anywhere-but-here="saveFilterCtrl.closeDialogAndClear()" is-active="saveFilterCtrl.dialog" ng-show="saveFilterCtrl.dialog">
    <form name="saveForm" class="details">
      <div class="rw">
          <label class="lbl" for="searchSaveTxt">Name Saved Search</label>
          <div class="val">
            <input type="text" placeholder="Enter name for saved search" ng-model="saveFilterCtrl.name" name="searchSaveTxt" id="searchSaveTxt" required />
          </div>
      </div>
      <!-- This feature isn't supported for now.
      <div class="alertMe chkWrap">
         <input type="checkbox" ng-model="alertMeChk" id="alertMeChk" class="chk" /><label class="chkLbl" for="alertMeChk">Alerts me when there’s New challenge available for me</label>
      </div>
      -->
      <div class="actn">
      <a class="btn btnCancel btnSecondary" ng-click="saveFilterCtrl.closeDialogAndClear()">Cancel</a><a class="btn btnSaveSearch" ng-click="saveFilterCtrl.saveFilter();">Save My Search</a>
      </div>
    </form>
  </div>     
</script>

<script type="text/ng-template" id="my-filters.html">
  <div class="myFilterWrap" upwards-downwards-adaptive >
    <a class="btnDD btnFilter">My Filters <span class="arrow"></span></a>
    <div class="filterPop dropdown">
        <div class="caption">Your saved searches</div>
        <div class="savedSearchList">
            <h6 ng-if="myFiltersCtrl.filters.length<=0">No saved searches found.</h6>
            <div ng-repeat="filter in myFiltersCtrl.filters |orderBy:'name'" ng-click="myFiltersCtrl.updateFilterOptions(filter)" class="repeated-item savedSearch">
                <div class="name">{{filter.name}}</div>
                <div class="right opts">
                    <!-- This feature isn't supported for now.
                    <span class="lbl">
                      <span class="chkWrap">
                        <input type="checkbox" class="chk" id="altertChk-{{$index}}" ng-model="filter.isAlertsEnabled" />
                        <label class="chkLbl" for="altertChk-{{$index}}">Alerts?</label>
                      </span>
                    </span>
                    -->
                    <a ng-click="myFiltersCtrl.deleteFilter(filter); $event.stopPropagation();" class="btnRemove"></a>
                </div>
                <div class="tags">
                    <div class="tag" ng-if="filter.filterOptions.startDate || filter.filterOptions.endDate">{{myFiltersCtrl.dateRange(filter)}}</div>
                    <div class="tag" ng-repeat="types in filter.filterOptions.challengeTypes">{{types}}</div>
                    <div class="tag" ng-repeat="plat in filter.filterOptions.platforms">{{plat}}</div>
                    <div class="tag" ng-repeat="tech in filter.filterOptions.technologies">{{tech}}</div>
                    <div class="tag" ng-repeat="token in filter.filterOptions.keywords">Text: {{token}}</div>
                    <div class="tag" ng-if="filter.filterOptions.userChallenges">My Challenge Only</div>
                </div>
            </div>
        </div>
        <div ng-hide="myFiltersCtrl.filters.length<=0" class="hr"></div>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/row.html">
  <div class="challengeRow inTCO hasTCOIco track-{{getTrackSymbol(row.getProperty('challengeType'))}}">
    <div ng-style="{ 'cursor': row.cursor }"
         ng-repeat="col in renderedColumns"
         ng-class="col.colIndex()"
         class="ngCell {{col.cellClass}} challengeCell" ng-cell>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/header.html">
  <div class="challengeHeader">
    <div
      ng-style="{ height: col.headerRowHeight }"
      ng-repeat="col in renderedColumns"
      ng-class="col.colIndex()"
      class="ngHeaderCell" ng-header-cell>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/challengeName.html">
  <div class="colCh" ng-if="row.getProperty('challengeCommunity') !== 'data'">
    <div>
      <a ng-href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}" class="contestName">
        <img alt="allContestIco" class="allContestIco" ng-src="{{images}}/ico-track-{{row.getProperty('challengeCommunity')}}.png">
        <span ng-cell-text>{{row.getProperty(col.field)}}</span>
        <img alt="allContestTCOIco" class="allContestTCOIco" ng-src="{{images}}/tco-flag-{{row.getProperty('challengeCommunity')}}.png">
        <span class="track-symbol" qtip title="Challenge Type" text="{{row.getProperty('challengeType')}}" community="{{row.getProperty('challengeCommunity')}}">
          {{getTrackSymbol(row.getProperty('challengeType')).toUpperCase()}}
        </span>
      </a>
    </div>
    <div id="{{row.getProperty('challengeId')}}" class="technologyTags">
      <ul>
        <li ng-repeat="item in row.getProperty('technologies')"><span class="techTag"><a href="" ng-click="findByTechnology(item)">{{item}}</a></span></li>
        <li ng-repeat="item in row.getProperty('platforms')"><span class="techTag"><a href="" ng-click="findByPlatform(item)">{{item}}</a></span></li>
      </ul>
    </div>
  </div>
  <div class="colCh" ng-if="row.getProperty('challengeCommunity') === 'data'">
    <div>
      <a ng-href="//community.topcoder.com/tc?module=MatchDetails&rd={{row.getProperty('roundId')}}" class="contestName">
        <img alt="allContestIco" class="allContestIco" ng-src="{{images}}/ico-track-{{row.getProperty('challengeCommunity')}}.png">
        <span ng-cell-text>{{row.getProperty('fullName')}}</span>
        <img alt="allContestTCOIco" class="allContestTCOIco" ng-src="{{images}}/tco-flag-{{row.getProperty('challengeCommunity') != 'data'?row.getProperty('challengeCommunity'):'develop'}}.png" ng-show="contest.contestType != 'data'">
      </a>
    </div>
  </div>

</script>

<script type="text/ng-template" id="tableView/challengeType.html">
  <div class="colType {{getTrackSymbol(row.getProperty('challengeType'))}}">
    <i class="ico" challenge-popover-title="Challenge Type" challenge-popover="{{row.getProperty('challengeType')}}" challenge-popover-append-to-body="true">
        <span class="tooltipData">
            <span class="tipT">Challenge Type</span>
            <span class="tipC">{{row.getProperty(col.field)}}</span>
        </span>
    </i>
  </div>
</script>

<script type="text/ng-template" id="tableView/currentPhaseName.html">
  <div ng-cell-text class="colPhase">{{row.getProperty('currentPhaseName')}}</div>
</script>

<script type="text/ng-template" id="tableView/currentPhaseRemainingTime.html">
  <span ng-cell-text ng-bind-html="formatTimeLeft(row.getProperty(col.field) || row.getProperty('timeRemaining'), true, row.getProperty('currentPhaseName'))"></span>
</script>

<script type="text/ng-template" id="tableView/duration.html">
  <span class="colDur">{{getContestDuration(row.getProperty('registrationStartDate'), row.getProperty('submissionEndDate'))}}</span>
</script>

<script type="text/ng-template" id="tableView/isPrivate.html">
  <span class="{{row.getProperty('submissionsViewable')=='true' ? 'colAccessLevel' : 'private'}}" qtip title="Access" text="{{row.getProperty('submissionsViewable')=='true' ? 'Public' : 'Private'}}" community="{{row.getProperty('challengeCommunity')}}"><i></i></span>
</script>

<script type="text/ng-template" id="tableView/numRegistrants.html">
  <span ng-cell-text ng-if="row.getProperty('challengeCommunity') !== 'data'">
    <a href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}#viewRegistrant">{{row.getProperty(col.field)}}</a>
  </span>
  <span ng-cell-text ng-if="row.getProperty('challengeCommunity') === 'data'">
    <a href="//community.topcoder.com/longcontest/?module=ViewStandings&rd={{row.getProperty('roundId')}}">{{row.getProperty(col.field)}}</a>
  </span>
</script>

<script type="text/ng-template" id="tableView/numSubmissions.html">
  <span ng-cell-text>{{row.getProperty(col.field)}}</span>
</script>

<script type="text/ng-template" id="tableView/prizes.html">
  <span ng-cell-text>{{row.getProperty(col.field) | currency}}</span>
</script>

<script type="text/ng-template" id="tableView/roles.html">
    <div ng-cell-text class="colRoles">
      <span class="role" title="{{role}}"  ng-repeat="role in row.getProperty(col.field)">{{role}}</span>
    </div>
</script>

<script type="text/ng-template" id="tableView/status.html">
  <span class="colStat">{{row.getProperty(col.field)}}</span>
</script>

<script type="text/ng-template" id="tableView/technologies.html">
  <div class="colTech" ng-show="row.getProperty(col.field).length > 0 && row.getProperty(col.field)[0] != ''">
    <div ng-repeat="tech in row.getProperty(col.field)">
      <span class="techTag"><a href="" ng-click="findByTechnology(tech)">{{tech}}</a></span>
    </div>
  </div>
  <div class="colTech" ng-hide="row.getProperty(col.field).length > 0 && row.getProperty(col.field)[0] != ''"><span>N/A</span></div>
</script>

<script type="text/ng-template" id="tableView/timeline.html">
  <div class="colTime" ng-if="row.getProperty('challengeCommunity') == 'develop' || row.getProperty('challengeCommunity') == 'design'">
    <div>
      <div class="row">
        <label class="lbl">Start Date</label>
        <div class="val vStartDate">{{dateFormatFilter(row.getProperty('registrationStartDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="row.getProperty('checkpointSubmissionEndDate')">
        <label class="lbl ">Round 1 End</label>
        <div class="val vEndRound">{{dateFormatFilter(row.getProperty('checkpointSubmissionEndDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'past'">
        <label class="lbl">End Date</label>
        <div class="val vEndDate">{{dateFormatFilter(row.getProperty('submissionEndDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active' || contest.listType == 'upcoming'">
        <label class="lbl ">Register By</label>
        <div class="val vEndRound">{{dateFormatFilter(row.getProperty('registrationEndDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active' || contest.listType == 'upcoming'">
        <label class="lbl">Submit By</label>
        <div class="val vEndDate">{{dateFormatFilter(row.getProperty('submissionEndDate'), dateFormat)}}</div>
      </div>
    </div>
  </div>

  <div class="colTime" ng-if="row.getProperty('challengeCommunity') == 'data'">
    <div>
      <div class="row">
        <label class="lbl">Start Date</label>
        <div class="val vStartDate">{{dateFormatFilter(row.getProperty('registrationStartDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'upcoming' && row.getProperty('checkpointSubmissionEndDate')">
        <label class="lbl ">Round 1 End</label>
        <div class="val vEndRound">{{dateFormatFilter(row.getProperty('checkpointSubmissionEndDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType != 'active'">
        <label class="lbl">End Date</label>
        <div class="val vEndDate">{{dateFormatFilter(row.getProperty('submissionEndDate'), dateFormat)}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active'">
        <label class="lbl">Submit by</label>
        <div class="val vEndDate">{{dateFormatFilter(row.getProperty('submissionEndDate'), dateFormat)}}</div>
      </div>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/winners.html">
  <span ng-cell-text><a href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}#winner">View Winners</a></span>
</script>


<?php get_footer(); ?>
