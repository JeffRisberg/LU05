/**
 * User: Niu Niu
 * Date: 5/12/13
 * All rights reserved by Africa Swing
 */

function UserLicense(lockMgr_) {

  var licenseGroup_ = [
    {
      name:"Monkey",
      image:"maskMonkey",
      rabbitImageWithMask: "",
      price:1,
      bloodReduce: 0.2,
      acc: 0,
      difficulty:0,
      //unit:"gem",
      msg:"Challenge and gain the mask of Monkey"
    },

    { name:"Zebra",
      image:"maskZebra",
      price:2,
      bloodReduce: 0.3,
      difficulty:0,
      acc: 91,
      fun:function () {
      },
      // unit:"gem"
      msg:"Challenge and gain the mask of Zebra"
    },
    {
      name:"Bull",
      image:"maskBull",
      price:3,
      bloodReduce: 0.4,
      difficulty:1,
      acc: 0,
      fun:function () {
      },
      msg:"Challenge and gain the mask of Buffalo "
    },
    {
      name:"Tiger",
      image:"maskTiger",
      price:4,
      bloodReduce: 0.5,
      difficulty:1,
      acc: 92,
      fun:function () {
      },
      msg:"Challenge and gain the mask of Tiger"
    },
    {
      name:"Lion",
      image:"maskLion",
      price:5,
      bloodReduce: 0.75,
      difficulty:2,
      acc: 0,
      fun:function () {
      },
      msg:"Challenge and gain the mask of King"
    }
  ];

  var currentChallengeLicense_;

  this.getCurrentChallengeLicenseObj = function() {
    for (var i in licenseGroup_) {
      if (licenseGroup_[i].name == currentChallengeLicense_) {
        return licenseGroup_[i];
      }
    }
    return "";
  };

  this.getLicenseGroup = function() { return licenseGroup_;};

  this.resetLicense = function() {
    this.setValue("");
    for (var i in licenseGroup_) {
      this.setValue("", licenseGroup_[i].name);
    }
  };

  this.setCurrentChallengeLicense = function(val) {
    currentChallengeLicense_ = val;
  };

  this.passedCheckAndStore = function() {
    var currentHighest = this.getValue()
    var hasNewHigh = false;
    for (var i in licenseGroup_) {
      var name = licenseGroup_[i].name;
      if (name == currentChallengeLicense_) {
        break;
      }
      if (name == currentHighest) {
        hasNewHigh = true;
        break;
      }
    }
    this.setValue(currentChallengeLicense_);
  };

  this.getHighestLicense = function() {
    return this.getValue();
  };

  this.passedCurrent = function() {
    this.setValue(1, currentChallengeLicense_);
    this.passedCheckAndStore();
  };

  this.getHighestLicenseGroup = function() {
    var high  = this.getValue();
    if (!high) {return "";}
    for (var i in licenseGroup_) {
      if (licenseGroup_[i].name == high) {
        return licenseGroup_[i];
      }
    }
    return "";
  };

}

UserLicense.prototype = new LocalStorageMgr("LICENSE");
