/**
 * Metadata for settings mgt
 */
function Settings() {
  // default values
  var groupDefaultArray_ = [
    {
      name: "Sound",
      msg: "Sound Fx",
      defaultValue: 1
    },
    {
      name: "Music",
      msg: "Bg Music",
      defaultValue: 1
    },
    {
      name: "GameMusic",
      msg: "Game Music",
      defaultValue: 1
    },
    {
      name: "ArrowControl",
      msg: "Arrow Ctrl",
      defaultValue: 1
    },
    {
      name: "DisplayPosition",
      msg: "Position Bar",
      defaultValue: 1
    },
    {
      name: "GraphicLow",
      msg: "Low Graphics",
      defaultValue: 0
    },
    {
      name: "turnOnFacebook",
      msg: "Facebook WallPost",
      defaultValue: 1
    }
  ];

  // hash not guarantee order
  var groupDefaultHash_ = Util.createHashFromArray(groupDefaultArray_, "name");

  this.getValue = function (group) {
    if (!groupDefaultHash_.hasOwnProperty(group)) {
      console.error(group + " not in setting");
      return 0;
    }
    var value = localStorage.getItem(this.prefix + "_" + group);
    if (!value) {
      return groupDefaultHash_[group].defaultValue;
    }
    return parseInt(value);
  };

  this.setValue = function (value, item) {
    item = item || "";
    if (DEBUG_.userAtt) {
      console.log("set " + " : " + value);
    }
    localStorage.setItem(this.prefix + "_" + item, value);
  };

  this.resetAllSetting = function () {
    for (var eachGroup in groupDefaultHash_) {
      this.setValue(groupDefaultHash_[eachGroup].defaultValue, eachGroup);
    }
  };

  this.getGroupAsArray = function () {
    return groupDefaultArray_;
  };
}

Settings.prototype = new LocalStorageMgr("SETTINGS");
