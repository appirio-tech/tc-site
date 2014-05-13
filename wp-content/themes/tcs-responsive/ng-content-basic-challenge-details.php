<div class="container">
<header class="pageHeading aboutPage">
  <h1>{{challenge.challengeName}}</h1>

  <h2>CHALLENGE TYPE: <span>{{challenge.challengeType}}</span></h2>
</header>

<div id="stepBox">
<div class="container">

<div class="leftColumn">
    <a ng-if="!isDesign" class="btn btnAction challengeRegisterBtn {{challenge.registerDisabled ? 'disabled' : ''}}" href="javascript:;"><span>1</span>
      <strong>Register For This Challenge</strong></a>
    <a ng-if="!isDesign" class="btn btnAction {{challenge.submitDisabled ? 'disabled' : ''}}" target="_blank"
       href="<?php bloginfo("siteurl"); ?>/challenge-details/{{challenge.challengeId}}/submit"><span>2</span>      <strong>Submit Your Entries</strong></a>
    <a ng-if="isDesign" class="btn btnAction challengeRegisterBtn {{challenge.registerDisabled ? 'disabled' : ''}}" href="javascript:;"><span>1</span> <strong>Register
        For This Challenge</strong></a>
    <a ng-if="isDesign" class="btn btnAction {{challenge.submitDisabled ? 'disabled' : ''}}" target="_blank"
       href="http://studio.topcoder.com/?module=ViewRegistration&ct={{challenge.challengeId}}"><span>2</span> <strong>Submit
        Your Entries</strong></a>
    <a ng-if="isDesign" class="btn btnAction" target="_blank"
       href="http://studio.topcoder.com/?module=ViewSubmission&ct={{challenge.challengeId}}"><span>3</span> <strong>View
        Your Submission</strong></a>
</div>
<div class="middleColumn {{isDesign ? 'studio' : ''}}">
<table class="prizeTable">
<tbody>

<tr>
    <td ng-if="!isDesign && challenge.challengeType != 'Code'" class="fifty">
      <h2>1st PLACE</h2>

      <h3>
        <small>$</small>{{challenge.prize ? (challenge.prize[0] ? challenge.prize[0] : '') : ''}}
      </h3>
    </td>
    <td ng-if="!isDesign && challenge.challengeType != 'Code'" class="fifty">
      <h2>2nd PLACE</h2>
      <h3>
        <small>$</small>{{challenge.prize ? (challenge.prize[1] ? challenge.prize[1] : '0') : ''}}
      </h3>
    </td>
      <td ng-if="(designOrCode = isDesign || challenge.challengeType == 'Code') && (challenge.prize && challenge.prize[0])" class="twenty">
        <h2>1st PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[0]}}</h3>
      </td>
      <td ng-if="designOrCode && !(challenge.prize && challenge.prize[0])" class="twenty noPrize">
        <h2>1st PLACE</h2>

        <h3>
          <small>$</small>0</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize[1])" class="twenty">
        <h2>2nd PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[1]}}</h3>
      </td>
      <td ng-if="designOrCode && !(challenge.prize && challenge.prize[1])" class="twenty noPrize">
        <h2>2nd PLACE</h2>

        <h3>
          <small>$</small>0</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize[2])" class="twenty">
        <h2>3rd PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[2]}}</h3>
      </td>
      <td ng-if="designOrCode && !(challenge.prize && challenge.prize[2])" class="twenty noPrize">
        <h2>3rd PLACE</h2>

        <h3>
          <small>$</small>0</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize[3])" class="twenty">
        <h2>4th PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[3]}}</h3>
      </td>
      <td ng-if="designOrCode && !(challenge.prize && challenge.prize[3])" class="twenty noPrize">
        <h2>4th PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[3]}}</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize[4])" class="twenty">
        <h2>5th PLACE</h2>

        <h3>
          <small>$</small>{{challenge.prize[4]}}</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize[5])" class="twenty noPrize">
        <h2>5th PLACE</h2>

        <h3>
          <small>$</small>0</h3>
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize.length > 5)" class="morePayments active closed" rowspan="{{2 + ((challenge.prize.length - 5) / 5)}}">
      </td>
      <td ng-if="designOrCode && (challenge.prize && challenge.prize.length <= 5)" class="morePayments inactive" rowspan="{{2 + ((challenge.prize.length - 5) / 5)}}">
      </td>
