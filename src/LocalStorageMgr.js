/**
 * Local Storage Generator
 *
 * @param prefix
 * @constructor
 */
function LocalStorageMgr(prefix) {
  this.prefix = prefix;
  this.updateServerInterval = 10; // second
  this.lastUpdateTime = 0; // second
}

// the path is made up from a prefix and a user Id
LocalStorageMgr.prototype.getPath = function () {
  if (!this.userId) {
    console.error("userId not valid");
    return "";
  }
  if (Util.isTrialVersion()) {
    return this.prefix + "_trial_" + this.userId + "_";
  }
  return this.prefix + "_" + this.userId + "_";
};

LocalStorageMgr.prototype.setValue = function (value, item) {
  item = item || "";
  if (DEBUG_.userAtt) {
    console.error("set " + this.getPath() + item + " : " + value);
  }
  localStorage.setItem(this.getPath() + item, value);
};

LocalStorageMgr.prototype.getValue = function (item) {
  item = item || "";
  if (DEBUG_.userAtt) {
    console.log("get " + this.getPath() + item + ":" + localStorage.getItem(this.getPath() + item));
  }
  return localStorage.getItem(this.getPath() + item);
};

// establish a different user for the UA manager
LocalStorageMgr.prototype.resetUser = function (userId) {
  this.userId = userId;
};
