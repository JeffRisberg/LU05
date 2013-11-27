/**
 * User: Niu Niu
 * Date: 3/4/13
 * All rights reserved by Africa Swing
 */

function UserMisc() {
  var group_ = [
    {
      name: "isFirstTimePlay",
      resetValue: 1
    }
  ];

  this.getValueIsFirstTimePlay = function() {
    return parseInt(this.getValue("isFirstTimePlay"))
  };

  this.resetMisc = function() {
    for (var i in group_) {
      this.setValue(group_[i].resetValue, group_[i].name);
    }
  }
}

UserMisc.prototype = new LocalStorageMgr("MISC");
