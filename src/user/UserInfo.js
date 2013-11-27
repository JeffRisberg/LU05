/**
 * User: Niu Niu
 * Date: 3/4/13
 * All rights reserved by Africa Swing
 */

function UserInfo(director) {
  this.userId = undefined;
  this.level = new UserLevel();
  //this.money = new MoneyMgr();
  this.lock = new LockMgr(director);
  //this.score = new UserGameScore();
  //this.achievement= new AchievementMgr(director, this.money);
  this.settings = new Setting();
  this.equip = new UserEquip(this.lock);
  //this.license = new UserLicense(this.lock);
  //this.facebookInfo = new FacebookInfo(director);
  //this.misc = new UserMisc();
  this.character=new UserCharacter(this.lock);

  this.groupTogether = [
    this.level, this.money, this.lock, this.score, this.achievement, this.setting,
    this.equip, this.license, this.misc,this.character
  ];

  // other attributes;
  this.init();
}

UserInfo.prototype.resetAll = function() {

  if (this.facebookInfo.isLoggedIn()) {
    // only when facebook logged in
    var nameInfo = this.facebookInfo.getFacebookInfo();
    var userId = nameInfo.facebookId;

    // process other facebook info
    this.userId = userId;
    this.userName = nameInfo.facebookName;

    this.resetTopUser(this.userId);
  } else {
    this.resetTopUser(this.userName);
  }

  return true;
};

UserInfo.prototype.resetTopUser = function(userName) {

  this.storeId = userName;
  // process other attributes
  this.initOthers();
  this.lock.initAllGroupSt(this.isUserLoggedIn());

};

// This could be deleted. (08/07/2013)
UserInfo.prototype.isUserChanged = function(userNameNew) {

  // login by sign in
  userNameNew = userNameNew || "";
  if (userNameNew && userNameNew != this.userName) {
    return true;
  }

  // check login by facebook
  var nameInfo = this.facebookInfo.getFacebookInfo();
  var userName = nameInfo.facebookName;
  // TODO: later for safety should use userId, because userName may be duplicate name.
  if (userName != this.userName) {
    return true;
  }
  return false;
};

UserInfo.prototype.initOthers = function() {

  // start to reset
  for (var i = 0; i < this.groupTogether.length; ++i) {
    var obj = this.groupTogether[i];
    obj.resetUser(this.storeId);
  }

};

UserInfo.prototype.resetOthers = function() {

  // start to reset
  this.level.resetLevel();
  this.money.resetMoney();
  this.lock.resetStorage();
  this.score.resetValue();
  this.equip.resetEquip();

  this.setting.resetAllSetting();
  this.achievement.resetAllGroup();
  this.license.resetLicense();
  this.misc.resetMisc();
  this.character.resetCharacter();
};

UserInfo.prototype.isUserLoggedIn = function() {
  if (this.facebookInfo.isLoggedIn() != this.isLoggedIn) {
    //console.log("Login status not same: recorded: ", this.isLoggedIn);
  }
  return this.isLoggedIn;
};


UserInfo.prototype.logout = function() {
  this.facebookInfo.logout();
  this.init();
};

UserInfo.prototype.init = function() {
  this.isLoggedIn = false;
  this.userName = "Africa Swinger";
};

UserInfo.prototype.login = function(userName) {
  this.isLoggedIn = true;
  this.userName = userName;
  this.resetTopUser(userName);
};

UserInfo.prototype.getUserName = function() {
  return this.userName;
};
