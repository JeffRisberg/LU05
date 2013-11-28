// scene manager class
function SceneMgr(director) {
  this.director = director;

  var episodeInfo_;  // store all episodes in hash

  this.sceneNameToIndex = {};
  this.sceneNameToScene = {};
  this.sceneIndexToName = {};

  this.userInfo = new UserInfo(director);
  this.userInfo.userId = "User123";
  this.userInfo.initOthers();
  this.audioMgr = new AudioMgr();
  this.userPanel = new UserPanel(director);
  this.userPanel.resetAll(this.userInfo);

  var that = this;
  init();

  function init() {
    var song1 = {"bg": "sky",
      "bgImg": "africa",
      "length": 63,
      "songTitle": "Fluffing a Duck",
      "author": "Music by Kevin MacLeod"};

    var song2 = { "bg": "forestNight",
      "bgImg": "forest",
      "length": 35,
      "songTitle": "Jingle Bell",
      "price": 3,
      "author": "Music by Kevin MacLeod"
    };

    var songList = {}

    songList.FluffingADuck = song1;
    songList.JingleBell = song2;

    episodeInfo_ = songList;

    // User init to default
    that.sceneResetUserToDefault();
  }
}

SceneMgr.prototype.switchTo = function (sceneName) {
  var toSceneIndex = this.sceneNameToIndex[sceneName];
  if (toSceneIndex == undefined) {
    console.error("Scene name " + sceneName + " is undefined");
    return;
  }

  this.switchToIndex(toSceneIndex);
  this.director.activeCon = null;
};

SceneMgr.prototype.switchToIndex = function (index) {
  var prevSceneId = this.director.getCurrentSceneIndex();
  if (prevSceneId != this.sceneNameToIndex["sceneLoad"]) {
    this.prevSceneId = prevSceneId;
  }
  var newScene = this.sceneNameToScene[index];

  this.director.switchToScene(index);
};

/**
 * create scene, record total scene number and store in array
 */
SceneMgr.prototype.createEmptyScene = function (sceneName) {
  var scene = this.director.createScene().setLayout();

  // check defined before or not
  if (this.sceneNameToIndex[sceneName] != undefined) {
    console.error(sceneName + ' has been defined before, it will overwrite original value');
  }

  // scene index start from 0, so current scene index will be totalScene
  if (DEBUG_.sceneId) {
    console.log("set scene " + sceneName + ":" + this.director.getSceneIndex(scene));
  }
  var index = this.director.getSceneIndex(scene);
  this.sceneNameToIndex[sceneName] = index;
  this.sceneNameToScene[sceneName] = scene;
  this.sceneIndexToName[index] = sceneName;
  return scene;
};

/**
 * Add background to scene
 *
 * imageIndex is corresponding key that the image loads at beginning
 */
SceneMgr.prototype.addBG = function (scene, imageIndex) {
  var bg = Util.createImageActorInBound(this.director, imageIndex,
    0, 0, this.director.width, this.director.height);
  scene.addChild(bg);

  // If requested, add grid on screen to help coordinates
  if (DEBUG_.grid) {
    this.drawGrid(scene);
  }
};

SceneMgr.prototype.createButtonWithImageToScene = function (imageName, nextScene, additionFun) {
  var that = this;

  function pressDo() {
    that.switchTo(nextScene);
    additionFun();
  }

  var buttonImage = new CAAT.SpriteImage().initialize(that.director.getImage(imageName), 1, 1);
  var button = new CAAT.Actor().setAsButton(
    buttonImage.getRef(), 0, 0, 0, 0,function (button) {
      pressDo();
    }
  ).setLocation(0, 0);

  button.touchEnd = function (e) {
    pressDo();
  };

  return button;
};

SceneMgr.prototype.createButtonConSwitchScene = function (imageName, nextScene, x, y, w, h, additionalFunc) {
  var that = this;

  function pressDo() {
    if (additionalFunc) {
      additionalFunc();
    }
    that.switchTo(nextScene);
  }

  return Util.createButtonConWithImageFunInBound(that.director, imageName, pressDo, x, y, w, h);
};

// create button that will pop up container covering the whole scene when pressed
SceneMgr.prototype.createButtonConPopCon = function (imageName, createPopConFunc, scene, x, y, w, h, beforeFunc, func) {
  var that = this;

  function pressDo(e) {
    var actor = that.getActorFromEvent(e);
    if (beforeFunc) {
      if (!beforeFunc(e)) {
        return;
      }
    }
    // set it to a value before createPopConFun using it
    var topCon = createPopConFunc.call(that, scene, actor, func);
    scene.addChild(topCon);
  }

  return Util.createButtonConWithImageFunInBound(that.director, imageName, pressDo, x, y, w, h);
};

SceneMgr.prototype.createConBG = function () {
  var con = new CAAT.ActorContainer()
    .setBounds(0, 0, W_, H_)
    .setFillStyle("black")
    .setAlpha(0.85);
  this.director.activeCon = con;
  return con;
};

