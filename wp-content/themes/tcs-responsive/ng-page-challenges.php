<?php
/**
 * Template Name: Challenges Active Contest List Page - Angular
 */

/**
 * @file
 * This template shows a list of challenges
 */

function add_base_url() {
  $output = "<base href=\"" . get_option("siteurl") . "/" . ACTIVE_CONTESTS_PERMALINK . "/\" />";
  echo $output;
}

add_action('wp_head', 'add_base_url');

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

  <div data-ng-app="tc" class="content">
  <div id="main">
      <div ng-view>
        <div id="hero">
          <div class="container grid grid-float">
            <div class="grid-3-1 track trackUX" ng-class="{isActive: contest.contestType == 'design'}">
              <a href="/challenges/design/{{contest.listType}}/"><i></i>Graphic Design Challenges
              </a><span class="arrow"></span>
            </div>
            <div class="grid-3-1 track trackSD" ng-class="{isActive: contest.contestType == 'develop'}">
              <a href="/challenges/develop/{{contest.listType}}/"><i></i>Software Development Challenges
              </a><span class="arrow"></span>
            </div>
            <div class="grid-3-1 track trackAn" ng-class="{isActive: contest.contestType == 'data'}">
              <a href="/challenges/data/{{contest.listType}}/">
                <i></i>Data Science Challenges
              </a><span class="arrow"></span>
            </div>
          </div>
        </div>
      </div>


  <script type="text/ng-template" id="challenge-list.html">

    <div id="hero">
      <div class="container grid grid-float">
        <div class="grid-3-1 track trackUX" ng-class="{isActive: contest.contestType == 'design'}">
          <a href="/challenges/design/{{contest.listType}}/"><i></i>Graphic Design Challenges
          </a><span class="arrow"></span>
        </div>
        <div class="grid-3-1 track trackSD" ng-class="{isActive: contest.contestType == 'develop'}">
          <a href="/challenges/develop/{{contest.listType}}/"><i></i>Software Development Challenges
          </a><span class="arrow"></span>
        </div>
        <div class="grid-3-1 track trackAn" ng-class="{isActive: contest.contestType == 'data'}">
          <a href="/challenges/data/{{contest.listType}}/">
            <i></i>Data Science Challenges
          </a><span class="arrow"></span>
        </div>
      </div>
    </div>

    <article id="mainContent" class="layChallenges">
      <div class="container">
        <header>
          <h1>
            {{titles[contest.contestType]}}
            <span class="subscribeTopWrapper">
              <a class="feedBtn" target="_self" href="/challenges/feed?list=active&contestType={{contest.contestType || 'all'}}" title="Subscribe to challenges"></a>
            </span>
          </h1>
          <aside class="rt" ng-show="contest.listType !== 'past' && contest.contestType !== 'data'">
            <span class="views">
              <a href="" ng-click="view = 'grid'" class="gridView" ng-class="{isActive: view == 'grid'}"></a>
              <a href="" ng-click="view = 'table'" class="listView" ng-class="{isActive: view == 'table'}"></a>
            </span>
          </aside>
        </header>

        <div data-tc-challenges-actions contest="contest" show-filters="showFilters" ng-show="contest.contestType && contest.contestType != ''"></div>

        <div  advanced-search
              apply-filter="searchSubmit"
              technologies="technologies"
              platforms="platforms"
              challenge-community="contest.contestType"
              show-on="showFilters"
              filter="filter"></div>

        <div class="upcomingCaption" ng-show="contest.listType === 'upcoming'">All upcoming challenges may change</div>
        <div ng-show="challenges.length > 0">
          <div id="tableView" class="viewTab" ng-show="view == 'table'">
            <div class="tableWrap tcoTableWRap dataTable tcoTable challengesGrid" ng-grid="gridOptions"></div>
          </div>
        </div>
        <div id="gridView2" class="viewTab hide" style="display: block;" ng-show="view == 'grid'" ng-class="{contestAll: contest.contestType == ''}">
          <div class="alt" id="gridAll" ng-class="{contestGrid: true}">
            <div tc-contest-grid-react></div>
          </div>
        </div>
        <div class="dataChanges">
          <div class="lt">
            <a class="viewAll" ng-show="challenges.length < allChallenges.length" ng-click="currentPageSize = allChallenges.length; challenges = setPagingData(allChallenges, page, currentPageSize);">View All</a>
          </div>
          <div id="challengeNav" class="rt">
            <a class="prevLink" ng-show="page > 1" ng-click="page = page - 1">
              <i></i> Prev
            </a>
            <a class="nextLink" ng-show="totalServerItems > page * currentPageSize" ng-click="page = page + 1">
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
        <div style="font-size:20px;display: none;" ng-show="!challenges.length && !loading">There are no active challenges under this category. Please check back later</div>
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
        <!-- Coming soon!  <li><a href="http://www.topcoder.com/review-opportunities/develop/" class="link">Review Opportunities</a></li> -->
      </ul>
    </div>
    <div class="rt">
      <a href="javascript:;" class="searchLink advSearch" ng-show="contest.contestType != ''" ng-click="showFilters = !showFilters">
        <i></i>Advanced Search
      </a>
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
    <div class="searchFilter hide">
    <div class="filterOpts">
      <section class="types" ng-if="challengeCommunity !== 'data'">
        <h5>Contest types:</h5>
        <div class="data">
          <ul class="list">
            <li ng-repeat="type in contestTypes">
              <input type="radio" id="f{{type}}" name="radioFilterChallenge" ng-class="{all: type === 'All'}" value="{{type}}" ng-model="filterOptions.challengeType">
              <label for="f{{type}}"><strong>{{type}}</strong>
        </label>
        </li>
        </ul>
        </div>
        </section>
      <section class="otherOpts">
        <ul>
          <li class="date row">
            <div class="lbl">
              <input type="checkbox" id="fSDate" ng-model="chbFrom" />
              <label for="fSDate"><strong>Submission End From:</strong>
        </label>
        </div>
            <div class="val">
              <span class="datePickerWrap">
                <input ng-disabled="!chbFrom" id="startDate" type="text" class="datepicker from" calendar-icon="<?php  echo get_stylesheet_directory_uri(); ?>/i/ico-cal.png" value="{{filterOptions.startDate | date: 'yyyy-MM-dd'}}" />
        </span>
        </div>
        </li>
          <li class="date row">
            <div class="lbl">
              <input type="checkbox" id="fEDate" ng-model="chbTo" />
              <label ng-disabled="!chbTo" for="fEDate"><strong>Submission End To:</strong>
        </label>
        </div>

            <div class="val">
              <span class="datePickerWrap">
                <input id="endDate"  type="text" class="datepicker to" calendar-icon="<?php  echo get_stylesheet_directory_uri(); ?>/i/ico-cal.png" value="{{filterOptions.endDate | date: 'yyyy-MM-dd'}}"/>
        </span>
        </div>
        </li>
        </ul>
        </section>
      <section class="tags" ng-if="challengeCommunity === 'develop' && (technologies.length > 0 || platforms.length > 0)">
        <h5>Technology and Platforms:</h5>
        <div class="data">
          <select ui-select2="{allowClear:true, multiple: true}" data-placeholder="" class="chosen-select hasCustomSelect"  ng-model="filterOptions.tags" multiple>
            <optgroup label="Platforms">
              <option ng-repeat="plat in platforms track by $index" value="plat.{{plat}}">{{plat}}</option>
        </optgroup>
            <optgroup label="Technologies">
              <option ng-repeat="tech in technologies track by $index" value="tech.{{tech}}">{{tech}}</option>
        </optgroup>
        </select>
        </div>
        </section>
      <div class="clear"></div>
        </div>
    <!-- /.filterOpts -->
    <div class="actions">
      <a ng-click="closeForm()" class="btn btnSecondary btnClose">Close</a>
      <a ng-click="applyFilter()" class="btn btnApply">Apply</a>
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

