<div ng-controller="SubmissionCtrl as subCtrl">
<article ng-if="CD.challenge.currentStatus !== 'Completed' ">
	<div class="notView2">
	    <p><strong>This challenge has not completed yet, submissions are viewable only for completed challenges.</strong></p>
	</div>
</article>

<article>
    <div class="notView" ng-if="CD.challenge.currentStatus === 'Completed' && !CD.challenge.submissionsViewable ">
        Private Challenge
        <p>Submissions are not viewable for this challenge</p>
    </div>
</article>

<div id="round2" class="submissionAllView" ng-if=" CD.challenge.currentStatus === 'Completed' && CD.challenge.submissionsViewable" ng-hide="subCtrl.singleViewMode || !subCtrl.submissionPagedItems">
    <h1 class="center">ROUND 2 (FINAL) SUBMISSIONS</h1>
    <ul class="submissionList">
		<span ng-repeat="singlePage in subCtrl.submissionPagedItems" class="submissionPage" ng-show="subCtrl.submissionCurrentPage === $index || subCtrl.submissionViewAll">
            <li ng-repeat="item in singlePage">
                <div>
                    <a href="javascript:;" ng-click="subCtrl.viewSubmission(item)"><img ng-src="{{item.gridViewImg}}" alt="" width="225" height="226"></a>
                    <p>
                        <span class="subNum" ng-bind=" '#' + item.submissionId"></span>
                        <a ng-href="/member-profile/{{item.submitter}}/design" class="handle coderTextOrange" ng-bind="item.submitter"></a>
                    </p>
                    <p class="submissionInfo">
                        <span class="metaDate" ng-bind="item.formattedDate"></span>

                        <span class="viewSubmission"><a href="javascript:;" ng-bind="item.viewCounter" ng-click="subCtrl.viewSubmission(item)"></a></span>
                        <span class="download"><a ng-href="{{item.downloadUrl}}" ng-bind="item.downloadCounter"></a></span>
                    </p>
                </div>
            </li>
        </span>
    </ul>
    <!-- The mobile part code-->
    <!--
    <div class="submissionSlider hide">
        <ul>
        <?php
            if( $contestResults!=null )
            foreach( $contestResults as $key=>$submissionObj ) :
                $dateStr = substr($submissionObj->submissionDate, 0, 10)." ".substr($submissionObj->submissionDate, 11, 5);
                //dateStr format : 2014-04-02 07:10
                $dateObj = DateTime::createFromFormat('Y-m-d H:i', $dateStr);
                $dateFormatted = $dateObj!=null ? $dateObj->format('d.m.Y , H:i') : "";
                $submissionGridViewImg = "//studio.topcoder.com/studio.jpg?module=DownloadSubmission&sbmid=".$submissionObj->submissionId."&sbt=small&sfi=1";
                $submissionDownloadUrl = "//studio.topcoder.com/?module=DownloadSubmission&sbmid=".$submissionObj->submissionId;
        ?>
        <?php if($key==0) : ?>
            <li class="slide">
        <?php endif;?>
                <div>
                    <a href="javascript:;" class="jsViewSubmission"><img src="<?php echo $submissionGridViewImg; ?>" alt=""></a>

                    <p>
                        <span class="subNum">#<?php echo $submissionObj->submissionId; ?></span>
                        <a href="javascript:;" class="handle coderTextOrange"><?php echo $submissionObj->submitter;?></a></p>
                    <p class="submissionInfo">
                        <span class="metaDate"><?php echo $dateFormatted;?></span>

                        <span class="viewSubmission jsViewSubmission"><a href="javascript:;"></a><?php echo $mockSubmissionData->viewCount;?></span>
                        <span class="download"><a href="<?php echo $submissionDownloadUrl;?>"><?php echo $mockSubmissionData->downloadCount;?></a></span>
                    </p>
                </div>
        <?php
            if(($key+1)%3==0 && $key>0 ) {
                echo "</li>";
                if(($key+1)<count($contestResults))
                    echo '<li class="slide">';
            }
        ?>
        <?php endforeach; ?>
        <?php
            if(count($contestResults)%3!=0) echo "</li>";
        ?>
        </ul>
    </div>
    -->
    <div class="clear"></div>

    <div id="submissionPaging" class="pager" ng-show="subCtrl.submissionPagedItems.length > 1 && !subCtrl.submissionViewAll">
        <div class="lt">
            <a href="javascript:;" class="viewAll" ng-click="subCtrl.submissionViewAll = true" tc-scroll-to-top="round2">View All</a>
        </div>
        <div class="rt">
            <a href="javascript:;" class="prevLink" ng-show="subCtrl.submissionCurrentPage > 0" ng-click="subCtrl.submissionCurrentPage = subCtrl.submissionCurrentPage - 1">
                <i></i> Prev
            </a>
            <a href="javascript:;" class="nextLink" ng-show="subCtrl.submissionCurrentPage < subCtrl.submissionPagedItems.length - 1" ng-click="subCtrl.submissionCurrentPage = subCtrl.submissionCurrentPage + 1">
                Next <i></i>
            </a>
        </div>
    </div>

