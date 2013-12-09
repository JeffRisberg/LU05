/**
 * show score on game screen
 *
 * @author Xiomai
 * @since January 2013
 */
var BestScoreMgr = function (scene_, director_, episodeMgr_, userEpisodeScore_, userLicense_, userExperience_, hpBar_, failedDo_) {

  var that = this;
  var alpha_ = 1;
  var scoreScale_ = 0.7;
  var itemHpFactor_;
  var itemComboFactor_;
  var itemScoreFactor_;
  var itemStrongFactor_;
  var itemAccFactor_;

  var isLevelNotFit_;

  // absolute value, inc will also times acc when accumulated
  var normalHpChangeMount_ = { dec: -5, inc: 1 };
  this.surviveLevel = { dec: -0.3, inc: 0.05 }; // percentage
  this.mode = "default";

  var eachNoteScore_ = 10;
  var fontScore_ = [];
  setFontScore();
  var accChoiceRange_ = [99, 91, 71, -1];

  var maxCombo_;

  var comboImagePrefix = "comboImg";

  var comboNumberText = new CAAT.Foundation.UI.TextActor().
    setFont(fontScore_[0]).
    setText("0").
    setAlpha(alpha_);

  var statusActor = Util.createImageActorWH(director_, comboImagePrefix + "0", 180 * sf, 50 * sf)
    .setAlpha(alpha_);

  var scoreText = new CAAT.Foundation.UI.TextActor().
    setFont(fontScore_[2]).
    setText("0").setScale(scoreScale_, scoreScale_);

  var scoreImg = Util.createImageActorWH(director_, "scoreImg", 80 * sf, 17 * sf);
  var scoreCon = Util.createAlignContainerWithActor(HORIZONTAL, [scoreImg, scoreText], 0);
  Util.changeLayoutAlignOnActor(scoreCon, "CENTER", "CENTER");

  scoreCon.setLocation(65 * sf, 4 * sf);
  scene_.addChild(scoreCon);

  this.comboContainer = Util.createAlignContainerWithActor(VERTICAL, [statusActor, comboNumberText], 0);
  Util.changeLayoutAlignOnActor(this.comboContainer, "top", "center");
  this.comboContainer.centerAt(W_ / 2, H_ * 0.2);
  scene_.addChild(this.comboContainer);

  var behaviorContainer = Util.createPumpBehavior();
  var hpTotal;
  var hpCurr;
  this.comboContainer.addBehavior(behaviorContainer);

  this.init = function () {
    this.comboContainer.setScale(0, 0);
    this.combo = 0;
    userEpisodeScore_.currentScore = 0;
    userEpisodeScore_.accAdded = 0;
    userEpisodeScore_.accNum = 0;

    hpTotal = userExperience_.getHpTotal();
    var hpBarW = hpTotal / 2 + 100;
    if (hpBarW > 260) {
      hpBarW = 260;
    }
    hpBar_.setMySize(hpBarW * sf);
    // remove last behavior residue
    comboNumberText.setText(0 + "");
    scoreText.setText(0 + "");
    itemHpFactor_ = 1;
    itemComboFactor_ = false;
    itemScoreFactor_ = 1;
    itemAccFactor_ = 1;
    itemStrongFactor_ = false;
    isLevelNotFit_ = false;
    userEpisodeScore_.isAllCombo = true;
    maxCombo_ = 0;
  };

  this.setItemHpFactor = function (val) {
    itemHpFactor_ = val;
  };
  this.setItemComboFactor = function (val) {
    itemComboFactor_ = val;
  };
  this.setItemScoreFactor = function (val) {
    itemScoreFactor_ = val;
  };
  this.setItemAccFactor = function (val) {
    itemAccFactor_ = val;
  };
  this.setItemStrongFactor = function (val) {
    itemStrongFactor_ = val;
  };
  this.setIsLevelNotFit = function (val) {
    isLevelNotFit_ = val;
  };

  function changeHpBar(isInc, acc) {
    acc = acc || 100;
    var currentPercent;
    var delta;
    if (that.mode != "exam") {
      if (itemStrongFactor_) {
        return;
      }
      delta = (isInc ? normalHpChangeMount_.inc * acc / 100 : normalHpChangeMount_.dec);
      delta = delta * (episodeMgr_.getDifficulty() + 1) * (episodeMgr_.getDifficulty() + 1);
      if (!isInc) {
        delta = delta * itemHpFactor_;
        var highLicense = userLicense_.getHighestLicenseGroup();
        if (highLicense) {
          delta = delta * (1 - highLicense.bloodReduce);
        }
      }
      // calc from percent so item can easily change percent
      hpCurr = hpTotal * hpBar_.getPercent();
      hpCurr += delta;
      currentPercent = hpCurr / hpTotal;

      // die one mistake if level not fit
      if (isLevelNotFit_ && !isInc) {
        currentPercent = 0;
      }
    } else {
      delta = isInc ? that.surviveLevel.inc : that.surviveLevel.dec;
      if (!isInc) {
        delta = delta * itemHpFactor_;
      }
      currentPercent = hpBar_.getPercent() + delta;
    }
    if (currentPercent <= 0) {
      hpBar_.setPercent(currentPercent);
      failedDo_();
      return;
    }
    if (currentPercent > 1) {
      hpCurr = hpTotal;
      currentPercent = 1;
    }
    hpBar_.setPercent(currentPercent);
  }

  this.textMiss = function () {
    changeHpBar(false);
    changeComboInterrupt();
    userEpisodeScore_.accNum += 1;
    Util.changeActorImg(director_, statusActor, "missImg");
    comboNumberText.setText("");
    showText();
    userEpisodeScore_.isAllCombo = false;
  };

  this.textHit = function (acc) {

    acc = applyItemAcc(acc);
    changeHpBar(true, acc);
    this.combo += 1;
    if (this.combo > maxCombo_) {
      maxCombo_ = this.combo;
    }
    var delta = eachNoteScore_ + getExtraScoreFromCombo();
    delta *= itemScoreFactor_;
    userEpisodeScore_.currentScore += Math.round(delta * acc / 100);
    userEpisodeScore_.accAdded += acc;
    userEpisodeScore_.accNum += 1;

    var spriteIndex = Util.findValueIndexInRange(acc, accChoiceRange_);
    comboNumberText.setText(this.combo + "").setFont(fontScore_[spriteIndex]);
    Util.changeActorImg(director_, statusActor, comboImagePrefix + spriteIndex);
    scoreText.setText(userEpisodeScore_.currentScore + "");

    showText();
  };

  function getExtraScoreFromCombo() {
    return Math.round(that.combo / 10);
  }

  function applyItemAcc(acc) {
    acc = Math.floor(acc * itemAccFactor_);
    if (acc >= 100) {
      acc = 99;
    }
    return acc;
  }

  this.textBreak = function () {
    changeHpBar(false);
    changeComboInterrupt();
    userEpisodeScore_.accNum += 1;
    Util.changeActorImg(director_, statusActor, "breakImg");
    comboNumberText.setText("");
    showText();
    userEpisodeScore_.isAllCombo = false;
  };

  this.getMaxScore = function () {
    var notes = episodeMgr_.getNotesArray();
    var len = notes.pos.length;
    var maxScore = len * eachNoteScore_ + (1 + len) * len / 2 / 10;
    return maxScore;
  };

  // Set all score related value into userEpisodeScore when run is finished
  // like maxCombo..
  // so later scoreCon could extract all values from userEpisodeScore
  this.setScoreRelatedValueOnRunEnd = function () {
    userEpisodeScore_.setCurrBest("comboUGS", maxCombo_);
  };

  function changeComboInterrupt() {
    if (itemComboFactor_) {
      // enabled item
      return;
    }
    that.combo = 0;
  }

  function setFontScore() {
    for (var i = 0; i < 3; i++) {
      fontScore_[i] = new CAAT.SpriteImage().
        initializeAsMonoTypeFontMap(
          director_.getImage("fontScore" + i),
          "0123456789,p+x-"
        );
    }
  }

  // private function
  function showText() {
    behaviorContainer.setDelayTime(0, 1000);
  }
};
