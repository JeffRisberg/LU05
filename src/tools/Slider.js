function Slider(scene, director, isVertical, isPopCenter) {
  CAAT.ActorContainer.call(this);

  var that = this;
  this.scene = scene;
  this.director = director;
  this.isVertical = isVertical || false;
  this.isPopCenter = isPopCenter || false;
  this.itemLocArray = [];
  this.isCheckCenterPos = 0;
  this.centerOffset = -30 * sf;
  this.targetIndex = 0;
  this.number = 3;
  this.goMove = 0;
  this.goAccelerate = 0;
  this.speed = 0;
  this.currentSlideSpeed = 0; // detect sliding speed to disable button press
  this.isRevert = false;
  this.padLength = 50;
  this.totalActorWidth = this.padLength * 2; // front and end, twice
  this.totalActorHeight = this.padLength * 2; // front and end, twice
  this.gap = 20;
  this.lastTouchedActor = null;
  this.enabled = true;
  if (true || DEBUG_.layout) {
    this.setFillStyle('blue').setAlpha(0.8);
  }
  this.setClip(true);
  this.innerContainer = new CAAT.ActorContainer();
  this.resetLayout();

  if (true || DEBUG_.layout) {
    this.innerContainer.setFillStyle('red').setAlpha(0.2);
  }
  this.addChild(this.innerContainer);

  this.paint = function (director, time) {
    CAAT.ActorContainer.prototype.paint.call(this, director, time);

    if (!this.enabled) {
      return;
    }

    if (that.goMove != 0) {

      var delta = that.goMove * 10;
      this.moveBy(delta);
      if (!that.checkLimit()) {
        that.goMove = 0;
      }
      return;
    }

    if (that.goAccelerate != 0) {
      var force = 1;
      if (this.speed > 0) {
        force = -force;
      }
      this.moveBy(this.speed);
      this.speed += force;
      if (Math.abs(this.speed) < 5 || this.checkLimitAcc()) {
        that.goAccelerate = 0;
        if (this.isPopCenter) {
          var dir = force;
          if (Math.abs(this.speed) < 2) {
            dir = 0;
          }
          this.targetIndex = Util.findNearestInArray(this.itemLocArray, this.innerContainer.x, dir);
          this.isCheckCenterPos = this.itemLocArray[this.targetIndex] + this.centerOffset;
          this.applyTargetIndexPressDo();
        }
        return;
      }
    }

    var dis;
    var speed;
    if (that.isRevert != 0) {

      if (that.isRevert == 1) {
        var minValue;
        if (!this.isVertical) {
          minValue = this.width - this.innerContainer.width;
          dis = minValue - this.innerContainer.x;
          if (dis < 5) {
            this.innerContainer.setLocation(minValue, this.innerContainer.y);
            that.isRevert = 0;
            return;
          }
        } else {
          minValue = this.height - this.innerContainer.height;
          dis = minValue - this.innerContainer.y;
          if (dis < 5) {
            this.innerContainer.setLocation(this.innerContainer.x, minValue);
            that.isRevert = 0;
            return;
          }
        }
        speed = dis / 10;
        if (speed < 5) {
          speed = 5;
        }
        this.moveBy(speed);
        return;
      }

      if (that.isRevert == -1) {
        if (!this.isVertical) {
          dis = -this.innerContainer.x;
          if (dis > -5) {
            this.innerContainer.setLocation(0, this.innerContainer.y);
            that.isRevert = 0;
            return;
          }
        } else {
          dis = -this.innerContainer.y;
          if (dis > -5) {
            this.innerContainer.setLocation(this.innerContainer.x, 0);
            that.isRevert = 0;
            return;
          }
        }
        speed = dis / 10;
        if (speed > -5) {
          speed = -5;
        }
        this.moveBy(speed);
      }
    }

    if (this.isPopCenter) {
      if (this.isCheckCenterPos != 0) {
        dis = this.isCheckCenterPos - this.innerContainer.x;
        speed = dis / 20;
        if (Math.abs(dis) <= 5) {
          this.innerContainer.setLocation(this.isCheckCenterPos, this.innerContainer.y);
          this.isCheckCenterPos = 0;
          return;
        }
        var speedMinAbs = 3;
        if (speed > -speedMinAbs && speed < 0) {
          speed = -speedMinAbs;
        } else {
          if (speed < speedMinAbs && speed > 0) {
            speed = speedMinAbs;
          }
        }
        this.moveBy(speed);

      }
    }

    return;
  }
}