SceneMgr.prototype.createButtonConWithImageToSceneInBound = function (imageName, nextScene, x, y, w, h) {
  var that = this;

  function pressDo() {
    that.switchTo(nextScene);
  }

  return this.createButtonConWithImageFunInBound(imageName, pressDo, x, y, w, h);
};

SceneMgr.prototype.getActorFromEvent = function (e) {
  return e.source;
//  return Util.isMobileDevice(this.director) ? e.source : e;
};

SceneMgr.prototype.createButtonConWithImageFunInSize = function (imageName, pressDo, w, h, slider, scaleFactor) {

  var that = this;
  var pressDoNew;
  if (slider != undefined) {
    pressDoNew = function (e) {
      if (Math.abs(slider.currentSlideSpeed) > 0.5) {
        return;
      }
      var actor = (Util.isMobileDevice(that.director)) ? e.source : e;
      if (scaleFactor != undefined) {
        if (slider.lastTouchedActor) {
          slider.lastTouchedActor.setScale(1, 1);
        }
        actor.setScale(scaleFactor, scaleFactor);
      }
      slider.lastTouchedActor = actor;
      pressDo();
    }
  } else {
    pressDoNew = pressDo;
  }

  var button = new CAAT.Actor().setAsButton(this.director.getImage(imageName), 0, 0, 0, 0, pressDoNew);
  button.setSize(w, h);
  button.setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
  button.touchEnd = pressDoNew;

  var buttonCon = new CAAT.ActorContainer()
    .setSize(w, h)
    .addChild(button);

  if (DEBUG_.layout) {
    buttonCon.setFillStyle('blue');
  }

  return buttonCon;
};

SceneMgr.prototype.createButtonConWithImageFunHighlight = function (imageName, pressDo, w, h, slider, scaleFactor) {

  var that = this;
  var pressDoNew;
  if (slider != undefined) {
    pressDoNew = function (e) {
      if (Math.abs(slider.currentSlideSpeed) > 0.5) {
        return;
      }
      var actor = (Util.isMobileDevice(that.director)) ? e.source : e;
      if (slider.lastTouchedActor) {
        slider.lastTouchedActor.parent.childrenList[1].setVisible(false);
      }
      actor.parent.childrenList[1].setVisible(true);

      slider.lastTouchedActor = actor;
      pressDo();
    }
  } else {
    pressDoNew = pressDo;
  }

  var button = new CAAT.Actor().setAsButton(this.director.getImage(imageName), 0, 0, 0, 0, pressDoNew);
  button.setSize(w, h);
  button.setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
  button.touchEnd = pressDoNew;

  var frame = Util.createImageActorInBound(that.director, "highlightFrame", 0, 0,
    button.width, button.height);
  frame.setVisible(false);

  var buttonCon = new CAAT.ActorContainer()
    .setSize(w, h)
    .addChild(button)
    .addChild(frame);

  if (DEBUG_.layout) {
    buttonCon.setFillStyle('blue');
  }

  return buttonCon;
};

SceneMgr.prototype.createButtonConWithImageFunInBound = function (imageName, pressDo, x, y, w, h) {
  var that = this;

  //var button= new CAAT.Actor().setAsButton(t;his.director.get,0,0,0, pressDo);
  var button = new CAAT.Actor().setAsButton(this.director.getImage(imageName), 0, 0, 0, 0, pressDo);
//  button.setBackgroundImage(this.director.getImage(imageName), false);
  button.setSize(w, h);
  button.setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
  button.touchEnd = function (e) {
    pressDo();
  };

  var buttonCon = new CAAT.ActorContainer()
    .setBounds(x, y, w, h)
    .addChild(button);

  if (DEBUG_.layout) {
    buttonCon.setFillStyle('blue');
  }

  return buttonCon;
};

SceneMgr.prototype.createButtonWithImageFun = function (imageName, pressDo) {
  var buttonImage = new CAAT.SpriteImage().initialize(
    this.director.getImage(imageName), 1, 1);
  var button = new CAAT.Actor().setAsButton(
    buttonImage.getRef(), 0, 0, 0, 0, pressDo);
  button.touchEnd = pressDo;
  return button;
};

SceneMgr.prototype.createButtonWithFun = function (text, pressDo) {
  var director = this.director;
  var actor = Util.createButtonWithTextFun(text, pressDo);
  actor.centerAt(director.width - 40, director.height - 40);
  return actor;
};

SceneMgr.prototype.createButtonWithText = function (text, nextScene) {
  var that = this;

  function pressDo() {
    that.switchTo(nextScene);
  }

  return this.createButtonWithFun(text, pressDo);
};

