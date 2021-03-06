/**
 * The UserExperience class holds the user's experience value, and the corresponding level.
 *
 * @author Linghua Jin
 * @since May 2013
 */

function UserExperience() {
}

UserExperience.prototype = new LocalStorageMgr("EXPERIENCE");

UserExperience.prototype.getExpByLevel = function (level) {
  return Math.floor(1618 * level + 618 * level * level + 0.618 * Math.pow(1.618, level));
};

UserExperience.prototype.resetExperience = function () {
  this.setExp(0);
  this.setLevel(0);
};

UserExperience.prototype.setProgressBar = function (progressBar) {
  this.progressBar = progressBar;
};

UserExperience.prototype.getCurrExpPercent = function () {
  var level = this.getLevel();
  var exp = this.getExp();
  return this.calcExpPercent(exp, level + 1);
};

UserExperience.prototype.calcExpPercent = function (exp, nextLevel) {
  var currLevelUp = this.getExpByLevel(nextLevel);
  var prevLevelUp = this.getExpByLevel(nextLevel - 1);
  return ( (exp - prevLevelUp) / (currLevelUp - prevLevelUp) );
};

UserExperience.prototype.expChange = function (scene, expDelta, levelUpFunc) {
  var that = this;
  var currentExp = this.getExp();
  var currentLevel = this.getLevel();

  var fromPoint = that.calcExpPercent(currentExp, currentLevel + 1);
  var newExp = currentExp + expDelta;
  var nextLevel = currentLevel;
  if (DEBUG_.userAtt) {
    console.log("newExp=" + newExp + ", currentLevel=" + currentLevel);
  }

  // reset lastBehavior for more robust
  this.progressBar.lastBehavior = null;

  // process newExp, multiple level up may occur
  while (1) {
    nextLevel++;
    var nextExpLevelUp = this.getExpByLevel(nextLevel);
    if (DEBUG_.userAtt) {
      console.log("nextLevel=" + nextLevel + ", nextLevelExpRequired=" + nextExpLevelUp);
    }

    // newExp is within this level, we are done
    if (newExp < nextExpLevelUp) {
      var toPoint = that.calcExpPercent(newExp, nextLevel);
      this.progressBar.setPercentAnimation(scene, fromPoint, toPoint);
      break;
    }

    // level up
    this.progressBar.setPercentAnimation(scene, fromPoint, 1.0, levelUpFunc);
    fromPoint = 0;
  }

  this.setExp(newExp);

  var newLevel = nextLevel - 1;
  console.log("newLevel=" + newLevel);
  if (newLevel != currentLevel) {
    // leveled up, update it
    this.setLevel(newLevel);
  }
};

UserExperience.prototype.setExp = function (exp) {
  this.setValue(exp, "exp");
};

UserExperience.prototype.getExp = function () {
  return parseInt(this.getValue("exp")) || 0;
};

UserExperience.prototype.setLevel = function (level) {
  this.setValue(level, "level");
};

UserExperience.prototype.getLevel = function () {
  return parseInt(this.getValue("level")) || 0;
};

UserExperience.prototype.getHpTotal = function () {
  var level = this.getLevel();
  var bloodTotal = 100 * ( 1 + level / 10);
  return bloodTotal;
};