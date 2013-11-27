/**
 * User: Niu Niu
 * Date: 3/3/13
 * All rights reserved by Africa Swing
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
      /*
      var bkg = Util.createImageActorInBound(that.director, "lockBg",
        0, 0, 50, 50);

      popUp = new PopUp(scene, false, true, true);
      popUp.setSizeMy(that.director.width / 2, that.director.height / 2);
     // var costMsg= "cost: "+ price + " "+ GEM_UNIT;
     // var labelCost = Util.createLabel(costMsg, popUp.inner.width-10, popUp.inner.height /2+10);
      popUp.infoCon.addChild(label);
     // popUp.infoCon.addChild(labelCost);

      var cancelBtn = Util.createImageActorInBound(that.director, "ok", 0, 0, 100, 80);
      popUp.buttonCon.addChild(unlockBtn);
      popUp.addCloseButton(cancelBtn);
      bkg.setSize(popUp.inner.width, popUp.inner.height);
      popUp.inner.addChildAt(bkg, 0);
      scene.addChild(popUp);
      */
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

      //var unlockBtn = Util.createButtonWithTextFun("Unlock by " + price + " "+ GEM_UNIT, unlockDo);
      //var unlockBtn = Util.createButtonWithTextFun("Unlock by " + price + " "+ GEM_UNIT, unlockDo);
      // createButtonConWithImageFunInBound: function (director,imageName, pressDo ,x,y,w,h)


     /* popUp = new PopUp(that.director, scene);
      var unlockBtn = Util.createButtonConWithImageFunInBound(that.director, "unlock", unlockDo, 0, 0, 220, popUp.buttonH);
      popUp.addInButtonCon(unlockBtn);
      popUp.setInfoText(msg);
     */
    }else if(type=="bottomTextArea"){//no pop up, replace the nottom text area with unlock text.
      textArea.setText(msg);
      actor.setScale(animationScaleFactor,animationScaleFactor);
      that.lastActLock = actor;
    }
  }

  var lockActor = Util.createImageActorInBound(this.director, this.lockImageName,
    actor.x, actor.y, actor.width, actor.height);
 // lockActor.enableEvents(false);

 // lockActor.setImageTransformation(CAAT.SpriteImage.TR_FIXED_WIDTH_TO_SIZE);
//  lockActor.setDiscardable(true);
  //lockActor.setAlpha(1);
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

  // check exist group
  if (!this.checkGroup(group)) {
    return;
  }

  /*
   // check current lock status is same as isUnlock or not
   // don't do this on "notLogin"
   if ( group != "notLogin") {
   var currentSt = this.getGroupIsUnlock(group);
   if (currentSt == isUnLock) {
   console.log("><st " + currentSt);
   return;
   }
   }
   */

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
  if ( typeof isUnlock == "boolean") {
    isUnlock = (isUnlock) ? 1 : 0;
  }
  this.setGroupIsUnlockOrNum(group, isUnlock);

};

LockMgr.prototype.getGroupIsUnlockOrNum = function (group) {
  var value = parseInt(this.getValue(group+"_isUnlock")) || 0;
  if (DEBUG_.lockMgr) {
    console.log("get " + group+"_isUnlock" + " : " , value);
  }
  return value;
};

LockMgr.prototype.setGroupIsUnlockOrNum = function (group, isUnlockedOrNum) {
  if (DEBUG_.lockMgr) {
    console.error("setting " + group+"_isUnlock" + " : " , isUnlockedOrNum);
  }
  this.setValue(isUnlockedOrNum, group+"_isUnlock")
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

LockMgr.prototype.addLockGroup = function(group) {
  if (this.lockerGroup.hasOwnProperty(group)){
    return;
  }
  this.lockerGroup[group] = [];
};

LockMgr.prototype.resetLastActLock = function() {
  this.lastActLock.setScale(1,1);
};