/**
 * User: Niu Niu
 * Date: 3/4/13
 * All rights reserved by Africa Swing
 */
function UserPanel(director) {
  this.director = director;
  CAAT.ActorContainer.call(this);

  // aligned vertical
  this.userNameTActor = Util.createText("Name", 30 * sf);
  this.userLevelTActor = Util.createText("Lv", 20 * sf);
  this.progressBar = new ProgressBar(this.director).setImage("progressBarCt", 220 * sf, 30 * sf);
  this.userLevelTActor.centerAt(this.progressBar.width / 2, this.progressBar.height / 2);
  this.progressBar.addChild(this.userLevelTActor);
  this.conVertical = Util.createAlignContainerWithActor(true,
    [this.userNameTActor, this.progressBar], 10 * sf);
  var conVertical = this.conVertical;

  this.setBounds(0, 0, conVertical.width, conVertical.height);
  this.addChild(conVertical);

  this.setLocation(160 * sf, 20 * sf);

  // money
  var moneyGem = Util.createImageConInBound(this.director, "gemImg", 0, 0, 50 * sf, 50 * sf);
  this.moneyGemText = Util.createText("0", 40 * sf);
  var moneyCon = Util.createAlignContainerWithActor(false, [moneyGem, this.moneyGemText], 0);
  moneyCon.setLocation(0.35 * W_, 10 * sf);//location for money
  this.addChild(moneyCon);

  return this;
}

UserPanel.prototype = new CAAT.ActorContainer();

UserPanel.prototype.resetAll = function (userInfo) {

  if (!userInfo.userName) {
    console.error("No userName in user Panel");
  }
  this.userNameTActor.setText(userInfo.userName);
  this.userLevelTActor.setText("Lv " + userInfo.level.getLevel());
  this.moneyGemText.setText("" + userInfo.money.getTotalGems());
  this.userLevelTActor.centerAt(this.progressBar.width / 2, this.progressBar.height / 2);
  userInfo.money.setMoneyText(this.moneyGemText);
  this.progressBar.setPercent(userInfo.level.getCurrExpPercent());
  userInfo.level.setProgressBar(this.progressBar);
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

UserPanel.prototype.setLicense = function (licenseName) {
  Util.destroyObj(this.userLicenseIActor);

  var lw = 30 * sf;
  this.userLicenseIActor = Util.createImageActorInBound(this.director, "monkeyFace",
    this.conVertical.width - lw, 0, lw, lw);
  this.userLicenseIActor.setLocation(120 * sf, 25 * sf);
  this.addChild(this.userLicenseIActor);
};