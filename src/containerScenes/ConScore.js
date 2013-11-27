SceneMgr.prototype.conScore = function (parent) {
  var that = this;
  var topCon = that.createConBG();
  var userEquip = that.userInfo.equip;
  var userLicense = that.userInfo.license;
  var userScore = that.userInfo.score;

  function destroyTopCon() {
    resetCurrentLevel();
    that.userPanel.showOffCurrentScene();
    Util.destroyObj(topCon);
    that.conReturnCommonDo();
  }

  var containerBg = Util.createImageConInBound(that.director, "", 0.2 * W_, 0.2 * H_, W_ * 0.7, H_ * 0.7);
  topCon.addChild(containerBg);

  //two btns
  var topX = W_ * 0.5;
  var topY = H_ * 0.35;
  var buttonW = RBS_ * 3.2;
  var buttonH = RBS_ * 0.9;

  function goSongBookDo() {
    if (that.audioMgr.isExam()) {
      that.audioMgr.resetToLastSong();
    }
    destroyTopCon();
  }

  var btnSongbook = that.createButtonConSwitchScene("btnSongbook", "sceneEpisodeList", topX, topY, buttonW, buttonH, goSongBookDo);

  var btnRestart = that.createButtonConSwitchScene("btnRestart", "sceneLoad", topX, topY + buttonH + 10 * sf, buttonW, buttonH, destroyTopCon);

  var buttonsCon = Util.createAlignContainerWithActor(VERTICAL, [btnRestart, btnSongbook]);

  // create initial star container
  var starCon;
  drawStarAndTryUnlock(0, false);

  // create wrapper on it so it will fix in aligned container
  var starConWrapper = Util.createConEmptyWrapper(starCon);

  function removeStar() {//1,2,3
    Util.destroyObj(starCon);
  }

  function isEnoughForNextLevel(level) {
    if (level >= 2) {
      return true;
    }
    var maxCombo = that.audioMgr.getCurrentMaxCombo();
    var bestCombo = userScore.getBest("comboUGS");
    if (bestCombo > maxCombo * 0.6) {
      return true;
    }
    return false;
  }

  function drawStarAndTryUnlock(level, addToParent) {//0,1,2,3
    if (addToParent == undefined) {
      addToParent = true;
    }
    if (isEnoughForNextLevel(level) && that.audioMgr.getNextSongName()) {
      if (!Util.isTrialVersion() || !that.audioMgr.isSongOnlyFullVersion(that.audioMgr.getNextSongName())) {
        if (that.userInfo.lock.unlock(that.audioMgr.getNextSongName() + "_" + that.audioMgr.difficulty)) {
          Util.popUpUnlock(that.director, that.audioMgr.getNextSongName(), that.audioMgr.getNextSongName());
        }
      }
    }

    starCon = Util.createStars(that.director, level);
    if (addToParent) {
      starConWrapper.addChild(starCon);
    }
  }

  function isPlayDead() {
    return (that.hpBar.getPercent() <= 0);
  }

  function getStarLevel(currentScore) {
    var maxScore = that.scoreMgr.getMaxScore();
    if (isPlayDead() || currentScore == 0) {
      return 0;
    }
    if (currentScore < maxScore * 0.65) {
      return 1;
    }
    if (currentScore < maxScore * 0.95) {
      return 2;
    }

    return 3;

  }

  // score text
  var textAcc = Util.createText("Accuracy:  0.0%");
  var textCurrScore = Util.createText("dummy");
  var textBestScore = Util.createText("dummy");
  var textMoney = Util.createText("Earned 1000 (+20%) carrots");

  // for panel
  var progressBar = this.userPanel.progressBar;
  var userLevel = this.userInfo.level;
  var userLevelText = this.userPanel.userLevelTActor;

//  userLevelText.setLocation(w/2 - 200, 90);
  /*
   var levelCon = Util.createAlignContainerWithActor(false, [userLevelText, progressBar]);
   scene.addChild(levelCon);
   levelCon.centerAt(w/2, 100);
   */

  var levelCount;

  function levelUpFun() {
    levelCount++;
    userLevelText.setText("Level " + levelCount);
  }

  function resetCurrentLevel() {
    levelCount = userLevel.getLevel();
    userLevelText.setText("Level " + levelCount);
    progressBar.actor.emptyBehaviorList();
    progressBar.setPercent(userLevel.getCurrExpPercent());
  }

  function calcMoneyFromScore() {
    var earned = Math.round(currentScore / 500);
    if (earned <= 0) {
      earned = 1;
    }
    return earned;
  }

  var currentScore = userScore.currentScore;
  var earnedMoney = calcMoneyFromScore();
  if (isPlayDead()) {
    currentScore = 0;
    earnedMoney = 0;
  }
  var currentAcc = (userScore.accAdded / (userScore.accNum == 0 ? 1 : userScore.accNum));

  var rewardCon = null;
  // special for license
  if (that.audioMgr.isExam()) {
    btnRestart.childrenList[0].setVisible(false);
    if (that.gameMgr.isWholeRunEnd) {

      var currLicenseObj = userLicense.getCurrentChallengeLicenseObj();
      if (currLicenseObj) {
        if (currLicenseObj.acc <= currentAcc) {
          userLicense.passedCurrent();
          var licenseName = userLicense.getHighestLicense();
          var bunnyType = "rabbitNormal";
          if (licenseName) {
            bunnyType = "bunny" + licenseName;
          }
          new PopUp(that.director, Util.getCurrentConOrScene(that.director), " Congrats: passed", bunnyType)
        } else {
          new PopUp(that.director, Util.getCurrentConOrScene(that.director),
            " Failed: Accuracy need to be more than " + currLicenseObj.acc + "%",
            "rabbitSad");
        }
      } else {
        console.error("no current license");
      }

    }
  }

  if (!isPlayDead() && !that.audioMgr.isExam()) {
    // added reward item
    var itemRewardImage = userEquip.randomAwardItem(1 + that.audioMgr.difficulty / 4 + currentScore / 20000);
    if (itemRewardImage) {
      var rewardText = Util.createText("Earned ");
      var rewardImgActor = Util.createImageActorWH(that.director, itemRewardImage, RBS_, RBS_);
      rewardCon = Util.createAlignContainerWithActor(HORIZONTAL, [rewardText, rewardImgActor], 0);
    }
  }

  var expEarn = currentScore * 4.6 * (1 + that.audioMgr.difficulty * that.audioMgr.difficulty / 2);
  if (DEBUG_.notRelease) {
    expEarn *= 1000;
  }

  // apply talent
  var target = {
    expEarn: expEarn,
    gemEarn: earnedMoney,
    gemText: earnedMoney + "",
    score: currentScore,
    scoreText: currentScore + "",
    acc: currentAcc,
    accText: currentAcc.toFixed(1) + ""
  };
  userEquip.applyTalentEffectEnd(target);
  currentScore = target.score;
  var bestScore = userScore.getBestScore();
  if (currentScore > bestScore) {
    userScore.setBestScore(currentScore, that.userInfo.facebookInfo.isLoggedIn());
    textBestScore.setVisible(true);
//    if (that.userInfo.facebookInfo.isLoggedIn() && that.userInfo.setting.getValue("turnOnFacebook")){
//      var songInfo=that.audioMgr.getSongInfo();
//      that.facebookInfo.publishAMessage("New Best Score: "+target.scoreText +" in "+songInfo.songTitle);
//    }
  } else {
    textBestScore.setVisible(false);
  }
  textCurrScore.setText("Score: " + target.scoreText);
  textBestScore.setText("New Best Score");


  // console.log(that.userInfo.setting.getGroupAsArray());

  //when both facebook login and userset facebook post to be true, do the posting.


  // show average accuracy of this run
  textAcc.setText("Accuracy: " + target.accText + "%");
  textMoney.setText("Earned " + target.gemText + " " + GEM_UNIT);


  // panel content change
  resetCurrentLevel();
  that.userPanel.showInCurrentScene(topCon);
  userLevel.expChange(parent, target.expEarn, levelUpFun);

  // update money
  that.userInfo.money.addGems(earnedMoney);

  // update achievement and best score
  if (!isPlayDead()) {
    that.userInfo.achievement.checkAndUpdate("highScore", currentScore, false);
    that.userInfo.achievement.checkAndUpdate("highAcc", target.acc, false);
    if (that.userInfo.score.isAllCombo) {
      that.userInfo.achievement.checkAndUpdate("achTrueHacker", -target.acc, false);
    }
  }
  // stars
  removeStar();
  var starLevel = getStarLevel(currentScore);
  drawStarAndTryUnlock(starLevel);
  userScore.checkAndSetCurrSongStar(starLevel);

  // layout
  var scoreTextCon = Util.createAlignContainerWithActor(true,
    [textAcc, textCurrScore, textBestScore, textMoney, rewardCon]);
  var scoreCon = Util.createAlignContainerWithActor(VERTICAL, [starConWrapper, scoreTextCon]);

  // top level layout
  var alignedConAll = Util.createAlignContainerWithActor(HORIZONTAL, [scoreCon, buttonsCon]);
  alignedConAll.centerAt(containerBg.width * 0.45, containerBg.height * 0.6);
  containerBg.addChild(alignedConAll);
  return topCon;

};