Slider.prototype = new CAAT.ActorContainer();
Slider.prototype.constructor = Slider;

Slider.prototype.setSliderBounds = function (x, y, w, h) {
  this.setBounds(x, y, w, h);
  this.innerContainer.setBounds(0, 0, w, h);
  if (this.parent) {
    this.setTouchy();
  }
  return this;
};

Slider.prototype.setTouchy = function () {
  var that = this;
  var pos = Util.findAbsPos(this);
  // TODO: touchy lister's y is different from actual y on scene, offset = 9, seams same on x
  var touchy = new Touchy();
  touchy.listen(
    {
      x1: pos.x,
      y1: pos.y,
      x2: pos.x + that.width,
      y2: pos.y + that.height
    },
    function (e, eventType) {

      // that.scene may not be scene now, it can also be a container
      if ((that.scene instanceof CAAT.Scene)
        && that.director.getCurrentScene() !== that.scene) {
        // not react if current scene is not the scene create slider
        return;
      }
      if (!that.enabled) {
        return;
      }

      switch (eventType) {
        case "touchstart":
          that.isCheckCenterPos = 0;
          that.goAccelerate = 0;
          that.isRevert = 0;
          that.speed = 0;
          that.currentSlideSpeed = 0;
          touchy.reset();
          touchy.touchStarted = true;
          touchy.record(e.x, e.y);
          break;
        case "touchmove":
          if (touchy.touchStarted) {
            if (that.isVertical == false) {
              that.moveBy(touchy.deltaX);
              that.currentSlideSpeed = touchy.speedX;
            } else {
              that.moveBy(touchy.deltaY);
              that.currentSlideSpeed = touchy.speedY;
            }
          }
          break;
        case "touchend":
          if (touchy.touchStarted) {
            that.setSpeed(that.currentSlideSpeed * 10);
            that.checkLimitAcc();
            touchy.touchStarted = false;
          }
          break;
      }
    }
  );
  return this;
};

Slider.prototype.setSpeed = function (speed) {
  this.goAccelerate = 1;
  this.speed = speed;
};

Slider.prototype.isInMaxLimit = function () {

  var minValue;
  if (!this.isVertical) {
    minValue = this.width - this.innerContainer.width;
    if (this.innerContainer.x <= minValue) {
      // stop scrolling and reset
      this.innerContainer.setLocation(minValue, this.innerContainer.y);
      return false;
    }
  } else {
    minValue = this.height - this.innerContainer.height;
    if (this.innerContainer.y <= minValue) {
      // stop scrolling and reset
      this.innerContainer.setLocation(this.innerContainer.x, minValue);
      return false;
    }
  }
  return true;
};

Slider.prototype.isInMinLimit = function () {

  var maxValue = 0;
  if (this.isPopCenter) {
    maxValue = this.width / 2;
  }

  if (!this.isVertical) {
    if (this.innerContainer.x >= maxValue) {
      // stop scrolling and reset
      this.innerContainer.setLocation(maxValue, this.innerContainer.y);
      return false;
    }
  } else {
    if (this.innerContainer.y >= maxValue) {
      // stop scrolling and reset
      this.innerContainer.setLocation(this.innerContainer.x, maxValue);
      return false;
    }
  }
  return true;
};

Slider.prototype.resetWhenActivated = function (recordLastTouch) {
  if (!recordLastTouch || !this.lastTouchedActor) {
    var initValue = 0;
    if (this.isPopCenter) {
      initValue = this.itemLocArray[0] + this.centerOffset;
    }
    if (this.isVertical) {
      this.innerContainer.setLocation(this.innerContainer.x, initValue);
    } else {
      this.innerContainer.setLocation(initValue, this.innerContainer.y);
    }
  }
  this.currentSlideSpeed = 0;
  if (this.lastTouchedActor) {
    this.lastTouchedActor.setScale(1, 1);
  }
};

// check if slided too much, we need to slide it back automatically
Slider.prototype.checkLimitAcc = function () {
  var minValue;
  var checkingAttr;
  if (!this.isVertical) {
    minValue = this.width - this.innerContainer.width;
    checkingAttr = this.innerContainer.x;
  } else {
    minValue = this.height - this.innerContainer.height;
    checkingAttr = this.innerContainer.y;
  }

  if (this.isPopCenter) {
    if (checkingAttr <= minValue - this.width / 2 ||
      checkingAttr >= 0 + this.width / 2) {
      return true;
    }
    return false;
  }

  if (checkingAttr <= minValue) {
    this.isRevert = 1;
    if (DEBUG_.slider) console.log("revert:" + this.isRevert + " :checked " + checkingAttr + ":vs min " + minValue);
    return true;
  }

  if (checkingAttr >= 0) {
    this.isRevert = -1;
    if (DEBUG_.slider) console.log("revert:" + this.isRevert + " :checked " + checkingAttr + ":vs max " + 0);
    return true;
  }

  return false;
};