// TODO: x: this has to be changed
SceneMgr.prototype.showText = function (text, x, y, scale) {
  var director = this.director;
  var scene = director.getCurrentScene();
  scale = scale || 1;

  var font = new CAAT.SpriteImage().
    initializeAsMonoTypeFontMap(
      director.getImage("fontScore0"),
      "0123456789,p+x-");

  var textActor = new CAAT.Foundation.UI.TextActor().
    setFont(font).
    setText(text + "").
    centerAt(x, y);

  var behavior = Util.createPumpBehavior(scale);
  behavior.addListener(
    {
      behaviorExpired: function (behaviour, time, actor) {
        actor.setDiscardable(true).setExpired(true);
      }
    }
  );
  textActor.addBehavior(behavior);

  scene.addChild(textActor);
  behavior.setDelayTime(0, 1000);
};

SceneMgr.prototype.showTextNoBehavior = function (text, x, y, size) {
  var font = size + "px sans-serif";
  var director = this.director;
  var scene = director.getCurrentScene();

  var styleLow = director.ctx.createLinearGradient(0, 0, 0, 30);
  styleLow.addColorStop(0, '#00ff00');
  styleLow.addColorStop(0.5, 'red');
  styleLow.addColorStop(1, 'blue');

  var textActor = new CAAT.Foundation.UI.TextActor().
    setFont(font).
    setTextFillStyle(styleLow).
    setText(text).
    setLineWidth(10).
    setSize(50, 50).
    centerAt(x, y);

  var createPumpBehavior2 = function () {
    var inter = new CAAT.Interpolator().createExponentialInOutInterpolator(2, false);

    var behaviorContainer = new CAAT.Behavior.ContainerBehavior();

    var scaling = new CAAT.ScaleBehavior().
      setFrameTime(0, 5000).
      setValues(1, 1, 1, 1, 1, 1).
      setInterpolator(inter);

    var disappear2 = new CAAT.AlphaBehavior().
      setFrameTime(0, 2000).
      setValues(1, 0).
      setInterpolator(inter);


    behaviorContainer.addBehavior(scaling);
    return behaviorContainer;
  };

  var behavior = createPumpBehavior2();
  behavior.addListener(
    {
      behaviorExpired: function (behaviour, time, actor) {
        actor.setDiscardable(true).setExpired(true);
      }
    }
  );
  textActor.addBehavior(behavior);

  scene.addChild(textActor);
  behavior.setDelayTime(0, 5000);
};

SceneMgr.prototype.createUserCon = function () {
};

SceneMgr.prototype.createAutoPopUp = function (msg) {
  new PopUp(this.director, this.director.getCurrentScene(), msg);
};

SceneMgr.prototype.createPopUp = function (msg) {
  new PopUp(this.director, this.director.getCurrentScene()).setInfoText(msg);
};

SceneMgr.prototype.commonDoWhenSceneStart = function () {
  //var scene = this.director.getCurrentScene();
  //Util.removeAllActorWithBehaviors(scene);

  if (!this.audioMgr.isBgPlaying()) {
    this.audioMgr.audio.pause();
  }

  if (this.userInfo.settings.getValue("Music")) {
    this.audioMgr.resetBgAudio();
  }
};

// add grid on screen to help coordinates
SceneMgr.prototype.drawGrid = function (scene) {
  var director = this.director;
  var bg = new CAAT.Actor().setBounds(0, 0, director.width, director.height);

  bg.paint = function (director, time) {
    var ctx = director.ctx;
    var w = director.width;
    var h = director.height;
    var i, r;
    var x;
    ctx.font = "10px Arial";
    ctx.strokeStyle = 'yellow';
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    var total = 10;
    for (i = 0; i < total - 1; i++) {
      x = w / total * (i + 1);
      r = (i + 1) / total;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.fillText(r + "", x + 10, 10);
      ctx.fillText(r + "", x + 10, h - 10);
    }
    total = 5;
    var y;
    for (i = 0; i < total - 1; i++) {
      y = h / total * (i + 1);
      r = (i + 1) / total;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.fillText(r + "", 0, y + 10);
      ctx.fillText(r + "", w - 20, y + 10);
    }
    ctx.stroke();
  };
  scene.addChild(bg);
};

SceneMgr.prototype.popUpAchieve = function (msg) {
  var that = this;
  Util.popUpAchieve(that.director, msg);
};

SceneMgr.prototype.conReturnCommonDo = function () {
  this.director.activeCon = null;
};

SceneMgr.prototype.sceneResetUserToDefault = function () {
  //this.userInfo.facebookInfo.resetUserToDefault();
  //this.sceneResetUser();
};

SceneMgr.prototype.sceneResetUser = function () {
  var that = this;
  that.userInfo.resetAll();
  that.userPanel.resetAll(that.userInfo);

  that.director.setSoundEffectsEnabled(that.userInfo.setting.getValue("Sound"));
};

SceneMgr.prototype.sceneResetNonUserRelated = function () {
  var that = this;
  //that.leaderboardData.updateFromServer();
};
