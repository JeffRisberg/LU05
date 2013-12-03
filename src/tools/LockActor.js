//one lock actor
function LockActor(director_, originalImg_, pressDoUnlocked_, lockMgr_, hasLock, lockImg) {
  var that = this;

  CAAT.ActorContainer.call(this);
  var pressDo_;
  var lockImg_ = lockImg || "Locked";
  var price_, userMoney_;
  var scaleFactor_ = undefined;
  var group_ = originalImg_;
  var msg_, pressDoLocked_;
  var slider_ = undefined;
  var recordW_, recordH_;
  var isLocked_ = hasLock;
  var groupNoSuffix_;
  var episodeMgr_;

  this.pressDo = pressDo_;

  pressDo_ = function (e) {

    // check slider to do
    if (slider_ != undefined) {
      if (Math.abs(slider_.currentSlideSpeed) > 0.5 && !slider_.isPopCenter) {
        return;
      }
    } else {
      return;
    }

    if (slider_.lastTouchedActor && slider_.lastTouchedActor == this && this.scaleX != 1) {
      return;
    }

    // check scale
    if (scaleFactor_ != undefined) {
      this.setScale(scaleFactor_, scaleFactor_);
      if (slider_.lastTouchedActor && slider_.lastTouchedActor != this) {
        slider_.lastTouchedActor.setScale(1, 1);
      }
    }

    if (isLocked_) {
      pressDoLocked_(e);
    } else {
      pressDoUnlocked_(e);
    }
    slider_.lastTouchedActor = this;
  };

  function unlockSuccess() {
    if (!price_) {
      return true;
    }

    // check money enough
    if (!userMoney_.addGems(-price_)) {
      Util.createPopUpNotEnough(director_);
      return false;
    }
    return true;
  }

  function setLockedInit(isLocked) {
    if (isLocked) {
      that.setAsButton(director_.getImage(lockImg_), 0, 0, 0, 0, pressDo_);
      that.setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
    } else {
      that.setAsButton(director_.getImage(originalImg_), 0, 0, 0, 0, pressDo_)
        .setImageTransformation(CAAT.SpriteImage.TR_FIXED_TO_SIZE);
    }
    that.touchEnd = pressDo_;
  }

  function setUnlockedSt(isUnlockedOrNum) {
    // make sure the size is we want
    if (recordW_ && recordH_) {
      that.setSizeMy(recordW_, recordH_);
    }
    isLocked_ = !isUnlockedOrNum;
    lockMgr_.setGroupIsUnlockOrNum(group_, isUnlockedOrNum);
  }

  function setLockedSt(isLocked) {
    // make sure the size is we want
    if (recordW_ && recordH_) {
      that.setSizeMy(recordW_, recordH_);
    }
    isLocked_ = isLocked;
    lockMgr_.setGroupIsUnlockOrNum(group_, (!isLocked) ? 1 : 0);
  }

  // public method
  this.getMsg = function () {
    return msg_;
  };

  this.setLocked = function (isLocked) {
    setLockedInit(isLocked);
    setLockedSt(isLocked);
    return this;
  };

  this.setUnlocked = function (isUnlockedOrNum) {
    setLockedInit(!isUnlockedOrNum);
    setUnlockedSt(isUnlockedOrNum);
    return this;
  };

  this.setPrice = function (price, userMoney) {
    price_ = price;
    userMoney_ = userMoney;
    return this;
  };

  this.setPressDoScaleFactor = function (scaleFactor) {
    scaleFactor_ = scaleFactor;
    return this;
  };

  this.setSlider = function (slider) {
    slider_ = slider;
    return this;
  };

  this.setLockInfo = function (msg, pressDoLocked, group) {
    msg_ = msg;
    pressDoLocked_ = pressDoLocked;
    groupNoSuffix_ = group || originalImg_;
    if (episodeMgr_) {
      for (var i in episodeMgr_.getDifficultyRange()) {
        lockMgr_.addLockNew(this, groupNoSuffix_ + "_" + episodeMgr_.getDifficulty()[i]);
      }
      group_ = groupNoSuffix_ + "_" + episodeMgr_.getDifficulty();
    }
    return this;
  };

  this.resetGroup = function () {
    group_ = groupNoSuffix_ + "_" + episodeMgr_.getDifficulty();
    this.setLocked(!lockMgr_.getGroupIsUnlockOrNum(group_));
  };

  this.setSizeMy = function (w, h) {
    this.setSize(w, h);
    recordW_ = w;
    recordH_ = h;
    return this;
  };

  this.setEpisodeMgr = function (episodeMgr) {
    episodeMgr_ = episodeMgr;
    return this;
  };

  this.tryUnlockSuccess = function () {
    if (!unlockSuccess()) {
      return false;
    }
    // TODO: X: this may have some problem, unlockNum may not be 0, but shop work around it buy get number before this been set, then set based on the number got
    this.setLocked(0);
    return true;
  };

  this.getIsLocked = function () {
    return isLocked_;
  };

  // init
  setLockedInit(hasLock);
  /*
   if (!hasLock) {
   lockMgr_.setGroupIsUnlock(group_, 1);
   } else {
   this.setLocked(!lockMgr_.getGroupIsUnlock(group_));
   }
   */

  this.pressDo = pressDo_;

  return this;
}

LockActor.prototype = new CAAT.ActorContainer();