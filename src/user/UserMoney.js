/**
 * The UserMoney object holds the current money for the user, and supports increment, decrement, and
 * conversion to/from gems.
 *
 * @author Linghua Jin
 * @since May 2013
 */
function UserMoney() {
  this.totalStars = 0;
  this.starToGemRatio = 1 / 10;
}

UserMoney.prototype = new LocalStorageMgr("MONEY");

UserMoney.prototype.resetUser = function (user) {
  LocalStorageMgr.prototype.resetUser.call(this, user);
  this.getTotalGemsFromLocal();
};

UserMoney.prototype.resetMoney = function () {
  if (Util.isTrialVersion()) {
    this.setTotalGems(0);
  } else {
    this.setTotalGems(200);
  }
};

UserMoney.prototype.getTotalGems = function () {
  return this.totalGems;
};

UserMoney.prototype.getTotalGemsFromLocal = function () {
  this.totalGems = parseInt(this.getValue("gem"));
  if (!this.totalGems) {
    if (Util.isTrialVersion()) {
      this.totalGems = 0;
    } else {
      this.totalGems = 200;
    }
  }
  return this.totalGems;
};

UserMoney.prototype.getTotalStars = function () {
  return this.totalStars;
};

UserMoney.prototype.setTotalGems = function (gems) {
  this.totalGems = gems;
  this.setValue(gems, "gem");
};

UserMoney.prototype.setTotalStars = function (stars) {
  this.totalStars = stars;
};

UserMoney.prototype.addGems = function (gems) {
  if (this.totalGems + gems < 0) {
    return false;
  }
  this.totalGems += gems;
  this.setTotalGems(this.totalGems);
  return true;
};

UserMoney.prototype.timesGems = function (times) {
  this.totalGems = Math.floor(this.totalGems * times);
  return this;
};

UserMoney.prototype.addStars = function (stars) {
  this.totalStars += stars;
};

UserMoney.prototype.convertStarIntoGem = function (stars) {
  var gems = stars * this.starToGemRatio;
  this.gems += gems;
  this.stars -= stars;
};

UserMoney.prototype.convertGemIntoStar = function (gems) {
  var stars = gems * (1.0 / this.starToGemRatio);
  this.gems -= gems;
  this.stars += stars;
};

