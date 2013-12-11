/**
 * The <i>ConScore</i> class is the container scene that appears at the end of play run, and indicates
 * your results, including score, accuracy, level, and other information.
 *
 * @author nearly everyone has worked on this
 * @since February 2013
 */
SceneMgr.prototype.conScore = function (parent) {
  var that = this;
  var topCon = that.createConBG();
  var userEquip = that.userInfo.equip;
  var userLicense = that.userInfo.license;
  var userEpisodeScore = that.userInfo.episodeScore;
  var episodeMgr = that.episodeMgr;

  function destroyTopCon() {
    that.userPanel.showOffCurrentScene();
    Util.destroyObj(topCon);
    that.conReturnCommonDo();
    that.sceneNameToScene['scenePlay'].backFromCon();
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", destroyTopCon, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  var bgX = goBackButton.x + RBS_ + 2 * sf;
  var bgContainer = Util.createImageConInBound(that.director, "bgFlat", bgX, 0.01 * H_, W_ - bgX, H_);
  topCon.addChild(bgContainer);

  // create initial star container
  var starCon;
  drawStarAndTryUnlock(0, false);

  // create wrapper on it so it will fix in aligned container
  var starConWrapper = Util.createConEmptyWrapper(starCon);

  function removeStar() {//1,2,3
    Util.destroyObj(starCon);
  }

  // this actually indicates if you have earned enough to qualify for the next episode
  function isEnoughForNextLevel(level) {
    if (level >= 2) {
      return true;
    }
    //var maxCombo = that.episodeMgr.getCurrentMaxCombo();
    //var bestCombo = userScore.getBest("comboUGS");
    //if (bestCombo > maxCombo * 0.6) {
    //  return true;
    //}
    return false;
  }

  function drawStarAndTryUnlock(starCount, addToParent) {//0,1,2,3
    if (addToParent == undefined) {
      addToParent = true;
    }
    //if (isEnoughForNextLevel(level) && that.episodeMgr.getNextSongName()) {
    //  if (!Util.isTrialVersion() || !that.episodeMgr.isSongOnlyFullVersion(that.episodeMgr.getNextSongName())) {
    //    if (that.userInfo.lock.unlock(that.episodeMgr.getNextSongName() + "_" + that.episodeMgr.difficulty)) {
    //      Util.popUpUnlock(that.director, that.episodeMgr.getNextSongName(), that.episodeMgr.getNextSongName());
    //    }
    //  }
    //}

    starCon = Util.createStars(that.director, starCount);
    if (addToParent) {
      starConWrapper.addChild(starCon);
    }
  }

  function isPlayerDead() {
    //return (that.hpBar.getPercent() <= 0);
    return false;
  }

  function getStarCount(currentScore) {
    maxScore = that.episodeMgr.getMaxScore();
    if (isPlayerDead() || currentScore == 0) {
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
  var textAcc = Util.createText("Accuracy:  0.0%", 25 * sf);
  var textCurrScore = Util.createText("dummy", 40 * sf);
  var textBestScore = Util.createText("dummy", 25 * sf);
  var textMoney = Util.createText("Earned 1000 (+20%) carrots", 25 * sf);

  // for panel
  var progressBar = this.userPanel.progressBar;
  var userExperience = this.userInfo.experience;
  var userLevelText = this.userPanel.userLevelTActor;

  function resetCurrentLevel() {
    var levelValue = userExperience.getLevel();
    userLevelText.setText("Level " + levelValue);
    progressBar.actor.emptyBehaviorList();
    progressBar.setPercent(userExperience.getCurrExpPercent());
  }

  var currentScore = userEpisodeScore.currentScore;
  var earnedMoney = Math.min(1, Math.round(currentScore / 500));
  if (isPlayerDead()) {
    currentScore = 0;
    earnedMoney = 0;
  }
  var currentAcc = (userEpisodeScore.accAdded / (userEpisodeScore.accNum == 0 ? 1 : userEpisodeScore.accNum));

  var rewardCon = null;
  // special for license
  //if (that.episodeMgr.isExam()) {
  //  btnRestart.childrenList[0].setVisible(false);
  //  if (that.gameMgr.isWholeRunEnd) {

  //    var currLicenseObj = userLicense.getCurrentChallengeLicenseObj();
  //    if (currLicenseObj) {
  //      if (currLicenseObj.acc <= currentAcc) {
  //        userLicense.passedCurrent();
  //        var licenseName = userLicense.getHighestLicense();
  //        var bunnyType = "rabbitNormal";
  //        if (licenseName) {
  //          bunnyType = "bunny" + licenseName;
  //        }
  //        new PopUp(that.director, Util.getCurrentConOrScene(that.director), " Congrats: passed", bunnyType)
  //      } else {
  //        new PopUp(that.director, Util.getCurrentConOrScene(that.director),
  //          " Failed: Accuracy need to be more than " + currLicenseObj.acc + "%",
  //          "rabbitSad");
  //      }
  //    } else {
  //      console.error("no current license");
  //    }
  //}
  //}

  if (!isPlayerDead() && !episodeMgr.isExam()) {
    // added reward item
    var itemRewardImage = userEquip.randomAwardItem(1 + episodeMgr.getDifficulty() / 4 + currentScore / 20000);
    if (itemRewardImage) {
      var rewardText = Util.createText("Bonus ", 40 * sf);

      var rewardImgActor = Util.createImageActorWH(that.director, itemRewardImage, RBS_, RBS_);

       rewardCon = Util.createAlignContainerWithActor(VERTICAL, [rewardText, rewardImgActor], 0);

    }
  }

  var expEarn = currentScore * 4.6 * (1 + episodeMgr.getDifficulty() * episodeMgr.getDifficulty() / 2);
  console.log("expEarn=" + expEarn);

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
  //userEquip.applyTalentEffectEnd(target);
  currentScore = target.score;
  var bestScore = userEpisodeScore.getCurrBestScore();
  if (currentScore > bestScore) {
    userEpisodeScore.setCurrBestScore(currentScore);
    textBestScore.setVisible(true);
  } else {
    textBestScore.setVisible(false);
  }
  textCurrScore.setText("Score: " + target.scoreText);
  textBestScore.setText("New Best Score");

  // show average accuracy of this run
  textAcc.setText("Accuracy: " + target.accText + "%");
  textMoney.setText("Earned " + target.gemText + " " + GEM_UNIT);

  // panel content change
  resetCurrentLevel();
  that.userPanel.showInCurrentScene(topCon);

  var levelCount = userExperience.getLevel();

  function levelUpFunc() {
    levelCount++;
    userLevelText.setText("Level " + levelCount);
  }

  userExperience.expChange(parent, target.expEarn, levelUpFunc);

  // update money
  that.userInfo.money.addGems(earnedMoney);
  that.userPanel.resetAll(that.userInfo);

  // update achievement and best score
  if (!isPlayerDead()) {
    //that.userInfo.achievement.checkAndUpdate("highScore", currentScore, false);
    //that.userInfo.achievement.checkAndUpdate("highAcc", target.acc, false);

    if (that.userInfo.episodeScore.isAllCombo) {
      //that.userInfo.achievement.checkAndUpdate("achTrueHacker", -target.acc, false);
    }
  }

  // stars
  removeStar();
  var starCount = getStarCount(currentScore);
  drawStarAndTryUnlock(starCount);
  //userEpisodeScore.checkAndSetCurrSongStar(starCount);

  // layout

  var scoreTextCon = Util.createAlignContainerWithActor(true,
    [textCurrScore, textAcc, textBestScore, textMoney]);
  var scoreCon = Util.createAlignContainerWithActor(false, [starConWrapper, scoreTextCon, rewardCon], 70);

  scoreCon.centerAt(bgContainer.width * 0.45, bgContainer.height * 0.6);
  bgContainer.addChild(scoreCon);
  return topCon;
};
