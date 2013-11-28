/**
 * The UserInfo object is a container for the more specific types of user attributes.
 *
 * @author Linghua Jin
 * @since February 2013
 */
function UserInfo(director) {
  this.userId = undefined;
  this.experience = new UserExperience();
  this.money = new UserMoney();
  this.lock = new LockMgr(director);
  //this.gameScore = new UserGameScore();
  //this.achievement= new AchievementMgr(director, this.money);
  this.settings = new Settings();
  this.equip = new UserEquip(this.lock);
  this.character = new UserCharacter(this.lock);

  this.groupTogether = [
    this.experience, this.money, this.lock,
    this.settings, this.equip,
    this.character
  ];

  // other attributes;
  this.init();
}

UserInfo.prototype.init = function () {
  this.isLoggedIn = false;
  this.userName = "Bilbo Baggins";
};

UserInfo.prototype.initOthers = function () {
  for (var i = 0; i < this.groupTogether.length; ++i) {
    var obj = this.groupTogether[i];
    obj.resetUser(this.userId);
  }
};

UserInfo.prototype.resetOthers = function () {
  this.experience.resetLevel();
  this.money.resetMoney();
  this.lock.resetStorage();
  this.gameScore.resetValue();
  this.setting.resetAllSetting();

  this.equip.resetEquip();
  this.character.resetCharacter();
};

UserInfo.prototype.getUserName = function () {
  return this.userName;
};
