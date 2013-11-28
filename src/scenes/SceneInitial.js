/**
 * The initial screen contains buttons and links to additional scenes.
 *
 * @author Jeff Risberg
 * @since November 2013
 */
SceneMgr.prototype.addSceneInitial = function (sceneName) {
  var that = this;

  var scene = this.createEmptyScene(sceneName);
  this.addBG(scene, "scnInitialBg");

  // layout
  var btnProfile = that.createButtonConSwitchScene("btnProfile", "sceneProfile", 0, 0, 2.4 * RBS_, RBS_);
  var btnPlay = that.createButtonConSwitchScene("btnPlay", "scenePlay", 0, 0, 2.4 * RBS_, RBS_);
  var btnShop = that.createButtonConSwitchScene("btnShop", "sceneShop", 0, 0, 2.4 * RBS_, RBS_);
  var menuCon = Util.createAlignContainerWithActor(VERTICAL, [btnProfile, btnPlay, btnShop], 10 * sf);
  menuCon.setLocation(W_ - btnShop.width - 10 * sf, 10 * sf);
  scene.addChild(menuCon);

  var logoUpper = Util.createImageActorInBound(this.director, "logoUpper", 0, 0, W_ * 0.5, H_ * 0.3)
    .enableEvents(false)
    .centerAt(menuCon.x / 2, H_ * 0.35);
  scene.addChild(logoUpper);

  var logoLower = Util.createImageActorInBound(this.director, "logoLower", 0, 0, W_ * 0.5, H_ * 0.4)
    .enableEvents(false)
    .centerAt(menuCon.x / 2, H_ * 0.60);
  scene.addChild(logoLower);

  var btnSetting = that.createButtonConPopCon("btnSetting", that.conSettings, scene, 0, 0, RBS_, RBS_);
  btnSetting.setLocation(10 * sf, H_ - btnSetting.height - 10 * sf);
  scene.addChild(btnSetting);

  CocoonJS.App.onLoadInTheWebViewSucceed.addEventListener(function () {
    that.isWebViewReady = true;
    var mobileOrWeb = Util.isMobileDevice(that.director) ? "MOBILE012" : "WEB";
  });

  /**
   * This is called by CAAT when the scene becomes the current scene
   */
  scene.activated = function () {
    that.commonDoWhenSceneStart();

    //spaceShip.addBehavior(path_behavior);
  };

  /**
   * This is called by CAAT when the scene stops being the current scene
   */
  scene.goOut = function () {
    a = 1; // meaningless statement so that we could put a breakpoint here
  }
};