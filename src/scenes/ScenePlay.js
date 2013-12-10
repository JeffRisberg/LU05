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

    function attack_the_troll() {
        that.userInfo.experience.expChange(that, -50 + Math.floor(150 * Math.random()));
        //that.userPanel.resetAll(that.userInfo);
        // bring up conScore
        scene.addChild(that.conScore(scene));
    }



    function attack_the_ogre() {
        that.userInfo.experience.expChange(that, -450 + Math.floor(1500 * Math.random()));
        //that.userPanel.resetAll(that.userInfo);
        // bring up conScore
        scene.addChild(that.conScore(scene));
    }



    function attack_the_dragon() {
        that.userInfo.experience.expChange(that, -900 + Math.floor(2000 * Math.random()));
        //that.userPanel.resetAll(that.userInfo);
        // bring up conScore
        scene.addChild(that.conScore(scene));
    }

  //

    var episodeList = that.episodeMgr.getEpisodeList();
    var i;
    var episodeBtn = [];

    for (i in episodeList) {
        var episodeInfo = episodeList[i];

        function onClick(){
                 console.log(episodeInfo.name);
        }

         episodeBtn[i] =   Util.createButtonWithTextFun(episodeInfo.name, onClick) ;
    }

    var episodeBtnCon = Util.createAlignContainerWithActor(true, episodeBtn, 20);
    episodeBtnCon.setLocation(W_ * 0.5, H_ * 0.5);
    scene.addChild(episodeBtnCon)

  function resetExp() {
    var exp = that.userInfo.experience.getExp();
    that.userInfo.experience.expChange(that, -exp);
    //that.userPanel.resetAll(that.userInfo);
    scene.addChild(that.conScore(scene));
  }

  var resetExpBtn = Util.createButtonWithTextFun("Reset Exp", resetExp);
  resetExpBtn.setLocation(W_ * 0.5, H_ * 0.5 + 150);
  scene.addChild(resetExpBtn);

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
