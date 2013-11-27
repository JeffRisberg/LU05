/**
 * General purpose helpers, first Math, then CAAT, then Coccoon
 *
 * @author various
 * @since early 2013
 */

var Util = {

  prob: function (threshold) {
    return (Math.random() < threshold);
  },

  percentRemaining: function (n, total) {
    return (n % total) / total;
  },
  interpolate: function (a, b, percent) {
    return a + (b - a) * percent
  },

  createHashFromArray: function (array, key) {
    var hash = {};
    for (var i in array) {
      hash[array[i][key]] = array[i];
    }
    return hash;
  },

  limit: function (value, min, max) {
    return Math.max(min, Math.min(value, max));
  },

  // assume array is sorted.
  findNearestInArray: function (array, value, dir) {
    var dir_ = dir || 0;
    var absDisMin = 999999; // should be same , max pixel should be smaller this
    var index = 0;
    for (var i in array) {
      var absCur = Math.abs(array[i] - value);
      if (absCur < absDisMin) {
        absDisMin = absCur;
        index = i;
      } else {
        break;
      }
    }
    if (dir_ != 0) {
      var leftIndex = 0, rightIndex = array.length;
      // the array is inverted (big to small)
      if (value >= array[index]) {
        leftIndex = index - 1;
        rightIndex = index;
      } else {
        leftIndex = index;
        // index in for loop is a string
        rightIndex = index - (-1);
      }
      // check limit
      if (leftIndex < 0) {
        leftIndex = 0
      }
      if (rightIndex >= array.length) {
        rightIndex = array.length - 1;
      }

      if (dir_ == -1) {
        return leftIndex;
      }
      else {
        return rightIndex;
      }
    }
    return index;
  },

  isInt: function (n) {
    if (typeof n === 'number' && n % 1 == 0) {
      //console.error("not float " + n);
      return true;
    } else {
      return false;
    }
  },

  timestamp: function () {
    return new Date().getTime();
  },

  isTrialVersion: function () {
    return ABC_;
  },

  isFacebookOn: function () {
    return 1;
  },

  genRandColor: function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  },

  myEnum2: function (arrString) {
    for (var i = 0; i < arrString.length; i++) {
      window[arrString[i]] = i;
    }
  },

  getRandomInt: function (min, max) {
    return Math.round(Util.interpolate(min, max, Math.random()));
  },

  findValueIndexInRange: function (value, range) {
    for (var i = 0; i < range.length - 1; i++) {
      if (value <= range[i] && value > range[i + 1]) {
        return i;
      }
    }
    console.error("Cannot find " + value + " in " + range);
    return -1;
  },

  getObjInfo: function (object) {
    var output = "";
    for (var property in object) {
      output += property + ': ' + object[property] + '; ';
    }
    return output
  },

  increase: function (start, increment, max) { // with looping
    var result = start + increment;
    if (result >= max) {
      result = result % max;
    }
    if (result < 0) {
      result = result % max + max;
    }
    return result;
  },

  setIntervalWithTotal: function (interval, total, fun) {
    var count = 0;

    function intervalDo() {
      count++;
      fun();
      if (count >= total) {
        clearInterval(intervalId);
      }
    }

    var intervalId = setInterval(intervalDo, interval);
    return intervalId;
  },

  project: function (p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    p.screen.w = Math.round((p.screen.scale * roadWidth * width / 2));
  },

  overlap: function (x1, w1, x2, w2, percent) {
    var half = (percent || 1) / 2;
    var min1 = x1 - (w1 * half);
    var max1 = x1 + (w1 * half);
    var min2 = x2 - (w2 * half);
    var max2 = x2 + (w2 * half);
    return !((max1 < min2) || (min1 > max2));
  },

  ////////////////////////////////////////////
  // CAAT Helper
  ////////////////////////////////////////////

  // create an actor with image scaled in given w,h
  // default location 0,0
  createImageActorWH: function (director, imageIndex, w, h) {
    var actor = new CAAT.Actor()
      .setBackgroundImage(director.getImage(imageIndex), false/*resize to image's size*/)
      .setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE)
      .setSize(w, h);
    return actor;
  },

  // create an actor with image scaled in given bound x,y,w,h
  // image should be cached in the director first
  // also the image is scaled, so original scale factor is needed
  createImageActorInBound: function (director, imageIndex, x, y, w, h) {
    var actor = Util.createImageActorWH(director, imageIndex, w, h).setLocation(x, y);
    return actor;
  },

  createImageConWH: function (director, imageIndex, w, h) {
    var actor = Util.createImageActorWH(director, imageIndex, w, h);
    var actorContainer = new CAAT.ActorContainer()
      .setGlobalAlpha(true)
      .setSize(w, h);
    actorContainer.addChild(actor);
    return actorContainer;
  },

  createImageConInBound: function (director, imageIndex, x, y, w, h) {
    var actorContainer = Util.createImageConWH(director, imageIndex, w, h);
    actorContainer.setLocation(x, y);
    return actorContainer;
  },

  // TODO: direct use this function may not be able to find correct e/event
  createButtonBehavior: function (director, button, pressDo, notDoScale) {
    var pushSize = 0.9;
    notDoScale = notDoScale || false;

    button.mouseDown = function () {
      director.audioPlay("btnSound");
      if (notDoScale) {
        return;
      }
      button.setScale(pushSize, pushSize)
    };
    button.mouseClick = pressDo;
    button.mouseUp = function () {
      button.setScale(1, 1)
    };
    button.touchStart = button.mouseDown;
    button.touchEnd = function (e) {
      if (notDoScale) {
        pressDo(e);
        return;
      }
      button.setScale(1, 1);
      //pressDo(e);
      setTimeout(function () {
        pressDo(e);
      }, 10);
    };
  },

  createButtonWithImageFunWH: function (director, imageName, pressDo, w, h, notDoScale) {
    var button = new CAAT.Actor().setAsButton(director.getImage(imageName), 0, 0, 0, 0, function () {
    });
//  button.setBackgroundImage(this.director.getImage(imageName), false);
    button.setSize(w, h);
    button.setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
    Util.createButtonBehavior(director, button, pressDo, notDoScale);
    return button;
  },

  createButtonConWithImageFunWH: function (director, imageName, pressDo, w, h, notDoScale) {
    var button = Util.createButtonWithImageFunWH(director, imageName, pressDo, w, h, notDoScale);
    var buttonCon = new CAAT.ActorContainer()
      .setSize(w, h)
      .addChild(button);

    if (DEBUG_.layout) {
      buttonCon.setFillStyle(Util.genRandColor()).setAlpha(0.3);
    }

    return buttonCon;
  },

  createButtonConWithImageFunInBound: function (director, imageName, pressDo, x, y, w, h) {
    var buttonCon = Util.createButtonConWithImageFunWH(director, imageName, pressDo, w, h);
    buttonCon.setLocation(x, y);
    return buttonCon;
  },

  checkActorConError: function (actor) {
    if (actor instanceof CAAT.ActorContainer) {
      console.error("actor is container");
    }
  },

  changeActorPressDo: function (actor, pressDo) {
    actor.actionPerformed = function () {
      if (this.enabled) {
        pressDo();
      }
      actor.setScale(1, 1);
    };
    actor.touchEnd = actor.actionPerformed;
  },

  changeActorImg: function (director, actor, img) {
    Util.checkActorConError(actor);
    actor.setBackgroundImage(director.getImage(img), false)
      .setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
  },

  createText: function (textContent, size, font, color) {
    if (!size) {
      size = 25 * sf;
    }
    if (!color) {
      color = "#FFFFFF";
    }
    Util.isInt(size);
    size = Math.round(size);
    size = "" + size + "px";
    if (!font) {
      font = "Action Man Bold";
    }
    font = size + " " + font;
    var text = new CAAT.Foundation.UI.TextActor().

      setFont(font).
      setText(textContent);
    text.textFillStyle = color;
    return text;
  },

  createLabel: function (textContent, w, h, size) {
    size = size || 25;
    if (!w || !h) {
      console.error("label need width and height as bound");
    }

    var al = "left";
    var label = new CAAT.Foundation.UI.Label().
      setStyle("default", {
        fontSize: size,
        alignment: al
      }).
      setText(textContent).
      cacheAsBitmap();

    var l3 = new CAAT.Foundation.UI.Layout.GridLayout(0, 2);
    var l2 = Util.createOneRowLayout();
    var content = new CAAT.Foundation.ActorContainer().
      // setPreferredSize( 25, 300 - 40).
      setLayout(l3).
      setClip(true).
      setSize(w * 2 - w / 4, h);

    if (DEBUG_.layout) {
      content.setFillStyle(Util.genRandColor()).setAlpha(0.3);
    }
    content.addChild(label);
    var topCon = new CAAT.ActorContainer().setSize(w, h).addChild(content);
    content.setLocation(-w / 2 + w * 3 / 50, 0);

    return topCon;
  },

  // check if is running on mobile device or on web browser
  isMobileDevice: function (director) {
    return (director.getBrowserName() == "An unknown browser");
  },

  // Create button with text and pressDo function
  createButtonWithTextFun: function (text, pressDo) {
    var fontSize = 20 * sf;
    var actor = new CAAT.Foundation.Actor().
      setSize(fontSize * (text.length / 2) + 10, 30);

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

    if (pressDo !== undefined || pressDo != null) {
      actor.mouseClick = pressDo;
      actor.touchEnd = pressDo;
    }

    return actor;
  },

  createOneRowLayout: function (isVertical) {
    var al = CAAT.Foundation.UI.Layout.LayoutManager.ALIGNMENT;
    var layout = new CAAT.Foundation.UI.Layout.BoxLayout().
      setAllPadding(0);
    if (isVertical === undefined || isVertical == false) {
      layout.setAxis(CAAT.Foundation.UI.Layout.LayoutManager.AXIS.X).
        setHorizontalAlignment(al.LEFT).
        setHGap(30).
        setVerticalAlignment(al.CENTER);
    } else {
      layout.setAxis(CAAT.Foundation.UI.Layout.LayoutManager.AXIS.Y).
        setHorizontalAlignment(al.LEFT).
        setVGap(5).
        setVerticalAlignment(al.TOP);
    }
    return layout;
  },

  changeLayoutAlign: function (layout, h, v) {
    var al = CAAT.Foundation.UI.Layout.LayoutManager.ALIGNMENT;
    layout.setHorizontalAlignment(al[h]).
      setVerticalAlignment(al[v]);
  },

  changeLayoutAlignOnActor: function (actor, h, v) {
    // h: LEFT, CENTER, RIGHT
    // v: TOP, CENTER, BOTTOM
    Util.changeLayoutAlign(actor.getLayout(), h, v);
  },

  // behavior of pump up then squeeze down then disappear
  createPumpBehavior: function (scaleFactor) {
    var inter = new CAAT.Interpolator().createExponentialInOutInterpolator(2, false);
    scaleFactor = scaleFactor || 1.5;

    var behaviorContainer = new CAAT.Behavior.ContainerBehavior();

    var scaling = new CAAT.ScaleBehavior().
      setFrameTime(0, 1000).
      setValues(scaleFactor, 1, scaleFactor, 1, 0.5, 0.5).
      setInterpolator(inter);

    var disappear2 = new CAAT.AlphaBehavior().
      setFrameTime(0, 2000).
      setValues(1, 0).
      setInterpolator(inter);

    var disappear = new CAAT.ScaleBehavior().
      setFrameTime(0, 100).
      setValues(1, 0, 1, 0, 0.5, 0.5).
      setInterpolator(inter);

    behaviorContainer.addBehavior(scaling);
    behaviorContainer.addBehavior(disappear);
    return behaviorContainer;
  },

  addBehaviorFlashing: function (actor, scene) {

    var flashing = new CAAT.AlphaBehavior().
      setFrameTime(scene.time, 500).
      setValues(0.5, 0.2).
      setCycle(true).
      setPingPong();

    actor.addBehavior(flashing);
  },

  // TODO:X:double check do we want to remove? if yes, use destroy
  removeAllActorWithBehaviors: function (scene) {
    var children = scene.childrenList;
    for (var i in children) {
      var actor = children[i];
      if (actor.behaviorList.length > 0) {
        actor.setExpired(true);
      }
    }
  },

  createConEmptyWrapper: function (actor) {
    var container = new CAAT.ActorContainer().
      setSize(actor.width, actor.height);
    if (actor.parent) {
      var parent = actor.parent;
      parent.removeChild(actor);
    }
    return container;
  },

  createConWrapper: function (actor) {
    var con = Util.createConEmptyWrapper(actor);
    con.setLocation(actor.x, actor.y);
    actor.setLocation(0, 0);
    con.addChild(actor);
    return con;
  },

  createAlignContainer: function (isVertical, gap) {
    var container = Util.createAlignContainerWithActor(isVertical, [], gap);

    return container;
  },

  createAlignContainerWithActor: function (isVertical, actorArray, gap) {
    var layout = Util.createOneRowLayout(isVertical);
    var container = new CAAT.ActorContainer(true).setLayout(layout);
    var length = 0;
    var max = 0;
    var myGap = gap;
    if (myGap == undefined) {
      if (isVertical) {
        myGap = container.getLayout().vgap || 0;
      } else {
        myGap = container.getLayout().hgap || 0;
      }
    } else {
      if (isVertical) {
        container.getLayout().setVGap(myGap);
      } else {
        container.getLayout().setHGap(myGap);
      }
    }
    // TODO: didn't consider layout when calculate actor position
    for (var i in actorArray) {
      var actor = actorArray[i];
      if (!actor) {
        if (DEBUG_.alignContainer) {
          console.error("null on " + i + " of align container");
        }
        continue;
      }
      if (!isVertical) {
        actor.setLocation(length, 0);
        length += actor.width;
        max = (actor.height > max) ? actor.height : max;
      } else {
        actor.setLocation(0, length);
        length += actor.height;
        max = (actor.width > max) ? actor.width : max;
      }
      length += myGap;
      container.addChild(actor);
    }
    if (!isVertical) {
      container.setSize(length, max);
    } else {
      container.setSize(max, length);
    }
    if (DEBUG_.layout) {
      container.setFillStyle(Util.genRandColor()).setAlpha(0.3);
    }
    return container;
  },

  popUpAchieve: function (director, msg, icon) {
    if (!icon) {
      icon = "logoAchieve";
    }
    var fullMsg = "You just achieved \n\n" + msg;
    new PopUp(director, Util.getCurrentConOrScene(director), fullMsg, icon, 125 * sf, 150 * sf);
  },

  popUpUnlock: function (director, songName, songImg) {
    var fullMsg = "You just unlocked \n\n" + songName;
    new PopUp(director, Util.getCurrentConOrScene(director), fullMsg, songImg);
  },

  getCurrentConOrScene: function (director) {
    if (director.activeCon) {
      return director.activeCon;
    }
    return director.getCurrentScene();
  },

  findAbsPos: function (actor) {
    var pos = {
      x: actor.x,
      y: actor.y
    };


    while (actor.parent) {
      actor = actor.parent;
      pos.x += actor.x;
      pos.y += actor.y;
    }
    return pos;
  },

  createRollingImageConInBound: function (director, imageIndex, x, y, w, h, dir, delay) {

    dir = dir || "goLeft";

    var delta = w;
    if (dir == "goRight") {
      delta = -w;
    }
    var con = Util.createImageConInBound(director, imageIndex, x, y, w, h);
    con.setClip(true);
    addMoveBh(con.childrenList[0], dir, delay);

    var bgNext = Util.createImageActorInBound(director, imageIndex, delta, 0, w, h);
    con.addChild(bgNext);
    addMoveBh(bgNext, dir, delay);

    return con;


    function addMoveBh(bg, dir, delay) {
      dir = dir || "goLeft";
      delay = delay || 0;

      var delta = -bg.width;
      if (dir == "goRight") {
        delta = -delta;
      }
      var path = new CAAT.PathUtil.LinearPath().
        setInitialPosition(bg.x, bg.y).
        setFinalPosition(bg.x + delta, bg.y);
      //setFinalPosition(bg.x - w, bg.y);
      var bh = new CAAT.PathBehavior().
        setPath(path).
        setCycle(true);
      bh.setFrameTime(delay, 20000);
      var bhScale = new CAAT.ScaleBehavior().
        setValues(1, 2, 1, 1, 0.5, 0.5);
      bg.addBehavior(bh);
    }

  },

  /**
   * Solve the problem that aligned container has actor in same location after setVisible false->true
   * @param container
   */
  updateContainer: function (container) {
    var actorList = container.childrenList.slice(0);
    var i;

    // remove all the children. emptyChildren() doesn't work as expected
    for (i = 0; i < actorList.length; i++) {
      container.removeChild(actorList[i]);
    }

    // add them back
    for (i = 0; i < actorList.length; i++) {
      container.addChild(actorList[i]);
    }
  },

  getAllChildrenId: function (scene) {
    var c = scene.childrenList;
    var string = "";
    for (var i in c) {
      string += c[i].getId() + ",";
    }
    return string;
  },

  destroyObj: function (obj) {
    if (!obj) {
      return;
    }
    if (obj instanceof CAAT.ActorContainer) {
      Util.destroyActorCon(obj);
      return;
    }
    if (obj instanceof CAAT.Actor) {
      Util.destroyActor(obj);
      return;
    }

    console.error("destroy obj is not actor or actorContainer");
    return;
  },

  destroyActor: function (actor) {
    actor.setVisible(false); // if not, it will go to (0,0) for 0.1 sec
    if (actor.parent) {
      actor.parent.removeChild(actor);
    }
    actor.emptyBehaviorList();
    actor.setExpired(true);
  },

  destroyActorCon: function (actorCon) {
    if (!actorCon) {
      console.error("Actor con not exist");
      return;
    }
    actorCon.setVisible(false); // if not, it will go to (0,0) for 0.1 sec
    for (var i = 0; i < actorCon.childrenList.length; i++) {
      var actor = actorCon.childrenList[i];
      Util.destroyObj(actor);
    }
    if (actorCon.parent) {
      actorCon.parent.removeChild(actor);
    }
    actorCon.setExpired(true);
  },

  myEnum: function (array) {
    var result = {};
    for (var i in array) {
      var value = array[i];
      result[value] = i;
    }
    result.realValue = array;
    return result;
  },

  // read json from local file/url
  readJson: function (url) {
    var obj = new XMLHttpRequest();
    // Using synchronous call
    obj.open('GET', url, false);
    obj.send(null);
    if (obj.status == 200) {
      var myJson = JSON.parse(obj.responseText);
    }
    return myJson;
  },

  createTranslationBehavior: function (fromX, fromY, toX, toY) {
    var path = new CAAT.PathUtil.LinearPath().
      setInitialPosition(fromX, fromY).
      setFinalPosition(toX, toY);
    //setFinalPosition(bg.x - w, bg.y);
    var bh = new CAAT.PathBehavior().
      setPath(path);
    return bh;
  },

  createStars: function (director, level, starSize) {
    starSize = starSize || 90 * sf;
    var starActors = [];
    var starActor;
    var i;
    for (i = 1; i <= level; i++) {
      starActor = Util.createImageActorWH(director, "starFull", starSize, starSize);
      starActors.push(starActor);
    }
    for (i = level + 1; i <= 3; i++) {
      starActor = Util.createImageActorWH(director, "starEmpty", starSize, starSize);
      starActors.push(starActor);
    }

    var con = Util.createAlignContainerWithActor(false, starActors, 0);
    con.enableEvents(false);
    return con;
  },

  createPopUpNotEnough: function (director) {
    var popUpText = "Not enough " + GEM_UNIT;
    new PopUp(director, Util.getCurrentConOrScene(director), popUpText, "rabbitSad", 100 * sf, 150 * sf, null, true);
  },

  initAd: function () {
    // init with no ad first
    CocoonJS.Ad.hideBanner();

    // place holder for listener (for debugging or others)
    CocoonJS.Ad.onBannerShown.addEventListener(function () {
      console.log("onBannerShown");
    });

    CocoonJS.Ad.onBannerHidden.addEventListener(function () {
      console.log("onBannerHidden");
    });

    // actual init
    CocoonJS.Ad.onBannerReady.addEventListener(function (width, height) {
      console.log("onBannerReady " + width + ":" + height + ":" + W_ + ":" + H_);

      var rect = CocoonJS.Ad.getRectangle();
      rect.x = W_ / 2 - rect.width / 2;
      rect.y = H_ - rect.height;

      CocoonJS.Ad.setRectangle(rect);
      if (AD_INFO.status == "show") {
        Util.showAd();
      }
    });
    CocoonJS.Ad.preloadBanner();
  },

  showAd: function () {
    if (IS_AD_ON_) {
      AD_INFO.status = "show";
      CocoonJS.Ad.showBanner();
    }
  },

  hideAd: function () {
    if (IS_AD_ON_) {
      AD_INFO.status = "hide";
      CocoonJS.Ad.hideBanner();
    }
  },

  dummy: function () {
  }
};