Slider.prototype.checkLimit = function () {
  if (!this.isInMinLimit()) {
    return false;
  }
  if (!this.isInMaxLimit()) {
    return false;
  }
  return true;
};

Slider.prototype.moveBy = function (delta) {
  if (!this.isVertical) {
    this.innerContainer.setLocation(this.innerContainer.x + delta, this.innerContainer.y);
  } else {
    this.innerContainer.setLocation(this.innerContainer.x, this.innerContainer.y + delta);
  }
};

// following three is for the button pressing to let slider go left/up and right/down
Slider.prototype.downLU = function () {
  if (!this.isInMaxLimit()) {
    return;
  }
  this.goMove = -1;
};

Slider.prototype.downRD = function () {
  if (!this.isInMinLimit()) {
    return;
  }
  this.goMove = 1;
};

Slider.prototype.up = function () {
  this.goMove = 0;
};

Slider.prototype.addItem = function (actor) {
  if (this.isPopCenter) {
    this.itemLocArray.push(this.totalActorWidth);
  }
  this.innerContainer.addChild(actor);
  if (!this.isVertical) {
    this.totalActorWidth += actor.width + this.gap;
  } else {
    this.totalActorHeight += actor.height + this.gap;
  }
};

Slider.prototype.resetSize = function () {
  if (!this.isVertical) {
    var newWidth = Math.max(this.totalActorWidth, this.width);
    newWidth = newWidth + 80 * sf;
    this.innerContainer.setSize(newWidth, this.innerContainer.height);
  } else {
    var newHeight = Math.max(this.totalActorHeight, this.height);
    this.innerContainer.setSize(this.innerContainer.width, newHeight);
  }

  if (this.isPopCenter) {
    var i;
    for (i in this.innerContainer.childrenList) {
      this.innerContainer.childrenList[i].enableEvents(false);
    }
    for (i in this.itemLocArray) {
      this.itemLocArray[i] = this.width / 2 - this.itemLocArray[i];
    }
    this.innerContainer.setLocation(this.itemLocArray[0], this.innerContainer.y);
  }
};

Slider.prototype.emptyAllItems = function () {
  this.innerContainer.emptyChildren();
  if (!this.isVertical) {
    this.totalActorWidth = this.padLength * 2; // front and end, twice
    this.innerContainer.setLocation(0, this.innerContainer.y);
  } else {
    this.totalActorHeight = this.padLength * 2; // front and end, twice
    this.innerContainer.setLocation(this.innerContainer.x, 0);
  }
  return this;
};

Slider.prototype.setGap = function (gap) {
  this.gap = gap;
  this.resetLayout();
  return this;
};

Slider.prototype.setLayoutMy = function (layout) {
  this.innerContainer.setLayout(layout);
};

Slider.prototype.setLayoutAlign = function (h, v) {
  Util.changeLayoutAlign(this.innerContainer.getLayout(), h, v);
  return this;
};

Slider.prototype.setLayoutPadding = function (pad) {
  this.innerContainer.getLayout().setAllPadding(pad);
  return this;
};

Slider.prototype.resetLayout = function () {
  var layM = CAAT.Foundation.UI.Layout.LayoutManager;
  var al = layM.ALIGNMENT;

  this.layout = new CAAT.Foundation.UI.Layout.BoxLayout().
    setAllPadding(this.padLength);

  if (!this.isVertical) {
    this.layout.setAxis(layM.AXIS.X).
      setHGap(this.gap).
      setHorizontalAlignment(al.LEFT).
      setVerticalAlignment(al.CENTER);
  } else {
    this.layout.setAxis(layM.AXIS.Y).
      setVGap(this.gap).
      setHorizontalAlignment(al.CENTER).
      setVerticalAlignment(al.TOP);
  }
  this.innerContainer.setLayout(this.layout);
};

Slider.prototype.setEnabled = function (enabled) {
  this.enabled = enabled;
  this.enableEvents(enabled);
};

Slider.prototype.applyTargetIndexPressDo = function () {
  var actor = this.innerContainer.childrenList[this.targetIndex];
  while (actor && !actor.fnOnClick) {
    actor = actor.childrenList[0];
  }
  actor.fnOnClick();
};
