/**
 * User: Niu Niu
 * Date: 3/1/13
 * All rights reserved by Africa Swing
 */

function UserLevel() {
}

UserLevel.prototype = new LocalStorageMgr("LEVEL");

UserLevel.prototype.getExpByLevel = function(level) {
  return Math.floor(1618 * level + 618 * level * level + 0.618* Math.pow(1.618, level));
};

UserLevel.prototype.resetLevel = function() {
  this.setLevel(0);
  this.setExp(0);
};

UserLevel.prototype.setProgressBar = function( progressBar) {
  this.progressBar = progressBar;
};

UserLevel.prototype.getCurrExpPercent = function() {
  var level = this.getLevel();
  var exp = this.getExp();
  return this.calcExpPercent(exp, level+1);
};

UserLevel.prototype.calcExpPercent = function(exp, nextLevel) {
  var currLevelUp = this.getExpByLevel(nextLevel);
  var prevLevelUp = this.getExpByLevel(nextLevel - 1);
  return ( (exp - prevLevelUp) / (currLevelUp - prevLevelUp) );
};

UserLevel.prototype.expChange = function(scene, expDelta, levelUpFun) {
  var that = this;
  var currentLevel = this.getLevel();
  var currentExp = this.getExp();
  var fromPoint = that.calcExpPercent(currentExp, currentLevel + 1);
  var newExp = currentExp + expDelta;
  var nextLevel = currentLevel;

  // reset lastBehavior for more robust
  this.progressBar.lastBehavior = null;
  // process exp inc, multiple level up may occur
  while (1) {

    nextLevel++;
    var nextExpLevelUp = this.getExpByLevel(nextLevel);
    var toPoint;

    // exp inc is within this level, we are done
    if (newExp < nextExpLevelUp) {
      toPoint = that.calcExpPercent(newExp, nextLevel);
      this.progressBar.setPercentAnimation(scene, fromPoint, toPoint);
      break;
    }

    // level up
    this.progressBar.setPercentAnimation(scene, fromPoint, 1, levelUpFun);
    fromPoint = 0;

  }

  var newLevel = nextLevel - 1;
  if (newLevel != currentLevel) {
    // leveled up, update it
    this.setLevel(newLevel);
  }
  this.setExp(newExp);

};

UserLevel.prototype.setLevel = function(level) {
  this.setValue(level, "level");
};

UserLevel.prototype.getLevel = function() {
  return parseInt(this.getValue("level")) || 0;
};

UserLevel.prototype.setExp = function(exp) {
  this.setValue(exp, "exp");
};

UserLevel.prototype.getExp = function() {
  return parseInt(this.getValue("exp")) || 0;
};

UserLevel.prototype.getHpTotal = function() {
  var level = this.getLevel();
  var bloodTotal =  100 * ( 1 + level/10);
  return bloodTotal;
};
