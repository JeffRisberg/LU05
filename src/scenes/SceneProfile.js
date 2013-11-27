/**
 * The profile screen is reached from the initial screen, and shows user info.
 *
 * @author Spoorthy
 * @since November 2013
 */
SceneMgr.prototype.addSceneProfile = function (sceneName) {
  var that = this;

  var scene = this.createEmptyScene(sceneName);
  this.addBG(scene, "scnProfileBg");

  // add the back button
  var btnBack = that.createButtonConSwitchScene("btnBack", "sceneInitial", 10 * sf, 10 * sf, RBS_, RBS_);
  scene.addChild(btnBack);

  // add the title
  var title = Util.createImageActorInBound(this.director, "scnProfileTitle", W_ * 0.2, H_ * 0.4, 300, 100)
    .enableEvents(false);
  scene.addChild(title);

  var moneyGem = Util.createImageConInBound(this.director, "pointsImg", 0, 0, 50 * sf, 50 * sf);
  this.moneyGemText = Util.createText("0", 40 * sf);
  var moneyCon = Util.createAlignContainerWithActor(false, [moneyGem, this.moneyGemText], 0);
  moneyCon.setLocation(0.55 * W_, 10 * sf);//location for money
  scene.addChild(moneyCon);

  this.waterActor = Util.createText("Water", 30 * sf);
  this.waterLevelActor = Util.createText("Goal 2013", 20 * sf);

  this.progressBarWater = new ProgressBar(this.director).setImage("progressBarCt", 220 * sf, 30 * sf);
  this.waterLevelActor.centerAt(this.progressBarWater.width / 2, this.progressBarWater.height / 2);
  this.progressBarWater.setPercent(0.5);
  this.progressBarWater.addChild(this.waterLevelActor);

  var conVerticalWater = Util.createAlignContainerWithActor(true,
    [this.waterActor, this.progressBarWater], 10 * sf);
  conVerticalWater.setBounds(160 * sf, 20 * sf, conVerticalWater.width, conVerticalWater.height);
  scene.addChild(conVerticalWater);


  this.materialsActor = Util.createText("Material", 30 * sf);
  this.materialsLevelActor = Util.createText("Goal 2013", 20 * sf);


  this.progressBarMaterial = new ProgressBar(this.director).setImage("progressBarCt", 220 * sf, 30 * sf);
  this.materialsLevelActor.centerAt(this.progressBarMaterial.width / 2, this.progressBarMaterial.height / 2);
  this.progressBarMaterial.setPercent(0.8);
  this.progressBarMaterial.addChild(this.materialsLevelActor);

  var conVerticalMaterial = Util.createAlignContainerWithActor(true,
    [this.materialsActor, this.progressBarMaterial], 10 * sf);
  conVerticalMaterial.setBounds(160 * sf, 100 * sf, conVerticalMaterial.width, conVerticalMaterial.height);
  scene.addChild(conVerticalMaterial);


  /**
   * This is called by the CAAT when the scene becomes the current scene
   */
  scene.activated = function () {
    that.commonDoWhenSceneStart();
  };

  /**
   * This is called by CAAT when the scene stops being the current scene
   */
  scene.goOut = function () {
    a = 3; // meaningless statement so that we could put a breakpoint here
  }
};

