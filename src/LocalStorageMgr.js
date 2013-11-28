/**
 * The <i>LocalStorageMgr</i> is primarily a generator of keypaths for entries in the local
 * storage facility of the browser.
 *
 * @author Linghua, others
 * @since April 2013
 */
function LocalStorageMgr(prefix) {
  this.prefix = prefix;
  this.updateServerInterval = 10; // second
  this.lastUpdateTime = 0; // second
}

/**
 * A path is made up from a prefix and a user Id
 */
LocalStorageMgr.prototype.getPath = function () {
  if (!this.userId) {
    console.error("userId not valid");
    return "";
  }
  if (Util.isTrialVersion()) {
    return this.prefix + "_trial_" + this.userId + "_";
  }
  else {
    return this.prefix + "_" + this.userId + "_";
  }
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

// establish a different user
LocalStorageMgr.prototype.resetUser = function (userId) {
  this.userId = userId;
};
