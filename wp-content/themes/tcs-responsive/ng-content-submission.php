<div ng-controller="SubmissionCtrl as subCtrl">
<article ng-if=" challenge.currentStatus !== 'Completed' ">
	<div class="notView2">
	    <p><strong>This challenge has not completed yet, submissions are viewable only for completed challenges.</strong></p>
	</div>
</article>

<article>
    <div class="notView" ng-if=" challenge.currentStatus === 'Completed' && !challenge.submissionsViewable ">
        Private Challenge
        <p>Submissions are not viewable for this challenge</p>
    </div>
</article>

<div id="round2" class="submissionAllView" ng-if=" challenge.currentStatus === 'Completed' && challenge.submissionsViewable" ng-hide="subCtrl.singleViewMode || !subCtrl.submissionPagedItems">
    <h1>ROUND 2 (FINAL) SUBMISSIONS</h1>
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
                $submissionGridViewImg = "http://studio.topcoder.com/studio.jpg?module=DownloadSubmission&sbmid=".$submissionObj->submissionId."&sbt=small&sfi=1";
                $submissionDownloadUrl = "http://studio.topcoder.com/?module=DownloadSubmission&sbmid=".$submissionObj->submissionId;
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


<div id="round1" class="submissionAllView" ng-if=" challenge.currentStatus === 'Completed' && challenge.submissionsViewable" ng-hide="subCtrl.singleViewMode || !subCtrl.checkPointPagedItems">
    <h1>ROUND 1 (CHEKCPOINT) SUBMISSIONS</h1>
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
                $submissionGridViewImg = "http://studio.topcoder.com/studio.jpg?module=DownloadSubmission&sbmid=".$submissionObj->submissionId."&sbt=small&sfi=1";
                $submissionDownloadUrl = "http://studio.topcoder.com/?module=DownloadSubmission&sbmid=".$submissionObj->submissionId;
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

