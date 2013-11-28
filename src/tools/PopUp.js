/**
 * User: Niu Niu
 * Date: 3/10/13
 * All rights reserved by Africa Swing
 */
/*
 * isInQueue: when create new pop up, push it to queue or not regarding to other current popups
 * */
function PopUp(director_, scene, msg_, image, imageW_, imageH_, buttonsArray, isDirectPopUp) {
  CAAT.ActorContainer.call(this);
  this.timeToHoldBeforeBehavior = 1500;
  var that = this;
  var image_ = image || "popUpDefaultNoticeImg";
  imageW_ = imageW_ || 150 * sf;
  imageH_ = imageH_ || 150 * sf;
  this.isDirectPopUp = isDirectPopUp || false;
  var bgShadowSize_ = 25 * sf;
  var tapCloseBG_;
  this.scene = scene;
  this.director = director_;
  this.isAutoClose = false;
  this.buttonW = 150 * sf;
  this.buttonH = 40 * sf;
  this.innerPadding = 20 * sf;
  this.wMin = this.buttonW + 100 * sf;

  this.isFull = true;
  this.width = W_;
  this.height = H_;
  this.setFillStyle('black').setAlpha(0.8).setBounds(0, 0, W_, H_);

  this.inner = new CAAT.ActorContainer().setLayout(
    new CAAT.Foundation.UI.Layout.BorderLayout().setAllPadding(this.innerPadding)
  );
  this.buttonCon = Util.createAlignContainer();
  Util.changeLayoutAlign(this.buttonCon.getLayout(), "CENTER", "CENTER");


  if (DEBUG_.layout) {
    this.inner.setFillStyle('blue');
  }
  this.addChild(this.inner);

  if (!PopUp.activeList.hasOwnProperty(scene) || PopUp.activeList[scene].length == 0) {
    if (!PopUp.activeList.hasOwnProperty(scene)) {
      PopUp.activeList[scene] = [];
    }
    this.addToScene();
  }
  if (this.isDirectPopUp) {
    PopUp.activeList[scene].push(this);
  }
  function addTapCloseButton(con) {
    var closeBehavior;
    closeBehavior = new CAAT.Scale1Behavior().
      setFrameTime(that.scene.time, 500).
      setValues(1, 0, 1, 0, 0.5, 0.5).
      addListener({
        behaviorExpired: function (behavior, time, actor) {
          that.closeDo();
        }
      });

    var notScaleWhenPressed = true;
    tapCloseBG_ = Util.createButtonConWithImageFunWH(director_, "bgNotification", pressDo, con.width + bgShadowSize_ + 50 * sf, con.height + bgShadowSize_, notScaleWhenPressed);
    tapCloseBG_.centerAt(that.width / 2, that.height / 2 + 25 * sf);
    function pressDo() {
      tapCloseBG_.addBehavior(closeBehavior);
    }

    that.addChild(tapCloseBG_, 0);
    tapCloseBG_.addChild(con);
    con.centerAt(tapCloseBG_.width / 2, tapCloseBG_.height / 2);
  }

  function createContent() {

    var imageActor = Util.createImageActorWH(director_, image_, imageW_, imageH_);
    imageActor.enableEvents(false);
    var msgActor = new WrapFont(msg_, 30 * sf).setSize(300 * sf, 300 * sf);
    msgActor.enableEvents(false).cacheAsBitmap().setAlignCenterV();
    var buttonCon = Util.createAlignContainerWithActor(VERTICAL, buttonsArray, 20 * sf);

    //TODO: needs to adjust layout

    var con = Util.createAlignContainerWithActor(HORIZONTAL, [imageActor, msgActor, buttonCon], 50 * sf);
    Util.changeLayoutAlignOnActor(con, "center", "center");

    if (buttonsArray) {
      con.enableEvents(true);
    } else {
      con.enableEvents(false);
    }
    addTapCloseButton(con);
  }

  createContent();
  this.setInQueue(true);

  return this;
}

PopUp.prototype = new CAAT.ActorContainer();
PopUp.prototype.constructor = PopUp;

PopUp.activeList = {};


PopUp.prototype.setInQueue = function (isInQueue) {
  if (isInQueue) {
    return;
  }
  var activeListScene = PopUp.activeList[this.scene];
  var index = activeListScene.indexOf(this);
  activeListScene.splice(index, 1);
  if (!this.parent) {
    this.scene.addChild(this);
  }
};

PopUp.prototype.addToScene = function () {

  var that = this;

  /*
   var closeBehavior;
   if (!this.isAutoClose) {
   closeBehavior = new CAAT.Scale1Behavior().
   setFrameTime(that.scene.time, 100).
   setValues(0,1,0,1,0.5,0.5).
   addListener({
   behaviorExpired: function(behavior, time, actor) {
   that.closeDo();
   }
   });
   } else {
   closeBehavior = new CAAT.ScaleBehavior().
   setFrameTime(that.scene.time + that.timeToHoldBeforeBehavior, 100).
   setValues(1, 1, 1, 0.1, 0.5, 0.5).
   addListener({
   behaviorExpired: function(behavior, time, actor) {
   that.closeDo();
   }
   });
   }
   this.inner.addBehavior(closeBehavior);
   */

  this.scene.addChild(this);

};