<script type="text/ng-template" id="tableView/challengeDataName.html">
  <div class="colCh">
    <div>
      <a ng-href="http://community.topcoder.com/longcontest/?module=ViewProblemStatement&rd={{row.getProperty('roundId')}}&pm={{row.getProperty('problemId')}}" class="contestName">
        <img alt="allContestIco" class="allContestIco" ng-src="{{images}}/ico-track-{{row.getProperty('challengeCommunity')}}.png">
        <span ng-cell-text>{{row.getProperty('fullName')}}</span>
        <img alt="allContestTCOIco" class="allContestTCOIco" ng-src="{{images}}/tco-flag-{{row.getProperty('challengeCommunity') != 'data'?row.getProperty('challengeCommunity'):'develop'}}.png" ng-show="contest.contestType != 'data'">
      </a>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/challengeName.html">
  <div class="colCh" ng-if="row.getProperty('challengeCommunity') !== 'data'">
    <div>
      <a ng-href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}" class="contestName">
        <img alt="allContestIco" class="allContestIco" ng-src="{{images}}/ico-track-{{row.getProperty('challengeCommunity')}}.png">
        <span ng-cell-text>{{row.getProperty(col.field)}}</span>
        <img alt="allContestTCOIco" class="allContestTCOIco" ng-src="{{images}}/tco-flag-{{row.getProperty('challengeCommunity') != 'data'?row.getProperty('challengeCommunity'):'develop'}}.png" ng-if="contest.contestType != 'data'">
      </a>
    </div>
    <div id="{{row.getProperty('challengeId')}}" class="technologyTags">
      <ul>
        <li ng-repeat="item in row.getProperty('technologies')"><span class="techTag"><a href="" ng-click="findByTechnology(item)">{{item}}</a></span></li>
        <li ng-repeat="item in row.getProperty('platforms')"><span class="techTag"><a href="" ng-click="findByPlatform(item)">{{item}}</a></span></li>
      </ul>
    </div>
  </div>