<div class="submissionSingleView studio" ng-show="subCtrl.singleViewMode">

    <!-- The mobile part code-->
    <!--
    <div class="informationViewSlider hide">
        <div class="basicInfo">
            <div class="basicInfoT">
                <span class="meataAction">
                    <span class="metaDate">01.24.2014,16:26WIT</span>
                </span>
                <span class="subNum">#<?php echo $submissionObj->submissionId; ?></span>
            </div>
            <div class="basicInfoB">
                <img src="<?php echo THEME_URL ?>/i/avatar.png" alt="">
                <a href="javascript:;" class="handle coderTextOrange">Handlename</a>
                <span class="country"><?php echo $mockSubmissionData->country; ?></span>
                <div class="clear"></div>
            </div>
        </div>
        <div class="clear"></div>
        <ul>
            <li class="slide">
                <div class="basicInfoAction">
                    <a href="javascript:;" class="viewSubmission"></a><span class="viewNum">Views <?php echo $mockSubmissionData->viewCount;?></span>
                    <a href="javascript:;" class="download">Downloads <?php echo $mockSubmissionData->downloadCount;?></a>
                </div>
            </li>
            <li class="slide">
                <div class="commentInfo">
                    <h6>DECLARATION</h6>
                    <label>Comment:</label>
                    <p><a href="javascript:;"><?php echo $mockSubmissionData->comment;?></a></p>
                </div>
            </li>
            <li class="slide">
               <div class="fontInfo">
                    <label>Fonts:</label>
                <?php
                    if(count($mockSubmissionData->fonts)>0)
                    foreach($mockSubmissionData->fonts as $font) :
                ?>
                    <p><a href="javascript:;"><?php echo $font;?></a></p>
                <?php endforeach;?>
                </div>
                <div class="stockArtInfo">
                    <label>Stock Art:</label>
                <?php
                    if($mockSubmissionData->stockArts!=null)
                    foreach($mockSubmissionData->stockArts as $key=>$stockArt):
                ?>
                <?php
                        if($key==3 && count($mockSubmissionData->stockArts)>3) :
                ?>
                    <a href="javascript:;" class="jsSeeMore seeMoreLink">See More</a>
                    <div class="seeMoreInfo hide">
                <?php endif;?>
                        <p><a href="javascript:;"><?php echo $stockArt;?></a></p>
                <?php
                    endforeach;
                ?>
                <?php if(count($mockSubmissionData->stockArts)>3) :?>
                    </div>
                <?php endif;?>
                </div>
            </li>
        </ul>
    </div>
    -->
    <!-- /.informationViewSlider -->

    <div class="informationView">
        <div class="basicInfo">
            <span class="meataAction">
                <span class="metaDate" ng-bind="subCtrl.singleViewSubmission.formattedDate"></span>
                <a href="javascript:;" class="viewSubmission" ng-bind="'Views ' + subCtrl.singleViewSubmission.viewCounter"></a>
                <a ng-href="{{subCtrl.singleViewSubmission.downloadUrl}}" class="download" ng-bind="'Downloads ' + subCtrl.singleViewSubmission.downloadCounter"></a>
                <a href="javascript:;" class="back btn btnAlt" ng-click="subCtrl.singleViewMode = false" >Back</a>
            </span>
            <span class="subNum" ng-bind=" '#' + subCtrl.singleViewSubmission.submissionId"></span>
            <a ng-href="/member-profile/{{subCtrl.singleViewSubmission.submitter}}/design" class="handle coderTextOrange" ng-bind="subCtrl.singleViewSubmission.submitter"></a>
        </div>
        <!-- /.basicInfo -->
        <div class="furtherInfo">
            <h6>DECLARATION</h6>
            <div class="commentInfo">
                <label>Comment:</label>
                <p><a href="javascript:;" ng-bind="subCtrl.submissionInfo.comment"></a></p>
            </div>
            <!-- /.furtherInfo -->
            <div class="fontInfo">
                <label>Fonts:</label>
                    <p ng-repeat="font in subCtrl.submissionInfo.fonts"><a href="javascript:;" ng-bind="font.name"></a></p>
            </div>
            <!-- /.fontInfo -->
            <div class="stockArtInfo">
                <label>Stock Art:</label>
                 <p ng-repeat="stockArt in subCtrl.submissionInfo.stockArts | limitTo : subCtrl.stockArtThreshold"><a href="javascript:;" ng-bind="stockArt.link"></a></p>
                 <!-- remove the jsSeeMore class so we won't use old jquery code. -->
                 <a href="javascript:;" class="seeMoreLink" ng-if="subCtrl.submissionInfo.stockArts.length > 3" ng-click="subCtrl.stockArtThreshold = subCtrl.submissionInfo.stockArts.length" ng-hide="subCtrl.stockArtThreshold === subCtrl.submissionInfo.stockArts.length">See More</a>
                 <a href="javascript:;" class="seeLessLink" ng-if="subCtrl.submissionInfo.stockArts.length > 3" ng-click="subCtrl.stockArtThreshold = 3" ng-show="subCtrl.stockArtThreshold === subCtrl.submissionInfo.stockArts.length">See Less</a>
            </div>
            <!-- /.stockArtInfo -->
            <div class="clear"></div>
        </div>
        <!-- /.furtherInfo -->
    </div>
    <!-- /.informationView -->

    <!-- The mobile part code-->
    <!--
    <div class="submissionSingleSlider hide">
        <ul>
            <li class="slide">
            <?php
                if($mockSubmissionData->submissionThumbs!=null)
                foreach($mockSubmissionData->submissionThumbs as $key=>$submissionThumb):
            ?>
                    <div>
                        <a href="javascript:;" class="jsFullScreenBtn"><img src="<?php echo $submissionThumb; ?>" alt=""></a>
                    </div>
                <?php
                    if(($key+1)%2==0 && $key>0 ) {
                        echo "</li>";
                        if(($key+1)<count($mockSubmissionData->submissionThumbs))
                            echo '<li class="slide">';
                    }
                ?>
            <?php
                endforeach;
            ?>
            <?php if(count($mockSubmissionData->submissionThumbs)%2!=0) : ?>
                </li>
            <?php endif;?>
        </ul>
    </div>
    -->
    <!-- /.submissionSingleSlider -->

    <div class="clear"></div>

    <div class="submissionShowcase">
        <div class="scrollPane" tc-scroll-pane>
        <ul class="submissionShowcaseList">
            <li ng-repeat="link in subCtrl.singleViewSubmission.previewList"><a href="javascript:;" ng-class="{'active' : $index === subCtrl.selectedPreview}" ng-click="subCtrl.selectPreview($index)"><img ng-src="{{link}}" alt="" style=" width : 191px; height : 154px; "/></a></li>
        </ul>
        </div>
        <div class="submissionBig">
            <img ng-repeat="link in subCtrl.singleViewSubmission.fullPreviewList" ng-src="{{link}}" alt="" style=" width : 738px; height : 592px; " ng-show="$index === subCtrl.selectedPreview"/>
            <p><a href="javascript:;" class="btn btnAlt fullScreenBtn" tc-full-screen>FULL SCREEN</a></p>
        </div>
        <div class="clear"></div>
    </div>
    <!-- /.submissionShowcase -->
</div>
<!-- /.submissionSingleView -->
</div>