</tr>
<tr ng-if="challenge.prize  && challenge.prize.length > 5 && (currentPlace = 6)" class="additionalPrizes hide" ng-repeat="i in range(0, (challenge.prize.length - 5) / 5)">
  <td class="twenty" ng-if="challenge.prize.length > 5 + i * 5" ng-repeat="j in range(i * 5, max((i + 1) * 5), challenge.prize.length)">
    <h2>{{j + 1}}th PLACE</h2>
    <h3><small>$</small>{{challenge.prize[j]}}</h3>
  </td>
</tr>
<tr>
    <td ng-if="!isDesign" colspan="{{challenge.challengeType == 'Code' ? '2' : ''">
      <p class="realibilityPara">
        Reliability Bonus
        <span ng-if="reliabilityBonus && reliabilityBonus.length > 0">
          {{challenge.reliabilityBonus}}
        </span>
        <span ng-if="!(reliabilityBonus && reliabilityBonus.length > 0)">
          N/A
        </span>
      </p>
    </td>
    <td ng-if="!isDesign" colspan="challenge.challengeType = 'Code' ? '3' : ''">
      <p class="drPointsPara">DR Points <span>{{challenge.digitalRunPoints ? challenge.digitalRunPoints : 'N/A'}}</span></p>
    </td>
    </td>
    <td ng-if="isDesign" colspan="2">
        <p class="scPoints"><span>{{challenge.digitalRunPoints ? challenge.digitalRunPoints : 'NO'}}</span> STUDIO CUP POINTS</p>
    </td>
    <td ng-if="isDesign" colspan="3">
      <p class="scPoints"><span>{{challenge.numberOfCheckpointsPrizes}}</span> CHECKPOINT AWARDS WORTH <span>${{challenge.topCheckPointPrize}}</span>
        EACH</p>
    </td>
</tr>
</tbody>
</table>
<!-- TODO: not sure why this code is repeated -- probably get rid of it -->
<div class="prizeSlider hide">
  <ul>
    <li class="slide">
      <table>
        <tbody>
        <tr>
          <?php
          if (isset($contest->prize[0])):
            ?>
            <td class="twenty">
              <h2>1st PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format($contest->prize[0]); ?></h3>
            </td>
          <?php
          else:
            ?>
            <td class="twenty noPrize">
              <h2>1st PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format(0) ?></h3>
            </td>
          <?php
          endif;
          ?>
          <?php
          if (isset($contest->prize[1])):
            ?>
            <td class="twenty">
              <h2>2nd PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format($contest->prize[1]); ?></h3>
            </td>
          <?php
          else:
            ?>
            <td class="twenty noPrize">
              <h2>2nd PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format(0) ?></h3>
            </td>
          <?php
          endif;
          ?>
          <?php
          if (isset($contest->prize[2])):
            ?>
            <td class="twenty">
              <h2>3rd PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format($contest->prize[2]); ?></h3>
            </td>
          <?php
          else:
            ?>
            <td class="twenty noPrize">
              <h2>3rd PLACE</h2>

              <h3>
                <small>$</small><?php echo number_format(0) ?></h3>
            </td>
          <?php
          endif;
          ?>
        </tr>
        </tbody>
      </table>
    </li>
    <?php
    if (sizeof($contest->prize) > 3) {
      for ($i = 0; $i < (sizeof($contest->prize) - 3) / 3; $i++) :
        ?>
        <li>
          <table>
            <tbody>
            <tr>
              <?php
              if (sizeof($contest->prize) > 3 + $i * 3):
                ?>
                <td class="twenty">
                  <h2><?php echo 3 + $i * 3 + 1; ?>th PLACE</h2>

                  <h3>
                    <small>$</small><?php echo number_format($contest->prize[3 + $i * 3]); ?></h3>
                </td>
              <?php
              endif;
              ?>
              <?php
              if (sizeof($contest->prize) > 3 + $i * 3 + 1):
                ?>
                <td class="twenty">
                  <h2><?php echo 3 + $i * 3 + 2; ?>th PLACE</h2>

                  <h3>
                    <small>$</small><?php echo number_format($contest->prize[3 + $i * 3 + 1]); ?></h3>
                </td>
              <?php
              endif;
              ?>
              <?php
              if (sizeof($contest->prize) > 3 + $i * 3 + 2):
                ?>
                <td class="twenty">
                  <h2><?php echo 3 + $i * 3 + 3; ?>th PLACE</h2>

                  <h3>
                    <small>$</small><?php echo number_format($contest->prize[3 + $i * 3 + 2]); ?></h3>
                </td>
              <?php
              endif;
              ?>
            </tr>
            </tbody>
          </table>
        </li>
      <?php
      endfor;
    }
    ?>
  </ul>
  <div>
    <table>
      <tbody>
      <tr>
        <td>
          <?php
          if (isset($contest->digitalRunPoints)):
            ?>
            <p class="scPoints"><span><?php echo $contest->digitalRunPoints; ?></span> STUDIO CUP POINTS</p>
          <?php
          else:
            ?>
            <p class="scPoints">NO STUDIO CUP POINTS</p>
          <?php
          endif;
          ?>
        </td>
      </tr>
      <tr>
        <td>
          <p class="scPoints"><span><?php echo $contest->numberOfCheckpointsPrizes; ?></span> CHECKPOINT AWARDS WORTH
            <span>$100</span> EACH</p>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</div>

