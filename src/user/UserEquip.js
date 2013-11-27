/**
 * User: Niu Niu
 * Date: 5/12/13
 * All rights reserved by Africa Swing
 */

function UserEquip(lockMgr_) {
  var that = this;
  var talentGroup_ = [
    {
      image: "talentExp",
      price: 36,
      onlyAffectEnd: true,
      msg: "Exp + 20%",
      fun: function(target) {
        if (target && target.hasOwnProperty("expEarn")) {
          target.expEarn *= 1.2;
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "talentMoney",
      price: 70,
      onlyAffectEnd: true,
      msg: "Money + 20%",
      fun: function(target) {
        if (target && target.hasOwnProperty("gemEarn") && target.hasOwnProperty("gemText")) {
          target.gemEarn = Math.floor(target.gemEarn* 1.2);
          target.gemText = target.gemEarn + " (+20%)";
        } else{
          applyCommon(target);
        }
      }
    },
    {
      image: "talentAcc",
      price: 90,
      onlyAffectEnd: true,
      msg: "accuracy + 2%",
      fun: function(target) {
        // note if acc is 91% then the value here is 91
        if (target && target.hasOwnProperty("acc") && target.hasOwnProperty("accText")) {
          target.acc = (target.acc+1).toFixed(1);
          if (target.acc > 100) { target.acc = 100}
          target.accText = target.acc + " (+1)";
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "talentScore",
      price: 130,
      onlyAffectEnd: true,
      msg: "score + 10%",
      fun: function(target) {
        // note if acc is 91% then the value here is 91
        if (target && target.hasOwnProperty("score") && target.hasOwnProperty("scoreText")) {
          target.score = Math.floor(target.score* 1.1);
          target.scoreText = target.score + " (+10%)";
        } else {
          applyCommon(target);
        }
      }
    }
  ];


  var itemGroup_ = [
    {
      image: "itemAcc",
      price: 5,
      msg: "increase accuracy 20% for 10s",
      fun: function(target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemAccFactor(1.2);
          function endItemDo() {target.scoreMgr.setItemAccFactor(1); endDoCommon(target);}
          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemFullBlood",
      price: 5,
      msg: "recover to full energy immediately",
      fun: function(target) {
        if (target && target.hasOwnProperty("hpBar")) {
          target.hpBar.setPercent(1);
          endDoCommon(target);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemRecoverDuration",
      price: 2,
      msg: "recover 3%/sec for 20s",
      fun: function(target) {
        if (target && target.hasOwnProperty("hpBar") && target.hasOwnProperty("cancelFunList")) {
          var intervalId = Util.setIntervalWithTotal(1000, 20, function() {
            target.hpBar.incPercent(0.03);
          });

          function endItemDo() {endDoCommon(target);}
          setTimeout(endItemDo, 20000);
          // later it can remove interval if it is not finished when game ended
          target.cancelFunList.push(function() { clearInterval(intervalId)});
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemShield",
      price: 8,
      msg: "reduce energy drop to 50% for 20s",
      fun: function(target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemHpFactor(0.5);
          function endItemDo() {target.scoreMgr.setItemHpFactor(1); endDoCommon(target);}
          setTimeout(endItemDo, 20000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemScoreDouble",
      price: 15,
      msg: "score boost to twice for 10s",
      fun: function(target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemScoreFactor(2);
          function endItemDo() {target.scoreMgr.setItemScoreFactor(1); endDoCommon(target);}
          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemCombo",
      price: 10,
      msg: "combo will not be interrupt in 10s",
      fun: function(target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemComboFactor(true);
          function endItemDo() {target.scoreMgr.setItemComboFactor(false); endDoCommon(target);}
          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemPass100",
      price: 25,
      msg: "no energy loss in one run",
      fun: function(target) {
        if (target && target.hasOwnProperty("scoreMgr") ) {
          target.scoreMgr.setItemStrongFactor(true);
        } else {
          applyCommon(target);
        }
      }
    }
  ];

  var talentGroupHash_, itemGroupHash_;

  // for check which item has been equip so same item cannot be equip again
  var equipItemHash_= {};

  var buttonTalentGroup_ = [
    "talent0",
    "talent1"
  ];
  var buttonItemGroup_ = [
    "item0",
    "item1"
  ];

  var otherLockGroup_ = ["talent1_lockBox", "item1_lockBox"];

  this.getTalentGroup = function() { return talentGroup_;};
  this.getItemGroup = function() { return itemGroup_;};

  this.resetEquip = function() {
    var i;
    for (i in buttonTalentGroup_) {
      this.setValue("", buttonTalentGroup_[i]);
    }

    for (i in buttonItemGroup_) {
      this.setValue("", buttonItemGroup_[i]);
    }

  };

  this.getButtonTalentGroup = function() { return buttonTalentGroup_;};
  this.getButtonItemGroup = function() { return buttonItemGroup_;};

  this.applyItemEffect = function(itemImage, target, buttonItemName) {
    itemGroupHash_[itemImage].fun(target);
    var quantityLeft = lockMgr_.getGroupIsUnlockOrNum(itemImage);
    quantityLeft--;
    lockMgr_.setGroupIsUnlockOrNum(itemImage, quantityLeft);

    //  unequip when zero left
    if (quantityLeft == 0) {
      this.setValue("", buttonItemName);
    }

  };

  this.applyTalentEffectEnd =   function (target) {
    var buttonTalentGroup = this.getButtonTalentGroup();
    for (var i in buttonTalentGroup) {
      var talentGroup = this.getValue(buttonTalentGroup[i]);
      if (!talentGroup ) {
        continue;
      }
      if (talentGroupHash_[talentGroup].onlyAffectEnd) {
        talentGroupHash_[talentGroup].fun(target);
      }
    }
  };

  this.getIsEquip = function(itemName) {
    // init equip item hash
    for (var i in buttonItemGroup_) {
      if (that.getValue(buttonItemGroup_[i]) == itemName) {
        return true;
      }
    }
    return false;
  };

  this.incItemByOne = function(group) {
    var oriOwn = parseInt(lockMgr_.getGroupIsUnlockOrNum(group)) || 0;
    lockMgr_.setGroupIsUnlockOrNum(group, oriOwn + 1);
  };

  this.randomAwardItem = function(factor) {
    var baseFactor = 0.6;
    var finalFactor = baseFactor * factor;
    for (var i = itemGroup_.length-1; i>=0; --i){
      var itemObject = itemGroup_[i];
      if (Util.prob(finalFactor/itemObject.price)) {
        this.incItemByOne(itemObject.image);
        return itemObject.image;
      }
    }
    return "";
  };

  function getGroupImage(group, index) {
    if (group[index] && group[index].hasOwnProperty("image")) {
      return group[index].image;
    }
    return index;
  }

  function addAllGroup(group) {
    for ( var i in group) {
      lockMgr_.addLockGroup(getGroupImage(group, i));
    }
  }

  function applyCommon(target) {
    console.error("no enough target" , target);
  }

  function endDoCommon(target) {
    target.actor.emptyBehaviorList();
    Util.destroyObj(target.actor);
  }

  function init() {
    addAllGroup(talentGroup_);
    addAllGroup(itemGroup_);
    for (var i in otherLockGroup_) {
      lockMgr_.addLockGroup(otherLockGroup_[i]);
    }
    talentGroupHash_ = Util.createHashFromArray(talentGroup_, "image");
    itemGroupHash_  = Util.createHashFromArray(itemGroup_, "image");

  }


  init();
}

UserEquip.prototype = new LocalStorageMgr("EQUIP");
