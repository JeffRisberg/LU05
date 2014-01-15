/**
 * User: Niu Niu
 * Date: 5/12/13
 * All rights reserved by Africa Swing
 */
function UserEquip(lockMgr_) {
  var that = this;

  this.itemMgr = new ItemMgr();

  // for check which item has been equip so same item cannot be equip again
  var equipItemHash_ = {};

  var buttonTalentGroup_ = [
    "talent0",
    "talent1"
  ];
  var buttonItemGroup_ = [
    "item0",
    "item1"
  ];

  var otherLockGroup_ = ["talent1_lockBox", "item1_lockBox"];

  this.getTalentGroup = function () {
    console.log(that.itemMgr);
    return that.itemMgr.getTalentGroup();
  };
  this.getItemGroup = function () {
    console.log(that.itemMgr);
    return that.itemMgr.getItemGroup();
  };

  this.resetEquip = function () {
    var i;
    for (i in buttonTalentGroup_) {
      this.setValue("", buttonTalentGroup_[i]);
    }

    for (i in buttonItemGroup_) {
      this.setValue("", buttonItemGroup_[i]);
    }
  };

  this.getButtonTalentGroup = function () {
    return buttonTalentGroup_;
  };
  this.getButtonItemGroup = function () {
    return buttonItemGroup_;
  };

  this.applyItemEffect = function (itemImage, target, buttonItemName) {
    itemGroupHash_[itemImage].fun(target);
    var quantityLeft = lockMgr_.getGroupIsUnlockOrNum(itemImage);
    quantityLeft--;
    lockMgr_.setGroupIsUnlockOrNum(itemImage, quantityLeft);

    //  unequip when zero left
    if (quantityLeft == 0) {
      this.setValue("", buttonItemName);
    }

  };

  this.applyTalentEffectEnd = function (target) {
    var buttonTalentGroup = this.getButtonTalentGroup();
    for (var i in buttonTalentGroup) {
      var talentGroup = this.getValue(buttonTalentGroup[i]);
      if (!talentGroup) {
        continue;
      }
      if (talentGroupHash_[talentGroup].onlyAffectEnd) {
        talentGroupHash_[talentGroup].fun(target);
      }
    }
  };

  this.getIsEquip = function (itemName) {
    // init equip item hash
    for (var i in buttonItemGroup_) {
      if (that.getValue(buttonItemGroup_[i]) == itemName) {
        return true;
      }
    }
    return false;
  };

  this.incItemByOne = function (group) {
    var oriOwn = parseInt(lockMgr_.getGroupIsUnlockOrNum(group)) || 0;
    lockMgr_.setGroupIsUnlockOrNum(group, oriOwn + 1);
  };

  this.randomAwardItem = function (factor) {
    var baseFactor = 0.6;
    var finalFactor = baseFactor * factor;
    for (var i = itemGroup_.length - 1; i >= 0; --i) {
      var itemObject = itemGroup_[i];
      if (Util.prob(finalFactor / itemObject.price)) {
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
    for (var i in group) {
      lockMgr_.addLockGroup(getGroupImage(group, i));
    }
  }

  function applyCommon(target) {
    console.error("no enough target", target);
  }

  function endDoCommon(target) {
    target.actor.emptyBehaviorList();
    Util.destroyObj(target.actor);
  }

  function init() {
    addAllGroup(that.itemMgr.talentGroup_);
    addAllGroup(that.itemMgr.itemGroup_);
    for (var i in otherLockGroup_) {
      lockMgr_.addLockGroup(otherLockGroup_[i]);
    }
  }

  init();
}

UserEquip.prototype = new LocalStorageMgr("EQUIP");