<div class="rightColumn">

  <div class="nextBox ">

    <div class="nextBoxContent nextDeadlineNextBoxContent">
      <div class="icoTime">
        <span class="nextDTitle">Current Phase</span>
        <span
          class="CEDate">{{challenge.currentStatus == 'Completed' ? 'Completed' : challenge.currentPhaseName}}</span>
      </div>
      <span class="timeLeft">
      <!-- TODO: sort this guy out -->
      <?php
      if ($contest->currentStatus !== 'Completed' && $contest->currentStatus !== 'Deleted' && $contest->currentPhaseRemainingTime > 0) {
        $dtF = new DateTime("@0");
        $dtT = new DateTime("@{$contest->currentPhaseRemainingTime}");
        echo $dtF->diff($dtT)->format('%a <small>Days</small> %h <small>Hours</small> %i <small>Mins</small>');
      }
      ?>
      </span>
    </div>
    <!--End nextBoxContent-->
      <div ng-if="!isDesign" class="nextBoxContent allDeadlineNextBoxContent hide">
        <p><label>Posted On:</label>
          <!-- TODO: convert date formatting to JS -->
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->postingDate"));?>
          </span>
        </p>


        <p><label>Register By:</label>
         <span><?php echo date(
             "M d, Y H:i T",
             strtotime("$contest->registrationEndDate"));?>
         </span>
        </p>

        <p class="last"><label>Submit By:</label>
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->submissionEndDate"));?>
          </span>
        </p>

      </div>
      <!--End nextBoxContent-->
      <div ng-if="isDesign" class="nextBoxContent allDeadlineNextBoxContent studio hide">
        <p><label>Start Date:</label>
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->postingDate"));?>
          </span>
        </p>
        <?php if ($contest->checkpointSubmissionEndDate != "") : ?>
          <p><label>Checkpoint:</label>
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->checkpointSubmissionEndDate"));?>
          </span>
          </p>
        <?php endif; ?>

        <p><label>End Date:</label>
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->submissionEndDate"));?>
          </span>
        </p>

        <p class="last"><label>Winners Announced:</label>
          <span><?php echo date(
              "M d, Y H:i T",
              strtotime("$contest->appealsEndDate"));?>
          </span>
        </p>
      </div>
      <!--End nextBoxContent-->
  </div>

  <!--End nextBox-->
  <div class="deadlineBox">

    <div class="deadlineBoxContent nextDeadlinedeadlineBoxContent ">
      <a class="viewAllDeadLineBtn" href="javascript:">View all deadlines +</a>
    </div>
    <!--End deadlineBoxContent-->
    <div class="deadlineBoxContent allDeadlinedeadlineBoxContent hide">
      <a class="viewNextDeadLineBtn" href="javascript:">View next deadline +</a>
    </div>
    <!--End deadlineBoxContent-->
  </div>
  <!--End deadlineBox-->
</div>

</div>
</div>
<!-- /#hero -->

</div>
<!-- /.pageHeading -->