/**
 * The Play scene is a similar selector of an episode, and also updates user info.
 *
 * @param sceneName
 */
SceneMgr.prototype.addScenePlay = function (sceneName) {
  var that = this;

  var scene = this.createEmptyScene(sceneName);
  this.addBG(scene, "scnProfileBg");

  // add the back button
  var btnBack = that.createButtonConSwitchScene("btnBack", "sceneInitial", 10 * sf, 10 * sf, RBS_, RBS_);
  scene.addChild(btnBack);

  if (true /*DEBUG_.additionalButton*/) {
    function add50Gems() {
      that.userInfo.money.addGems(50);
      that.userPanel.resetAll(that.userInfo);
    }

    var bumpUpBtn = Util.createButtonWithTextFun("+50", add50Gems);
    bumpUpBtn.setLocation(W_ / 2 + 100 * sf, 80 * sf);
    scene.addChild(bumpUpBtn);

    function dec50Gems() {
      that.userInfo.money.addGems(-50);
      that.userPanel.resetAll(that.userInfo);
    }

    var bumpDownBtn = Util.createButtonWithTextFun("-50", dec50Gems);
    bumpDownBtn.setLocation(W_ / 2 + 50 * sf, 80 * sf);
    scene.addChild(bumpDownBtn);
  }

  // Create button with text and pressDo function
  function createEpisodeButton(episodeInfo, pressDo) {
    var fontSize = 20 * sf;
    var actor = new EpisodeActor(episodeInfo);
    var text = episodeInfo.name;

    actor.setSize(fontSize * (text.length / 2) + 10, 30);

    actor.paint = function (director, time) {
      var ctx = director.ctx;
      ctx.save();

      ctx.fillStyle = this.pointed ? 'orange' : 'green';
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.strokeStyle = this.pointed ? 'red' : 'black';
      ctx.strokeRect(0, 0, this.width, this.height);

      ctx.strokeStyle = 'white';
      ctx.font = fontSize + 'px sans-serif';

      ctx.fillStyle = 'black';
      ctx.fillText(text, 1, 22);

      ctx.restore();
    };

    actor.mouseClick = pressDo;
    actor.touchEnd = pressDo;

    return actor;
  }

  var episodeList = that.episodeMgr.getEpisodeList();
  var episodeBtns = [];

  for (var i in episodeList) {
    var episodeInfo = episodeList[i];

    function onClick(button) {
      var episodeInfo = button.source.getEpisodeInfo();

      console.log(episodeInfo);
      var avgGain = episodeInfo.avgGain;

      var delta = avgGain * (0.8 + Math.random() * 0.4);
      console.log(delta);

      that.userInfo.experience.expChange(that, delta);
      scene.addChild(that.conScore(scene));
    }

    var btn = createEpisodeButton(episodeInfo, onClick);
    episodeBtns.push(btn);
  }

  function resetExp() {
    var exp = that.userInfo.experience.getExp();
    that.userInfo.experience.expChange(that, -exp);
    that.userPanel.resetAll(that.userInfo);
  }

  var resetExpBtn = Util.createButtonWithTextFun("Reset Exp", resetExp);
  episodeBtns.push(resetExpBtn);

  var episodeBtnCon = Util.createAlignContainerWithActor(false, episodeBtns, 20);
  episodeBtnCon.setLocation(W_ * 0.25, H_ * 0.5);
  scene.addChild(episodeBtnCon)

  /**
   * Restore userPanel when we come back fron container scene
   */
  scene.backFromCon = function () {
    that.userPanel.showInCurrentScene(scene);
  };

  /**
   * This is called by CAAT when the scene becomes the current scene
   */
  scene.activated = function () {
    that.commonDoWhenSceneStart();

    that.userPanel.showInCurrentScene(scene);
  };

  /**
   * This is called by CAAT when the scene stops being the current scene
   */
  scene.goOut = function () {
    a = 3; // meaningless statement so that we could put a breakpoint here
  }
};
