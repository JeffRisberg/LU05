SceneMgr.prototype.addSceneGame = function (sceneName) {

  var that = this;
  var scene = this.createEmptyScene(sceneName);
  var audio;
  var userSetting = that.userInfo.setting;
  var userEquip = that.userInfo.equip;
  var director = that.director;
  var musicTimeOffset = 1.5; // second

  // background behind the road
  var bg;
  var countDownInitValue = 3;
  var objDeleteList = [];

  var startTimer;
  var countDown = 0;

  var heartIcon = Util.createImageActorWH(director, "heart", 32 * sf, 29 * sf);
  heartIcon.setLocation(W_ - 309 * sf, 16 * sf).setAlpha(0.9);//307

  var hpBar = that.hpBar;
  //hpBar.setImage("progressBarCt", 200*sf, 25*sf).centerAt(W_/2, H_-30*sf);
  hpBar.setImage("hpBarCt", 200 * sf, 22 * sf, "hpBarBg").setAlpha(0.8).setLocation(W_ - 300 * sf, 20 * sf);
  scene.addChild(hpBar);
  scene.addChild(heartIcon);
  var cancelFunList = [];

  var gameEndDo = function () {
    Util.showAd();
    startTimer.cancel();
    gameEngine.showCreatedNotes();
    audio.pause();
    gameEngine.setGameOn(false);
    bg.emptyBehaviorList();
    for (var i in cancelFunList) {
      cancelFunList[i]();
    }
    cancelFunList = [];
    that.scoreMgr.setScoreRelatedValueOnRunEnd();
  };

  function failedDo() {
    gameEndDo();
    switchByMode();
  }

  function switchByMode() {
    scene.addChild(that.conScore(scene));
    new PopUp(that.director, scene, "You are out of energy", "rabbitSad", 115 * sf, 150 * sf);
  }

  this.scoreMgr = new ScoreMgr(scene, that.director, that.episodeMgr,
    that.userInfo.score, that.userInfo.license, that.userInfo.level, hpBar, failedDo);
  var gameEngine = new GameEngine(scene, this.director,
    this.episodeMgr, this.audioMgr, this.spriteEngine, this.scoreMgr, that.userInfo.setting);
  this.gameMgr.gameEngine = gameEngine;

  // for test only
  function endDo() {
    gameEndDo();
    scene.addChild(that.conScore(scene));
  }

  var testT = Util.createButtonWithTextFun("score now", endDo);
  testT.setLocation(0, 100);
  if (DEBUG_.additionalButton) {
    scene.addChild(testT);
  }

  function testDo2() {
    that.gameMgr.isWholeRunEnd = true;
    gameEndDo();
    scene.addChild(that.conScore(scene));
  }

  var testT2 = Util.createButtonWithTextFun("pass test now", testDo2);
  testT.setLocation(0, 70);
  if (DEBUG_.additionalButton) {
    scene.addChild(testT2);
  }

  // all buttons
  function pressDo() {
    gameEndDo();
    return true;
  }

  var pauseGame = function () {
    audio.pause();
    gameEngine.setGameOn(false);
    return true;
  };
  var resumeGame = function () {
    audio.play();
    gameEngine.setGameOn(true);
  };
  var fun = {
    "resumeGame": resumeGame,
    "gameEndDo": gameEndDo
  };

  var buttonPause = that.createButtonConPopCon("pause", that.conPause, scene,
    5 * sf, 12 * sf, 55 * sf, 50 * sf, pauseGame, fun);
  scene.addChild(buttonPause);

  // add arrow buttons
  var buttonsImg = new CAAT.SpriteImage().initialize(
    this.director.getImage("buttons"), 2, 2);
  var buttonList = [
    createArrowButton(buttonsImg, "UL", gameEngine),
    createArrowButton(buttonsImg, "L", gameEngine),
    createArrowButton(buttonsImg, "UR", gameEngine),
    createArrowButton(buttonsImg, "R", gameEngine),
    createArrowButton(buttonsImg, "DL", gameEngine),
    createArrowButton(buttonsImg, "DR", gameEngine)

  ];
  var lowerConLInner = Util.createAlignContainerWithActor(VERTICAL, [buttonList[0], buttonList[4]], 0);

  var lowerConL = Util.createAlignContainerWithActor(HORIZONTAL, [buttonList[1], lowerConLInner], 0);
  lowerConL.setLocation(0, H_ - lowerConL.height);
  var lowerConRInner = Util.createAlignContainerWithActor(VERTICAL, [buttonList[2], buttonList[5]], 0);
  var lowerConR = Util.createAlignContainerWithActor(HORIZONTAL, [lowerConRInner, buttonList[3]], 0);
  lowerConR.setLocation(W_ - lowerConR.width, H_ - lowerConR.height);
  scene.addChild(lowerConL).addChild(lowerConR);

  addKeyboard(gameEngine, that.director, scene);

  // running in background listener
  CocoonJS.App.onActivated.addEventListener(function () {
    // check if music setting is off, if it is, disable music, otherwise it will auto play
    if (!userSetting.getValue("Music")) {
      that.audioMgr.audio.pause();
    }
    if (that.director.getCurrentSceneIndex() == that.sceneNameToIndex["sceneGame"] && !director.activeCon) {
      if (that.prevSceneId) {
        gameEndDo();
        that.status = "backgroundRun";
        that.switchToIndex(that.prevSceneId);
      } else {
        console.error("Shouldn't happen: go to scene game but previous is null")
      }
    }
  });

  // doesn't work
  CocoonJS.App.onSuspended.addEventListener(function () {
  });

  var bgMove;
  var bg2;
  var bgMove2;

  var groundH = gameEngine.getHighestPoint() - 1 * sf;

  var roadBG;
  scene.addChildAt(gameEngine.actor, 0);
  var seCAAT = new SpriteEngineCAAT(scene, director, roadBG, scene);

  function createArrowButton(buttonsImg, dir, gameEngine) {

    var baseNum = 0;
    var dir2 = dir;
    var size = 150 * sf;//TODO:set it in usersetting, we migt offer two btn sizes.
    switch (dir) {
      case "UR":
        baseNum = 2;
        dir2 = "U";
        break;
      case "UL":
        baseNum = 2;
        dir2 = "U";
        break;
      case "L":
        baseNum = 0;
        break;
      case "R":
        baseNum = 1;
        break;
      case "DR":
        baseNum = 3
        dir2 = "D";
        break;
      case "DL":
        baseNum = 3;
        dir2 = "D";
        break;
    }

    var button = new CAAT.Actor().setAsButton(
      buttonsImg.getRef(), baseNum, 0, 0, 0,function (button) {
      }
    ).setSize(size, size)
      .setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE)
      .setAlpha(0.6);
    button.mouseDown = function (button) {
      gameEngine.detectHit(dir2);
    };
    button.mouseUp = function (button) {
      gameEngine.playerResetRun();
      gameEngine.detectHitUp();
    };
    button.touchStart = function (e) {
      gameEngine.detectHit(dir2);
    };
    button.touchEnd = function (e) {
      gameEngine.playerResetRun();
      gameEngine.detectHitUp();
    };

    return button;
  }

  function applyButtonSetting() {
    var i;
    if (userSetting.getValue("ArrowControl")) {
      for (i in buttonList) {
        buttonList[i].setAlpha(0.6);//TODO:put inside somewhere no hard code
      }
    } else {
      for (i in buttonList) {
        buttonList[i].setAlpha(0);
      }

    }
  }

  function addPositionBar() {
    if (!userSetting.getValue("DisplayPosition")) {
      return false;
    }

    var w = 145 * sf;
    var h = 18 * sf;
    var pinSize = 20 * sf;
    var pinX = -pinSize / 2 + 1 * sf;
    var pinY = -4 * sf

    var positionBarCon = Util.createImageConWH(director, "pinBkg", w, h).enableEvents(false);
    var pointActor = Util.createImageActorWH(director, "pinPoint", pinSize, 25 * sf);
    pointActor.setLocation(pinX, pinY);
    positionBarCon.addChild(pointActor);
    var bh = Util.createTranslationBehavior(pinX, pinY, w + pinX, pinY);

    bh.setFrameTime(scene.time + (countDownInitValue + 1) * 1000,
      (audio.duration + musicTimeOffset) * 1000);
    pointActor.addBehavior(bh);

    objDeleteList.push(positionBarCon);
    //positionBarCon.setLocation(W_ - 300*sf, 20*sf);
    positionBarCon.setLocation(69 * sf, 31 * sf);
    scene.addChild(positionBarCon);
    return true;
  }

  function addEquipInfo() {
    var talentActorList = [];
    var itemActorList = [];
    var imageSize = 50 * sf;
    var actor;
    var image, i;
    // talent
    var buttonTalentGroup = userEquip.getButtonTalentGroup();
    for (i in buttonTalentGroup) {
      image = userEquip.getValue(buttonTalentGroup[i]);
      if (image) {
        actor = Util.createImageActorWH(director, image, imageSize * 0.7, imageSize * 0.7);
        actor.setAlpha(0.8).enableEvents(false);
        talentActorList.push(actor);
      }
    }

    var talentCon = Util.createAlignContainerWithActor(HORIZONTAL, talentActorList, 0);
    talentCon.setLocation(W_ - 300 * sf, 40 * sf);
    objDeleteList.push(talentCon);
    scene.addChild(talentCon);

    // don't add item if license mode
    if (that.episodeMgr.isExam()) {
      return;
    }

    //item btns
    var buttonItemGroup = userEquip.getButtonItemGroup();
    for (i in buttonItemGroup) {
      var buttonItemName = buttonItemGroup[i];
      image = userEquip.getValue(buttonItemName);
      if (image) {
        actor = createOneItemActor(image, buttonItemName);
        itemActorList.push(actor);
      }
    }

    //var itemCon = Util.createAlignContainerWithActor(HORIZONTAL, itemActorList, 0);
    if (itemActorList[0]) {
      itemActorList[0].setLocation(10 * sf, H_ - 360 * sf);
      scene.addChild(itemActorList[0]);
      objDeleteList.push(itemActorList[0]);
    }
    if (itemActorList[1]) {
      itemActorList[1].setLocation(W_ - 130 * sf, H_ - 360 * sf);
      scene.addChild(itemActorList[1]);
      objDeleteList.push(itemActorList[1]);
    }
    //objDeleteList.push(itemCon);
  }

  function createOneItemActor(image, buttonItemName) {
    var itemImageSize = 100 * sf;
    // TODO:X: for duration effect show different pic/behavior
    var pressDo = function (e) {
      actor.enableEvents(false);
      itemTarget.actor = actor;
      Util.addBehaviorFlashing(actor, scene);
      userEquip.applyItemEffect(image, itemTarget, buttonItemName);
    };
    var actor = Util.createButtonWithImageFunWH(director, image, pressDo, itemImageSize, itemImageSize);
    actor.setAlpha(0.9);
    return actor;
  }

  function addOtherButtons() {
    addPositionBar();
    addEquipInfo();
  }

  var itemTarget = {
    cancelFunList: cancelFunList,
    scoreMgr: that.scoreMgr,
    hpBar: hpBar
  };

  function checkIsLevelNotFit() {
    if (that.episodeMgr.difficulty == 0) {
      return false;
    }
    var userLevelNum = that.userInfo.level.getLevel();
    if (that.episodeMgr.difficulty == 1) {
      if (userLevelNum >= 8) {
        return false;
      }
      return true;
    }

    if (that.episodeMgr.difficulty == 2) {
      if (userLevelNum >= 15) {
        return false;
      }
      return true;
    }
  }

  scene.activated = function () {
    Util.hideAd();
    buttonPause.setVisible(false);
    audio = that.audioMgr.audio;
    // that.commonDoWhenSceneStart();
    // before counting down
    if (that.gameMgr.mode == "exam") {
      testT.setVisible(false);
      testT2.setVisible(true);
    } else {
      testT2.setVisible(false);
      testT.setVisible(true);
    }
    hpBar.setPercent(1);
    that.scoreMgr.mode = that.gameMgr.mode;
    applyButtonSetting();

    addOtherButtons();

    //audio.currentTime = 0
    countDown = countDownInitValue + 1; // 3 second count down;

    roadBG = Util.createImageActorInBound(that.director, "SG_road", 0, groundH, W_, H_ - groundH);
    scene.addChildAt(roadBG, 0);

    bg = Util.createImageActorInBound(that.director, "SG_background",
      0, 0, W_, groundH);
    scene.addChildAt(bg, 0);
    addMoveBh(bg);

    gameEngine.setMode(that.gameMgr.mode);
    gameEngine.startDraw();
    that.gameMgr.isWholeRunEnd = false;

    // need to set after starDraw();
    that.scoreMgr.setIsLevelNotFit(checkIsLevelNotFit());

    // create timer for one run to end
    var musicInfo = that.episodeMgr.currentEpisodeInfo().music;
    audio.addEventListener('ended', function () {
      // delay then end
      setTimeout(function () {
        that.gameMgr.isWholeRunEnd = true;
        endDo();
      }, musicTimeOffset);
    });

    // count down timer
    startTimer = scene.createTimer(
      scene.time,
      1000,
      function (scene_time, timer_time, timertask_instance) {   // timeout
        countDown--;
        if (countDown <= 0) {
          gameEngine.setGameOn(true);
          buttonPause.setVisible(true);
          if (userSetting.getValue("GameMusic")) {
            audio.play();
          }
          // move bg
          startBh(bg);

          return;
        }
        that.showText(countDown, W_ / 2, H_ * 0.2, 3);
        if (userSetting.getValue("GameMusic")) {
          that.audioMgr.beepAudio.play();
        }
        timertask_instance.reset(scene_time);
      },
      function (scene_time, timer_time, timertask_instance) {   // tick
      },
      function (scene_time, timer_time, timertask_instance) {   // cancel
      }
    );

    // end scene

    // create bg move behavior
    function addMoveBh(bg, goRight) {
      var delta = -W_ / 2;
      if (goRight) {
        delta = W_ / 2;
      }
      var path = new CAAT.PathUtil.LinearPath().
        setInitialPosition(bg.x, bg.y).
        setFinalPosition(bg.x + delta, bg.y);
      //setFinalPosition(bg.x - w, bg.y);
      var bh = new CAAT.PathBehavior().
        setPath(path).
        setCycle(true);
      var bhScale = new CAAT.ScaleBehavior().
        setValues(1, 2, 1, 1, 0.5, 0.5).//set bg Scale
        setCycle(true);
      bg.addBehavior(bhScale);
    }

    // start behavior on bg, assume only one behavior
    function startBh(bg) {
      bg.getBehavior(0).setFrameTime(scene.time, 30000);
    }
  };

  scene.goOut = function () {
    // remove background
    Util.destroyObj(bg);
    Util.destroyObj(roadBG);
    for (var i in objDeleteList) {
      Util.destroyObj(objDeleteList[i]);
    }
//    Util.destroyActor(bgMove);
  };
};

function addKeyboard(gameEngine, director, scene) {
  CAAT.registerKeyListener(function (key) {
    if (director.getCurrentScene() != scene) {
      return;
    }
    if (key.action == "up") {
      gameEngine.playerResetRun();
      gameEngine.detectHitUp();
      return;
    }
    if (key.action == "down") {
      var dir = "U";
      switch (key.keyCode) {
        case 37:
          dir = "L";
          break;
        case 38:
          dir = "U";
          break;
        case 39:
          dir = "R";
          break;
        case 40:
          dir = "D";
          break;
        default:
          dir = null;
      }
      if (dir != null) {
        gameEngine.detectHit(dir);
      }
    }
  });
}


