/**
 * The UserInfo object is a container for the more specific types of user attributes.
 *
 * @author Linghua Jin
 * @since February 2013
 */
function UserInfo(director, sceneMgr) {
  this.userId = undefined;
  this.lock = new LockMgr(director);
  this.settings = new Settings();

  this.money = new UserMoney();
  this.experience = new UserExperience();
  this.episodeScore = new UserEpisodeScore(sceneMgr.episodeMgr);
  //this.achievement = new AchievementMgr(director, this.money);
  this.equip = new UserEquip(this.lock);
  this.character = new UserCharacter(this.lock);

  this.groupTogether = [
    this.lock, this.settings, this.money, this.experience, this.episodeScore,
    this.equip, this.character
  ];

  this.init();
  this.initOthers();
}

UserInfo.prototype.init = function () {
  this.isLoggedIn = false;
  this.userName = "Bilbo Baggins";
  this.userId = "User456";
};

UserInfo.prototype.initOthers = function () {
  for (var i = 0; i < this.groupTogether.length; ++i) {
    var obj = this.groupTogether[i];
    obj.resetUser(this.userId);
  }
};

UserInfo.prototype.resetOthers = function () {
  this.money.resetMoney();
  this.experience.resetExperience();
  this.lock.resetStorage();
  this.episodeScore.resetValues();
  this.settings.resetAllSettings();

  this.equip.resetEquip();
  this.character.resetCharacter();
};

UserInfo.prototype.getUserName = function () {
  return this.userName;
};
