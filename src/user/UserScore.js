function UserGameScore() {
  var currSongName_;
  var currSongDifficulty_;
  var that = this;
  this.currentScore = 0;
  this.accAdded = 0;
  this.accNum = 0;

  var bestCurrPathSuffix_;
  var bestScoreSuffix_ = "best_score";
  var bestAccSuffix_ = "best_acc";
  var bestStarSuffix_ = "best_star";
  var bestValue_ = {
    comboUGS: 1
  };
  var allSongInfo_ = Util.readJson(R_ + "/songControl.json");
  this.difficultyRange = [0, 1, 2];
  this.isAllCombo = false;

  //var parseObj_ = Parse.Object.extend("UserScoreTable");

  this.getAllSongInfo = function () {
    return allSongInfo_;
  };

  /*
   function createParseJson(columnUpdateJson) {
   return {
   "parseObj": parseObj_,
   "idForSearch": {
   "userId": that.userId,
   "songName": currSongName_
   },
   "columnUpdate": columnUpdateJson
   }
   }
   */
  function getSuffixFromScoreType(type) {
    return "best_" + type;
  }

  this.setBest = function (type, value) {
    if (!bestValue_.hasOwnProperty(type)) {
      console.error(type + " is not in bestValue_");
      return;
    }
    setCurrSongValue(value, getSuffixFromScoreType(type));
  };

  this.getBest = function (type) {
    return getCurrSongValue(getSuffixFromScoreType(type));
  };

  function setCurrSongValue(value, type, parseInfo) {
    that.setValue(value, bestCurrPathSuffix_ + "_" + type, parseInfo);
  }

  function getCurrSongValue(type) {
    return parseInt(that.getValue(bestCurrPathSuffix_ + "_" + type)) || 0;
  }

  function setSongValue(value, songName, difficulty, type) {
    that.setValue(value, getPathFull(songName, difficulty, type));
  }

  function getSongValue(songName, difficulty, type) {
    return parseInt(that.getValue(getPathFull(songName, difficulty, type))) || 0;
  }

  function getPathSuffixNoType(songName, difficulty) {
    return (songName + "_" + difficulty);
  }

  function getPathFull(songName, difficulty, type) {
    return getPathSuffixNoType(songName, difficulty) + "_" + type;
  }

  this.setSongName = function (songName) {
    currSongName_ = songName;
    bestCurrPathSuffix_ = getPathSuffixNoType(currSongName_, currSongDifficulty_);
    return this;
  };

  this.setSongDifficulty = function (val) {
    currSongDifficulty_ = val;
    bestCurrPathSuffix_ = getPathSuffixNoType(currSongName_, currSongDifficulty_);
    return this;
  };

  this.setSong = function (songName, songDifficulty) {
    currSongName_ = songName;
    currSongDifficulty_ = songDifficulty;
    bestCurrPathSuffix_ = getPathSuffixNoType(currSongName_, currSongDifficulty_);
  };

  this.setBestScore = function (value, loggedIn) {
    setCurrSongValue(value, bestScoreSuffix_);
    if (true || loggedIn) {
      Backend.checkAndUpdateHighScore(this.userId, currSongName_, value);
    }
  };

  this.getBestScore = function () {
    return getCurrSongValue(bestScoreSuffix_);
  };

  this.setBestAcc = function (value) {
    setCurrSongValue(value, bestAccSuffix_);
  };

  this.getBestAcc = function () {
    return getCurrSongValue(bestAccSuffix_);
  };

  function setSongStar(value, songName, difficulty) {
    setSongValue(value, songName, difficulty, bestStarSuffix_);
  }

  this.getSongStar = function (songName, difficulty) {
    return getSongValue(songName, difficulty, bestStarSuffix_);
  };

  this.getCurrSongStar = function () {
    return this.getSongStar(currSongName_, currSongDifficulty_);
  };

  this.getSongBestScore = function (songName, difficulty) {
    return getSongValue(songName, difficulty, bestScoreSuffix_);
  };

  this.checkAndSetCurrSongStar = function (value) {
    var oldValue = this.getCurrSongStar();
    if (value > oldValue) {
      setSongStar(value, currSongName_, currSongDifficulty_);
    }
  };

  this.resetValue = function () {
    for (var i in allSongInfo_) {
      var songName = i;
      for (var j in this.difficultyRange) {
        var difficulty = this.difficultyRange[j];
        setSongStar(0, songName, difficulty);
        setSongValue(0, songName, difficulty, bestScoreSuffix_);
        setSongValue(0, songName, difficulty, bestAccSuffix_);
      }
    }
  };
}

UserGameScore.prototype = new LocalStorageMgr("SCORE");

