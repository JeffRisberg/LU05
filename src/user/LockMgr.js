/**
 * The LockMgr is used to maintain the lock status information for a user, which includes locks on
 * episodes, and on shopping slots.
 *
 * @author Linghua Jin
 * @since May 2013
 */
function LockMgr(director) {
  this.director = director;
  this.lockImageName = "lockIcon";
  this.lockerGroup = {};
}

LockMgr.prototype = new LocalStorageMgr("LOCK");

LockMgr.prototype.addLockNew = function (actor, group) {
  if (!this.lockerGroup.hasOwnProperty(group)) {
    this.lockerGroup[group] = [];
  }

  var lockGroup = this.lockerGroup[group];
  lockGroup.push(actor);

  if (DEBUG_.lockMgr) {
    console.log("lockMgr add " + group);
  }
};

LockMgr.prototype.delLock = function (group) {
  if (this.lockerGroup.hasOwnProperty(group)) {
    this.lockerGroup[group] = [];
  }
};

LockMgr.prototype.addLock = function (actor, group, msg, type, price, userMoney, textArea, animationScaleFactor) {
  var that = this;

  if (DEBUG_.lockMgr) {
    console.log("lockMgr add " + group);
  }

  var parent = actor.parent;

  function pressDo() {
    var scene = that.director.getCurrentScene();
    var text = Util.createText(msg);
    var popUp;
    if (type == undefined) {
      new PopUp(that.director, scene, true).setInfoText(msg);

    } else if (type == "bottomNotify") {

      function unlockDo() {
        if (!userMoney.addGems(-price)) {
          var newPopUp = new PopUp(that.director, scene, true);
          newPopUp.setInfoText("Not enough gem");
          newPopUp.setInQueue(false);
          return;
        }
        that.unlock(group);
        Util.destroyObj(popUp);
      }
    } else if (type == "bottomTextArea") {//no pop up, replace the nottom text area with unlock text.
      textArea.setText(msg);
      actor.setScale(animationScaleFactor, animationScaleFactor);
      that.lastActLock = actor;
    }
  }

  var lockActor = Util.createImageActorInBound(this.director, this.lockImageName,
    actor.x, actor.y, actor.width, actor.height);

  lockActor.mouseClick = pressDo;
  lockActor.touchEnd = pressDo;
  parent.addChild(lockActor);

  if (!this.lockerGroup.hasOwnProperty(group)) {
    this.lockerGroup[group] = [];
  }

  var lockGroup = this.lockerGroup[group];
  lockGroup.push(lockActor);
};

LockMgr.prototype.unlock = function (group) {
  if (this.getGroupIsUnlockOrNum(group)) {
    // already unlocked
    return false;
  }
  this.setLockerSt(group, true);
  return true;
};

LockMgr.prototype.setLockerSt = function (group, isUnlock) {
  if (!this.checkGroup(group)) {
    return;
  }

  // process all lockers in group
  var lockActors = this.lockerGroup[group];
  for (var i in lockActors) {
    var locker = lockActors[i];
    if (isUnlock) {
      //  locker.setLocked(false);
    } else {
      //  locker.setLocked(true);
    }
  }

  // make sure not record group "not login"
  if (group == "notLogin") {
    return;
  }

  // record all other group
  // convert boolean to 0 or 1
  if (typeof isUnlock == "boolean") {
    isUnlock = (isUnlock) ? 1 : 0;
  }
  this.setGroupIsUnlockOrNum(group, isUnlock);
};

LockMgr.prototype.getGroupIsUnlockOrNum = function (group) {
  var value = parseInt(this.getValue(group + "_isUnlock")) || 0;
  if (DEBUG_.lockMgr) {
    console.log("get " + group + "_isUnlock" + " : ", value);
  }
  return value;
};

LockMgr.prototype.setGroupIsUnlockOrNum = function (group, isUnlockedOrNum) {
  if (DEBUG_.lockMgr) {
    console.error("setting " + group + "_isUnlock" + " : ", isUnlockedOrNum);
  }
  this.setValue(isUnlockedOrNum, group + "_isUnlock")
};

LockMgr.prototype.initAllGroupSt = function (isLoggedIn) {
  for (var i in this.lockerGroup) {
    var isUnlock;

    // special case login status is passed, not from local storage
    if (i == "notLogin") {
      isUnlock = isLoggedIn;
    } else {
      isUnlock = this.getGroupIsUnlockOrNum(i);
    }
    if (DEBUG_.lockMgr) {
      console.log("lockMgr setting group " + i + " unlock : " + isUnlock);
    }
    this.setLockerSt(i, isUnlock);
  }
};

LockMgr.prototype.resetStorage = function () {
  for (var i in this.lockerGroup) {
    if (i == "notLogin") {
      continue;
    }
    this.setLockerSt(i, 0);
  }
};

LockMgr.prototype.checkGroup = function (group) {
  if (!this.lockerGroup.hasOwnProperty(group)) {
    console.error("lockActorGroup '" + group + "' not found in LockMgr");
    return false;
  }
  return true;
};

LockMgr.prototype.isGroupRegistered = function (group) {
  if (!this.lockerGroup.hasOwnProperty(group)) {
    return false;
  }
  return true;
};

LockMgr.prototype.addLockGroup = function (group) {
  if (this.lockerGroup.hasOwnProperty(group)) {
    return;
  }
  this.lockerGroup[group] = [];
};

LockMgr.prototype.resetLastActLock = function () {
  this.lastActLock.setScale(1, 1);
};