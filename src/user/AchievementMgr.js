function AchievementMgr (director, userMoney) {
  this.director = director;
  this.userMoney = userMoney;
  this.init();
}

AchievementMgr.prototype = new LocalStorageMgr("ACH");

AchievementMgr.prototype.init = function() {
  this.initData();
  this.initGroupMap();
};

// save to database
AchievementMgr.prototype.saveCurrentValueToDB = function() {

};

AchievementMgr.prototype.queryCurrentValueFromDB = function() {
  // from web database
};

AchievementMgr.prototype.getValueFromLocal = function(achName, attr) {
  var value = parseFloat(this.getValue(this.getPathSuffix(achName, attr))) || 0 ;
  return value;
};

AchievementMgr.prototype.resetAllGroup = function() {
  for (var groupName in this.groupMap) {
    this.resetGroup(groupName);
  }
};

AchievementMgr.prototype.resetGroup = function(groupName) {
  var groups = this.groupMap[groupName];
  for (var i in groups) {
    var achName = groups[i];
    this.setValueToLocal(achName, 0, "currentValue");
    this.setValueToLocal(achName, 0, "isAchieved");
  }
};

AchievementMgr.prototype.setValueToLocal = function(achName, value, attr) {
  this.setValue(value, this.getPathSuffix(achName, attr));
};

AchievementMgr.prototype.getPathSuffix = function(achName, attr) {
  return achName + "_" + attr;
};

AchievementMgr.prototype.checkAndUpdate = function(groupName, value, isIncremental){
  var groups = this.groupMap[groupName];
  var currentValue;
  var achievedItems = [];
  for (var i in groups) {
    var achName = groups[i];

    var isAchieved =  this.getValueFromLocal(achName, "isAchieved");
    // check whether already achieved
    if (isAchieved >= 1 ) {
      continue;
    }

    var achievement = this.achievements[achName];
    if (isIncremental) {
      // only when incremental, get value , add to it then save it.
      currentValue =  parseInt(this.getValueFromLocal(achName, "currentValue")) + value;
      this.setValueToLocal(achName, currentValue, "currentValue");
      var percent = currentValue/achievement.threshold;
      this.setValueToLocal(achName, percent, "isAchieved");
    } else {
      currentValue = value;
    }

    // check with threshold
    if (currentValue < achievement.threshold) {
      continue;
    }

    // achieved, update
    this.setValueToLocal(achName, 1, "isAchieved");
    achievedItems.push(achName);
    this.addReward(achievement.reward);
  }

  // notify on screen
  if  (achievedItems.length > 0) {
    this.notifyUserAchieved(achievedItems);
  }

};

// notify the user when one or more items is achieved
AchievementMgr.prototype.notifyUserAchieved = function(achNameArray) {
  //popUp.setSize(300,200).centerAt(this.director.width/2, this.director.height/2);
  for (var i in achNameArray) {
    var achName=achNameArray[i];
    var achievement=this.achievements[achName];
    Util.popUpAchieve(this.director,achievement.description,achievement.img);
  }
};

// after each achievement add the reward to this user
AchievementMgr.prototype.addReward = function(rewardCount) {
  this.userMoney.addGems(rewardCount);
};


// use enum as string  in the json
AchievementMgr.prototype.initAllEnum = function() {

};

// group all the achievement together with same currentValue
AchievementMgr.prototype.initGroupMap = function() {

  this.groupMap = {};
  for (var i in this.achievements) {
    var groupName = this.achievements[i].group;
    if (!this.groupMap.hasOwnProperty(groupName)) {
      this.groupMap[groupName] = [];
    }
    this.groupMap[groupName].push(i);
  }
};

AchievementMgr.prototype.initData = function() {

  // structure:
  // description: text show on screen
  // threshold: target value to achieve
  // reward: currency(carrot) reward quantity
  // group: similar achievement grouping together for easier checking value
  // img: image index to draw on screen
  this.achievements={
    "arhSample" : {
      "description":"Been in song chosen page for 100 times",
      "threshold":100,
      "reward": 2,
      "group": "groupSample",
      "img":"songbook100"
    },
    "FBLogin" : {
      "description":"Login with Facebook",
      "currentValue":"",
      "threshold":1,
      "reward":2,   // unit :reward
      "group": "FBLoginCount",
      "img":"achieveFacebook"
    },
    "FBLoginThreeTimes":{
      "description":"Login with Facebook 10 times",
      "threshold":10,
      "reward":5,
      "group": "FBLoginCount",
      "img":"achieveFriends5"
    },
    "Accuracy85":{
      "description":"Get 85% accuracy in one play",
      "type":"value",
      "value":0.85,
      "threshold":85,
      "reward":2,
      "group": "highAcc",
      "img":"achieveAccuracy85"
    },
    "HighScore2000":{
      "description":"Achieve 2000 score in one run",
      "type":"value",
      "value":"",
      "threshold":2000,
      "reward":2,
      "group": "highScore",
      "img":"achieveGeneral"
    },
    "HighScore3000":{
      "description":"Achieved 3000 score in one run",
      "type":"value",
      "value":"",
      "threshold":3000,
      "group": "highScore",
      "reward":3,
      "img":"achieveScore3000"
    },
    "HighScore5000":{
      "description":"Achieved 5000 score in one run",
      "type":"value",
      "value":"",
      "threshold":5000,
      "group": "highScore",
      "reward":6,
      "img":"achieveScore5000"
    },
    "HighScore8000":{
      "description":"Achieved 8000 score in one run",
      "type":"value",
      "value":"",
      "threshold":8000,
      "group": "highScore",
      "reward":20,
      "img":"achieveScore8000"
    },
    "achTrueHacker": {
      "description":"All combo with accuracy less than 36%",
      "type":"boolean",
      "value":"",
      "threshold":-36,
      "reward":100,
      "group": "achTrueHacker",
      "img":"trueHacker"
    }
  };
};
