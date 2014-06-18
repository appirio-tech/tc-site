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
  <div id="main" data-ng-controller="ChallengeListingCtrl">
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
              <a class="feedBtn" href="/challenges/feed?list=active&contestType={{contest.contestType}}" title="Subscribe to challenges"></a>
            </span>
          </h1>
          <aside class="rt" ng-show="contest.listType !== 'past'">
            <span class="views">
              <a href="" ng-click="view = 'grid'" class="gridView" ng-class="{isActive: view == 'grid'}"></a>
              <a href="" ng-click="view = 'table'" class="listView" ng-class="{isActive: view == 'table'}"></a>
            </span>
          </aside>
        </header>

        <div data-tc-challenges-actions contest="contest" search="search" ng-show="contest.contestType && contest.contestType != ''"></div>

        <div class="searchFilter hide" tc-challenges-search ng-show="search.show" on-submit="submit" contest="contest" search="search" style="display: block;"></div>

        <div class="upcomingCaption" ng-show="contest.listType === 'upcoming'">All upcoming challenges may change</div>
        <div ng-show="challenges.length > 0">
          <div id="tableView" class="viewTab" ng-show="view == 'table'">
            <div class="tableWrap tcoTableWRap dataTable tcoTable challengesGrid" ng-grid="gridOptions"></div>
          </div>
        </div>
        <div id="gridView2" class="viewTab hide" style="display: block;" ng-if="contest.listType != 'past'" ng-show="view == 'grid'" ng-class="{contestAll: contest.contestType == ''}">
          <div class="alt" id="gridAll" ng-class="{contestGrid: true}">
            <div ng-repeat="challenge in challenges" tc-contest-grid challenge="challenge"></div>
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
            <a href="#" class="viewActiveCh">
              View Active Challenges<i></i>
            </a>
            <a href="#" class="viewPastCh">
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
<?php get_footer(); ?>