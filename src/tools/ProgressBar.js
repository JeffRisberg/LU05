/**
 * User: Niu Niu
 * Date: 3/2/13
 * All rights reserved by Africa Swing
 */

function ProgressBar(director) {
  CAAT.ActorContainer.call(this);
  this.director = director;
  this.setClip(true);
  this.lastBehavior = null;
  return this;
}

ProgressBar.prototype = new CAAT.ActorContainer();
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.setImage = function (imageName, w, h, outerImgName) {
  if (!outerImgName) {
    outerImgName = "progressBarBg";
  }
  this.actor = Util.createImageActorInBound(this.director, imageName, 0, 0, 0, 0);
  this.bg = Util.createImageActorInBound(this.director, outerImgName, 0, 0, 0, 0);
  this.addChild(this.bg);
  this.setMySize(w, h);
  var actor = this.actor;
  actor
    .setScale(0, 1)
    .setScaleAnchor(0, 0);
  this.addChild(actor);
  return this;
};

ProgressBar.prototype.setMySize = function (w, h) {
  if (!w) {
    return;
  }
  h = h || this.height;

  var shortenLen = w * 0.07;
  var shortenH = h * 0.26;
  this.actor.setBounds(shortenLen, shortenH / 2, w - shortenLen * 1.2, h - shortenH);
  this.bg.setBounds(0, 0, w, h);
  this.setSize(w, h);
  return this;

};


ProgressBar.prototype.getLocFromPercent = function (percent) {
  return this.width * ( percent - 1);
};

ProgressBar.prototype.setPercent = function (percent) {
  this.percent = percent;
  this.actor.setScale(percent, 1).setScaleAnchor(0, 0);
};

ProgressBar.prototype.getPercent = function () {
  return this.percent || 0;
};

ProgressBar.prototype.incPercent = function (deltaPercent) {
  var percentNew = this.percent + deltaPercent;
  if (percentNew > 1) {
    percentNew = 1;
  } else if (percentNew < 0) {
    percentNew = 0;
  }
  this.setPercent(percentNew);
  return percentNew;
};

ProgressBar.prototype.setPercentAnimation = function (scene, fromPoint, toPoint, levelUpFun) {
  var that = this;
  var currentBehavior = new CAAT.ScaleBehavior().
    setValues(fromPoint, toPoint, 1, 1, 0, 0).
    addListener({
      behaviorExpired: function (behavior, time, actor) {
        if (toPoint == 1) {
          that.setPercent(0);
          if (levelUpFun !== undefined) {
            levelUpFun();
          }
        }
        if (behavior == that.lastBehavior) {
          that.lastBehavior = null;
        }
      }
    });

  // if last behavior exist
  if (that.lastBehavior) {
    that.lastBehavior.addListener({
      behaviorExpired: function (behavior, time, actor) {
        currentBehavior.setFrameTime(time, 1000);
        actor.addBehavior(currentBehavior);
      }
    });
  } else {
    currentBehavior.setFrameTime(scene.time, 1000);
    this.actor.addBehavior(currentBehavior);
  }

  that.lastBehavior = currentBehavior;

};


// image with progress on percent
function ImageProgressCon(imageActor_) {
  CAAT.ActorContainer.call(this);
  var that = this;
  var progressCon_ = new CAAT.ActorContainer()
    .setSize(imageActor_.width, imageActor_.height)
    .setFillStyle("black")
    .setAlpha(0.6);

  // percent from 0 to 1
  this.setProgress = function (percent) {
    if (percent < 0 || percent > 1) {
      console.error("Image progress con set progress not in range 0-1");
    }
    progressCon_.setScaleAnchored(1, 1 - percent, 0, 1);
    return this;
  };

  function init() {
    that.addChild(imageActor_);
    that.addChild(progressCon_);
    progressCon_.enableEvents(false);

    // transfer image's location to this container. Set size.
    that.setBounds(imageActor_.x, imageActor_.y, imageActor_.width, imageActor_.height);
    imageActor_.setLocation(0, 0);
    that.setProgress(0);
  }

  init();
  return this;
}
ImageProgressCon.prototype = new CAAT.ActorContainer();
