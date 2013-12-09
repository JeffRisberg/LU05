/**
 * A episode score is based on an EpisodeId and a difficulty level
 *
 * within each of these pairs, there are three values {score, acc, star)
 * @author various
 * @since May 2013
 */
function UserEpisodeScore(episodeMgr) {
  var that = this;
  var episodeMgr_ = episodeMgr;

  this.difficultyRange = [0, 1, 2];

  var currEpisodeInfo_;
  var currEpisodeDifficulty_;

  var bestCurrPathSuffix_; // derived from currEpisodeName, currEpisodeDifficulty
  var bestScoreSuffix_ = "best_score";
  var bestAccSuffix_ = "best_acc";
  var bestStarSuffix_ = "best_star";

  this.currentScore = 0;
  this.accAdded = 0;
  this.accNum = 0;

  var bestValue_ = {
    comboUGS: 1
  };

  /** change one selector field */
  this.setEpisodeInfo = function (episodeInfo) {
    currEpisodeInfo_ = episodeInfo;
    bestCurrPathSuffix_ = getPathSuffixNoType(currEpisodeInfo_.name, currEpisodeDifficulty_);
    return this;
  };

  /** change one selector field */
  this.setEpisodeDifficulty = function (episodeDifficulty) {
    currEpisodeDifficulty_ = episodeDifficulty;
    bestCurrPathSuffix_ = getPathSuffixNoType(currEpisodeInfo_.name, currEpisodeDifficulty_);
    return this;
  };

  /** change two selector fields */
  this.setEpisode = function (episodeInfo, episodeDifficulty) {
    currEpisodeInfo_ = episodeInfo;
    currEpisodeDifficulty_ = episodeDifficulty;
    bestCurrPathSuffix_ = getPathSuffixNoType(currEpisodeInfo_.name, currEpisodeDifficulty_);
  };

  this.setCurrBestScore = function (value, loggedIn) {
    setCurrEpisodeValue(value, bestScoreSuffix_);
    if (true || loggedIn) {
      Backend.checkAndUpdateHighScore(this.userId, currEpisodeInfo_, value);
    }
  };

  this.getCurrBestScore = function () {
    return getCurrEpisodeValue(bestScoreSuffix_);
  };

  this.setCurrBestAcc = function (value) {
    setCurrEpisodeValue(value, bestAccSuffix_);
  };

  this.getCurrBestAcc = function () {
    return getCurrEpisodeValue(bestAccSuffix_);
  };

  this.setCurrBestStar = function (value) {
    setCurrEpisodeValue(value, bestStarSuffix_);
  };

  this.getCurrBestStar = function () {
    return getCurrEpisodeValue(bestStarSuffix_);
  };

  this.setBestScore = function (value, episodeInfo, difficulty) {
    setEpisodeValue(value, episodeInfo, difficulty, bestScoreSuffix_);
  }

  this.getBestScore = function (episodeInfo, difficulty) {
    return getEpisodeValue(episodeInfo, difficulty, bestScoreSuffix_);
  };

  this.setBestAcc = function (value, episodeInfo, difficulty) {
    setEpisodeValue(value, episodeInfo, difficulty, bestAccSuffix_);
  }

  this.getBestAcc = function (episodeInfo, difficulty) {
    return getEpisodeValue(episodeInfo, difficulty, bestAccSuffix_);
  };

  this.setBestStar = function (value, episodeInfo, difficulty) {
    setEpisodeValue(value, episodeInfo, difficulty, bestStarSuffix_);
  };

  this.getBestStar = function (episodeInfo, difficulty) {
    return getEpisodeValue(episodeInfo, difficulty, bestStarSuffix_);
  };

  function getSuffixFromScoreType(type) {
    return "best_" + type;
  }

  this.setCurrBest = function (type, value) {
    if (!bestValue_.hasOwnProperty(type)) {
      console.error(type + " is not in bestValue_");
      return;
    }
    setCurrEpisodeValue(value, getSuffixFromScoreType(type));
  };

  this.getCurrBest = function (type) {
    return getCurrEpisodeValue(getSuffixFromScoreType(type));
  };

  /** special */
  this.checkAndSetCurrEpisodeStar = function (currStar) {
    var oldStarValue = this.getCurrBestStar();
    if (currStar > oldStarValue) {
      this.setCurrBestStar(currStar);
    }
  };

  /**
   * Clear out all scores, actually set them to zero
   */
  this.resetValue = function () {
    var episodeList = episodeMgr.getEpisodeList()
    for (var i in episodeList) {
      var episodeInfo = episodeList[i];

      for (var j in this.difficultyRange) {
        var difficulty = this.difficultyRange[j];

        this.setBestScore(0, episodeInfo, difficulty);
        this.setBestAcc(0, episodeInfo, difficulty);
        this.setBestStar(0, episodeInfo, difficulty);
      }
    }
  };

  // non-exported functions below here

  function setCurrEpisodeValue(value, type, parseInfo) {
    that.setValue(value, bestCurrPathSuffix_ + "_" + type, parseInfo);
  }

  function getCurrEpisodeValue(type) {
    return parseInt(that.getValue(bestCurrPathSuffix_ + "_" + type)) || 0;
  }

  function setEpisodeValue(value, episodeInfo, difficulty, type) {
    that.setValue(value, getPathFull(episodeInfo.name, difficulty, type));
  }

  function getEpisodeValue(episodeInfo, difficulty, type) {
    return parseInt(that.getValue(getPathFull(episodeInfo.name, difficulty, type))) || 0;
  }

  function getPathSuffixNoType(episodeInfo, difficulty) {
    return (episodeInfo.name + "_" + difficulty);
  }

  function getPathFull(episodeInfo, difficulty, type) {
    return getPathSuffixNoType(episodeInfo, difficulty) + "_" + type;
  }
}

UserEpisodeScore.prototype = new LocalStorageMgr("SCORE");
