/**
 * Created with JetBrains WebStorm.
 * User: Linghua
 * Date: 3/4/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
function MoneyMgr() {
  this.totalStars = 0;
  this.starToGemRatio = 1 / 10;
}

MoneyMgr.prototype = new LocalStorageMgr("MONEY");

MoneyMgr.prototype.resetUser = function (user) {
  LocalStorageMgr.prototype.resetUser.call(this, user);
  this.getTotalGemsFromLocal();
};

MoneyMgr.prototype.resetMoney = function () {
  if (Util.isTrialVersion()) {
    this.setTotalGems(0);
  } else {
    this.setTotalGems(200);
  }
};

MoneyMgr.prototype.setMoneyText = function (moneyText) {
  this.moneyText = moneyText;
};

MoneyMgr.prototype.getTotalGems = function () {
  return this.totalGems;
};

MoneyMgr.prototype.getTotalGemsFromLocal = function () {
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

MoneyMgr.prototype.getTotalStars = function () {
  return this.totalStars;
};

MoneyMgr.prototype.setTotalGems = function (gems) {
  this.totalGems = gems;
  this.setValue(gems, "gem");
  this.moneyText.setText("" + gems);
};

MoneyMgr.prototype.setTotalStars = function (stars) {
  this.totalStars = stars;
};
MoneyMgr.prototype.addGems = function (gems) {
  if (this.totalGems + gems < 0) {
    return false;
  }
  this.totalGems += gems;
  this.setTotalGems(this.totalGems);
  return true;
};

MoneyMgr.prototype.timeGems = function (times) {
  this.totalGems = Math.floor(this.totalGems * times);
  return this;
};

MoneyMgr.prototype.addStars = function (stars) {
  this.totalStars += stars;
};

MoneyMgr.prototype.convertStarIntoGem = function (stars) {
  var gems = stars * this.starToGemRatio;
  this.gems += gems;
  this.stars -= stars;
};

MoneyMgr.prototype.convertGemIntoStar = function (gems) {
  var gemToStarRadio = 1 / this.starToGemRatio;
  var stars = gems * this.starToGemRatio;
  this.gems -= gems;
  this.stars += stars;
};

