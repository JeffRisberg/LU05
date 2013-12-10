/**
 * The UserInfo object is a container for the more specific types of user attributes.
 *
 * @author Linghua Jin
 * @since February 2013
 */
function UserInfo(director, sceneMgr) {
  this.userId = undefined;
  this.lock = new LockMgr(director);

  this.experience = new UserExperience();
  this.money = new UserMoney();
  this.episodeScore = new UserEpisodeScore(sceneMgr.episodeMgr);
  //this.achievement= new AchievementMgr(director, this.money);
  this.settings = new Settings();
  this.equip = new UserEquip(this.lock);
  this.character = new UserCharacter(this.lock);

  this.groupTogether = [
    this.lock, this.experience, this.money,
    this.settings, this.equip,
    this.character
  ];

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
  this.experience.resetExperience();
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