PopUp.prototype.setSizeMy = function (w, h) {
  this.inner.setSize(w, h);
  if (!this.isFull) {
    this.setSize(w, h);
  } else {
    this.inner.centerAt(this.width / 2, this.height / 2);
  }

  if (this.buttonCon) {
    this.buttonCon.setSize(w, h / 4);
  }
};

PopUp.prototype.setInfoText = function (msg) {
  var size = 30;
  var charSize = size - 5;
  var ratioMin = 3;
  var ratioMax = 5;
  var charLength = size * 0.6;
  var msgLines = msg.split("<br>");
  var maxWidth = 0;
  for (var i in msgLines) {
    var eachLine = msgLines[i];
    maxWidth = Math.max(maxWidth, eachLine.length);
  }

  var height = 0;

  function calRatio(width, msgLines) {
    height = 0;
    for (var i in msgLines) {
      var eachLine = msgLines[i];
      height += Math.ceil(eachLine.length / width);
    }
    return (width * charLength) / (height * size);
  }

  var width = maxWidth;
  var lastWidth = 0;
  while (1) {
    var ratio = calRatio(width, msgLines);
    if (ratio > ratioMax) {
      lastWidth = width;
      width = width / 2;
      if (!this.isAutoClose && width * charLength < this.wMin) {
        break;
      }
      continue;
    }
    if (ratio < ratioMin) {
      if (lastWidth < width) {
        break;
      }
      width = Math.ceil((lastWidth + width) / 2);
      continue;
    }
    break;
  }

  if (!this.isAutoClose) {
    width = Math.max(width * charLength, this.wMin);
    height += 1;
  } else {
    width = width * charLength;
  }
  height = height * size;
  var label = Util.createLabel(msg, width, height, charSize);
  this.setInfo(label);
};

// set any actor to info container, also calculate the size of inner container
PopUp.prototype.setInfo = function (infoActor) {
  var that = this;
  var w;
  if (!this.isAutoClose) {
    w = Math.max(infoActor.width, this.wMin);
  } else {
    w = infoActor.width;
  }

  this.infoCon = Util.createAlignContainer(true);
  this.infoCon.setSize(w, infoActor.height);
  this.infoCon.addChild(infoActor);

  if (!this.isAutoClose) {
    this.buttonCon.setSize(w, this.buttonH);

    this.inner.setSize(w,
      this.infoCon.height + this.buttonCon.height + this.innerPadding * 2);
    this.inner.centerAt(this.width / 2, this.height / 2);
  } else {
    this.inner.setBounds(0, 0, w,
      this.infoCon.height + this.innerPadding * 2);
    this.setSize(w,
      this.infoCon.height + this.innerPadding * 2);
    this.centerAt(this.scene.width / 2, this.scene.height / 2);
  }

  if (!this.isAutoClose) {
    this.createCloseButton();
  }

  this.inner.setBackgroundImage(this.director.getImage("lockBg"), false)
    .setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);

  if (!this.isAutoClose) {
    this.inner.addChild(this.buttonCon, "bottom");
    this.inner.addChild(this.infoCon, "top");
  } else {
    this.infoCon.centerAt(this.inner.width / 2 + this.innerPadding, this.inner.height / 2);
    this.inner.addChild(this.infoCon);
  }

  this.isInfoAdded = true;

  return this;

};

PopUp.prototype.setLayoutMy = function (layout) {
  this.inner.setLayout(layout);
};

PopUp.prototype.createCloseButton = function () {
  this.closeButton = Util.createImageActorInBound(this.director, "ok", 0, 0, this.buttonW, this.buttonH);
  this.addCloseButton(this.closeButton);
};

PopUp.prototype.addCloseButton = function (actor) {
  var that = this;
  this.buttonCon.addChild(actor);
  function pressDo() {
    that.closeDo();
  }

  actor.mouseClick = pressDo;
  actor.touchEnd = pressDo;
};

PopUp.prototype.closeDo = function () {
  var that = this;
  var activeListScene = PopUp.activeList[that.scene];
  activeListScene.splice(0, 1);
  Util.destroyObj(that);
  if (activeListScene.length >= 1 && !this.isDirectPopUp) {
    activeListScene[0].addToScene();
  }
};


PopUp.prototype.addInButtonCon = function (actor) {

  if (this.isInfoAdded) {
    console.error("PopUp Error: addInButtonCon must be before setInfo");
  }
  /*
   if (this.buttonCon.findChild(this.closeButton) != -1) {
   this.buttonCon.removeChild(this.closeButton);
   }
   */
  this.wMin += actor.width + 50;
  this.buttonCon.addChild(actor);
};
