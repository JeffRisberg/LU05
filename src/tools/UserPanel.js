/**
 * A UserPanel contains the user name, the user avatar, and key user attributes such
 * as level, money, etc.
 *
 * @author Linghua Jin
 * @since March 2013
 */
function UserPanel(director) {
  this.director = director;
  CAAT.ActorContainer.call(this);

  // aligned vertical
  this.userNameTActor = Util.createText("Name", 30 * sf);
  this.experienceTActor = Util.createText("Experience", 30 * sf);
  this.userLevelTActor = Util.createText("Lv", 20 * sf);
  this.progressBar = new ProgressBar(this.director).setImage("progressBarCt", 220 * sf, 30 * sf);
  this.userLevelTActor.centerAt(this.progressBar.width / 2, this.progressBar.height / 2);
  this.progressBar.addChild(this.userLevelTActor);
  this.conVertical = Util.createAlignContainerWithActor(true,
    [this.userNameTActor, this.experienceTActor, this.progressBar], 10 * sf);
  var conVertical = this.conVertical;

  this.setBounds(0, 0, conVertical.width, conVertical.height);
  this.addChild(conVertical);

  // money
  var moneyGem = Util.createImageConInBound(this.director, "carrot", 0, 0, 50 * sf, 50 * sf);
  this.moneyGemText = Util.createText("0", 40 * sf);
  var moneyCon = Util.createAlignContainerWithActor(false, [moneyGem, this.moneyGemText], 0);
  moneyCon.setLocation(0.35 * W_, 10 * sf);
  this.addChild(moneyCon);

  this.setLocation(160 * sf, 20 * sf);

  return this;
}

UserPanel.prototype = new CAAT.ActorContainer();

/**
 * Update the values of all items in the panel
 *
 * @param userInfo
 */
UserPanel.prototype.resetAll = function (userInfo) {

  if (!userInfo.userName) {
    console.error("No Username in UserPanel");
  }
  this.userNameTActor.setText(userInfo.userName);
  this.experienceTActor.setText("Exp: " + userInfo.experience.getExp());
  this.userLevelTActor.setText("Level " + userInfo.experience.getLevel());
  this.userLevelTActor.centerAt(this.progressBar.width / 2, this.progressBar.height / 2);

  this.moneyGemText.setText("" + userInfo.money.getTotalGems());

  this.progressBar.setPercent(userInfo.experience.getCurrExpPercent());
  userInfo.experience.setExperienceTActor(this.experienceTActor);
  userInfo.experience.setProgressBar(this.progressBar);
};

UserPanel.prototype.showInCurrentScene = function (scene) {
  if (this.parent == scene) {
    return;
  }
  this.showOffCurrentScene();
  scene.addChild(this);
};

UserPanel.prototype.showOffCurrentScene = function () {
  if (this.parent) {
    this.parent.removeChild(this);
  }
};

/**
 * Change the avatar image by re-building the actor
 *
 * @param licenseName
 */
UserPanel.prototype.setLicense = function (licenseName) {
  Util.destroyObj(this.userLicenseIActor);

  var lw = 30 * sf;
  this.userLicenseIActor = Util.createImageActorInBound(this.director, "monkeyFace",
    this.conVertical.width - lw, 0, lw, lw);
  this.userLicenseIActor.setLocation(120 * sf, 25 * sf);
  this.addChild(this.userLicenseIActor);
};
