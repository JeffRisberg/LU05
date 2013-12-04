/**
 * The <i>UserPanel</i> is a display component that shows the player name, basic scores, and amount
 * of money.  This component is created once and moved from scene to scene.  This component is also
 * a good example of combining the display component classes we have written, such as Gauge and
 * ProgressBar
 *
 * @author Linghua Jin, Jeff, Spoorthy
 * @since March 2013
 */
function UserPanel(director) {
  this.director = director;
  CAAT.ActorContainer.call(this);

  // name and level indicators in a vertical container
  this.userNameTActor = Util.createText("Name", 30 * sf);
  this.experienceTActor = Util.createText("Experience", 30 * sf);
  this.userLevelTActor = Util.createText("Lv", 20 * sf);
  this.progressBar = new ProgressBar(this.director).setImage("progressBarCt", 220 * sf, 30 * sf);
  this.userLevelTActor.centerAt(this.progressBar.width / 2, this.progressBar.height / 2);
  this.progressBar.addChild(this.userLevelTActor);
  var nameLevelCon = Util.createAlignContainerWithActor(true,
    [this.userNameTActor, this.experienceTActor, this.progressBar], 10 * sf);
  this.setBounds(0, 0, nameLevelCon.width, nameLevelCon.height);
  this.addChild(nameLevelCon);

  // low energy indicator
  //this.lowEnergy = Util.createImageActorInBound(this.director, "needle", 0.25 * W_, 10 * sf, 100 * sf, 100 * sf);
  //this.addChild(this.lowEnergy )

  this.gauge = new Gauge(this.director, 0, 100);
  this.gauge.setLocation(0.25 * W_, 10 * sf);
  this.addChild(this.gauge);

  // money indicator in a horizontal container
  var moneyGem = Util.createImageConInBound(this.director, "carrot", 0, 0, 80 * sf, 80 * sf);
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

  if (userInfo.money.getTotalGems() < 26) {
    //this.lowEnergy.setVisible(true); //cause a "low carrots - get food" actor to appear
  } else {
    //this.lowEnergy.setVisible(false); // cause a "low carrots - get food" actor to hide
  }
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
