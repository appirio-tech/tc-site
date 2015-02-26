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
                <span ng-bind="'Views ' + subCtrl.singleViewSubmission.viewCounter"></span>&nbsp;&nbsp;
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