</script>

<script type="text/ng-template" id="tableView/challengeType.html">
  <div class="colType {{getTrackSymbol(row.getProperty('challengeType'))}}">
    <i class="ico" challenge-popover-title="Contest Type" challenge-popover="{{row.getProperty('challengeType')}}" challenge-popover-append-to-body="true">
        <span class="tooltipData">
            <span class="tipT">Contest Type</span>
            <span class="tipC">{{row.getProperty(col.field)}}</span>
        </span>
    </i>
  </div>
</script>

<script type="text/ng-template" id="tableView/currentPhaseName.html">
  <div ng-cell-text class="colPhase">{{getPhaseName(contest, row.getProperty('registrationOpen  '))}}</div>
</script>

<script type="text/ng-template" id="tableView/currentPhaseRemainingTime.html">
  <span ng-cell-text ng-bind-html="formatTimeLeft(row.getProperty(col.field), true)"></span>
</script>

<script type="text/ng-template" id="tableView/dataNumRegistrants.html">
  <span ng-cell-text><a href="http://community.topcoder.com/longcontest/?module=ViewStandings&rd={{row.getProperty('roundId')}}">{{row.getProperty(col.field)}}</a></span>
</script>

<script type="text/ng-template" id="tableView/duration.html">
  <div class="colDur">{{getContestDuration(row.getProperty('registrationStartDate'), row.getProperty('submissionEndDate'))}}</div>
</script>

<script type="text/ng-template" id="tableView/isPrivate.html">
  <span class="{{row.getProperty('submissionsViewable')=='true' ? 'colAccessLevel' : 'private'}}"><i></i></span>
</script>

<script type="text/ng-template" id="tableView/numRegistrants.html">
  <span ng-cell-text><a href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}#viewRegistrant">{{row.getProperty(col.field)}}</a></span>
</script>

<script type="text/ng-template" id="tableView/numSubmissions.html">
  <span ng-cell-text>{{row.getProperty(col.field)}}</span>
</script>

<script type="text/ng-template" id="tableView/prizes.html">
  <span ng-cell-text>{{row.getProperty(col.field) | currency}}</span>
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
  <div class="colTime" ng-if="row.getProperty('challengeCommunity') == 'develop'">
    <div>
      <div class="row">
        <label class="lbl">Start Date</label>
        <div class="val vStartDate">{{row.getProperty('registrationStartDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'upcoming' && row.getProperty('checkpointSubmissionEndDate')">
        <label class="lbl ">Round 1 End</label>
        <div class="val vEndRound">{{row.getProperty('checkpointSubmissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType != 'active'">
        <label class="lbl">End Date</label>
        <div class="val vEndDate">{{row.getProperty('submissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active'">
        <label class="lbl ">Register by</label>
        <div class="val vEndRound">{{row.getProperty('registrationEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active'">
        <label class="lbl">Submit by</label>
        <div class="val vEndDate">{{row.getProperty('submissionEndDate') | date: dateFormat}}</div>
      </div>
    </div>
  </div>

  <div class="colTime" ng-if="row.getProperty('challengeCommunity') == 'design'">
    <div>
      <div class="row">
        <label class="lbl">Start Date</label>
        <div class="val vStartDate">{{row.getProperty('registrationStartDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="row.getProperty('checkpointSubmissionEndDate')">
        <label class="lbl ">Round 1 End</label>
        <div class="val vEndRound">{{row.getProperty('checkpointSubmissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType != 'active'">
        <label class="lbl">End Date</label>
        <div class="val vEndDate">{{row.getProperty('submissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active'">
        <label class="lbl ">End Date</label>
        <div class="val vEndRound">{{row.getProperty('registrationEndDate') | date: dateFormat}}</div>
      </div>
    </div>
  </div>

  <div class="colTime" ng-if="row.getProperty('challengeCommunity') == 'data'">
    <div>
      <div class="row">
        <label class="lbl">Start Date</label>
        <div class="val vStartDate">{{row.getProperty('registrationStartDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'upcoming' && row.getProperty('checkpointSubmissionEndDate')">
        <label class="lbl ">Round 1 End</label>
        <div class="val vEndRound">{{row.getProperty('checkpointSubmissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType != 'active'">
        <label class="lbl">End Date</label>
        <div class="val vEndDate">{{row.getProperty('submissionEndDate') | date: dateFormat}}</div>
      </div>
      <div class="row" ng-show="contest.listType == 'active'">
        <label class="lbl">Submit by</label>
        <div class="val vEndDate">{{row.getProperty('submissionEndDate') | date: dateFormat}}</div>
      </div>
    </div>
  </div>
</script>

<script type="text/ng-template" id="tableView/winners.html">
  <span ng-cell-text><a href="/challenge-details/{{row.getProperty('challengeId')}}/?type={{row.getProperty('challengeCommunity')}}#viewRegistrant">{{row.getProperty(col.field)}}</a></span>
</script>

<?php get_footer(); ?>