</div>
<!-- Submission Section End -->


<div id="round1" class="submissionAllView" ng-if=" CD.challenge.currentStatus === 'Completed' && CD.challenge.submissionsViewable" ng-hide="subCtrl.singleViewMode || !subCtrl.checkPointPagedItems">
    <h1 class="center">ROUND 1 (CHECKPOINT) SUBMISSIONS</h1>
    <ul class="submissionList">
        <span ng-repeat="singlePage in subCtrl.checkPointPagedItems" class="submissionPage" ng-show="subCtrl.checkPointCurrentPage === $index || subCtrl.checkPointViewAll">
            <li ng-repeat="item in singlePage">
                <div>
                    <a href="javascript:;" ng-click="subCtrl.viewSubmission(item)"><img ng-src="{{item.gridViewImg}}" alt="" width="225" height="226"></a>
                    <p>
                        <span class="subNum" ng-bind=" '#' + item.submissionId"></span>
                        <a ng-href="/member-profile/{{item.submitter}}/design" class="handle coderTextOrange" ng-bind="item.submitter"></a>
                    </p>
                    <p class="submissionInfo">
                        <span class="metaDate" ng-bind="item.formattedDate"></span>

                        <span class="viewSubmission"><a href="javascript:;" ng-bind="item.viewCounter" ng-click="subCtrl.viewSubmission(item)"></a></span>
                        <span class="download"><a ng-href="{{item.downloadUrl}}" ng-bind="item.downloadCounter"></a></span>
                    </p>
                </div>
            </li>
        </span>
    </ul>

    <!-- The mobile part-->
    <!--
    <div class="submissionSlider hide">
        <ul>
        <?php
            if( $contestResults!=null )
            foreach( $contestResults as $key=>$submissionObj ) :
                $dateStr = substr($submissionObj->submissionDate, 0, 10)." ".substr($submissionObj->submissionDate, 11, 5);
                //dateStr format : 2014-04-02 07:10
                $dateObj = DateTime::createFromFormat('Y-m-d H:i', $dateStr);
                $dateFormatted = $dateObj!=null ? $dateObj->format('d.m.Y , H:i') : "";
                $submissionGridViewImg = "//studio.topcoder.com/studio.jpg?module=DownloadSubmission&sbmid=".$submissionObj->submissionId."&sbt=small&sfi=1";
                $submissionDownloadUrl = "//studio.topcoder.com/?module=DownloadSubmission&sbmid=".$submissionObj->submissionId;
        ?>
        <?php if($key==0) : ?>
            <li class="slide">
        <?php endif;?>
                <div>
                    <a href="javascript:;" class="jsViewSubmission"><img src="<?php echo $submissionGridViewImg; ?>" alt=""></a>

                    <p>
                        <span class="subNum">#<?php echo $submissionObj->submissionId; ?></span>
                        <a href="javascript:;" class="handle coderTextOrange"><?php echo $submissionObj->submitter;?></a></p>
                    <p class="submissionInfo">
                        <span class="metaDate"><?php echo $dateFormatted;?></span>

                        <span class="viewSubmission jsViewSubmission"><a href="javascript:;"></a><?php echo $mockSubmissionData->viewCount;?></span>
                        <span class="download"><a href="<?php echo $submissionDownloadUrl;?>"><?php echo $mockSubmissionData->downloadCount;?></a></span>
                    </p>
                </div>
        <?php
            if(($key+1)%3==0 && $key>0 ) {
                echo "</li>";
                if(($key+1)<count($contestResults))
                    echo '<li class="slide">';
            }
        ?>
        <?php endforeach; ?>
        <?php
            if(count($contestResults)%3!=0) echo "</li>";
        ?>
        </ul>
    </div>
    -->

    <div class="clear"></div>

    <div id="submissionPaging" class="pager" ng-show="subCtrl.checkPointPagedItems.length > 1 && !subCtrl.checkPointViewAll">
        <div class="lt">
            <a href="javascript:;" class="viewAll" ng-click="subCtrl.checkPointViewAll = true" tc-scroll-to-top="round1">View All</a>
        </div>
        <div class="rt">
            <a href="javascript:;" class="prevLink" ng-show="subCtrl.checkPointCurrentPage > 0" ng-click="subCtrl.checkPointCurrentPage = subCtrl.checkPointCurrentPage - 1">
                <i></i> Prev
            </a>
            <a href="javascript:;" class="nextLink" ng-show="subCtrl.checkPointCurrentPage < subCtrl.checkPointPagedItems.length - 1" ng-click="subCtrl.checkPointCurrentPage = subCtrl.checkPointCurrentPage + 1">
                Next <i></i>
            </a>
        </div>
    </div>

</div>
<!-- Checkpoint Section End -->

<?php include( locate_template('ng-content-submission-single-view.php') ); ?>

</div>