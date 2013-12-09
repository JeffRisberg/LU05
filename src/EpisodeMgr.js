/**
 * Subset of the real episode manager.
 *
 * This doesn't have a backend, it has a static list of episodes.
 */
function EpisodeMgr() {

  var episodeList_;  // store all episodes in array
  var episodeInfo_;  // store all episodes in hash, key is "name"
  var episodeNameList_;
  var episodeNameToID_; // episode "name" map to "id"

  var currentEpisodeInfo_;
  var currentEpisodeName_;
  var currentSongName_;

  reset();
  init();

  // define all private variable default values
  function reset() {
    episodeList_ = [];
    episodeInfo_ = {};
    episodeNameList_ = [];
    episodeNameToID_ = {};

    currentEpisodeInfo_ = {};
    currentEpisodeName_ = "";
    currentSongName_ = "";
  }

  // initialize
  function init() {
    var that = this;

    var episode1 = {
      "id": 1,
      "name": "Attack the Troll",
      "description": "The troll is easy to kill",
      "avgGain": 300,
      "price": 3,
      "background": "sky",
      "music": "Fluffing a Duck"
    };

    var episode2 = {
      "id": 2,
      "name": "Attack the Ogre",
      "description": "The ogre is medium to kill",
      "avgGain": 900,
      "price": 3,
      "background": "forestNight",
      "music": "Jingle Bell"
    };

    var episode3 = {
      "id": 3,
      "name": "Attack the Dragon",
      "description": "The dragon is hard to kill",
      "avgGain": 1500,
      "price": 3,
      "background": "forestNight",
      "music": "Jingle Bell"
    };

    var epiList = [];

    epiList.push(episode1);
    epiList.push(episode2);
    epiList.push(episode3);

    episodeList_ = epiList;
    episodeInfo_ = Util.createHashFromArray(episodeList_, "name");
    setEpisodeNameList();
  }

// create episode name list array in order
  function setEpisodeNameList() {
    for (var arrayIndex in episodeList_) {
      var episodeInfo = episodeList_[arrayIndex];

      episodeNameToID_[episodeInfo.name] = episodeInfo.id;
      episodeNameList_.push(episodeInfo.name);
    }
  }

/////////////////////////
// public functions
/////////////////////////

  this.setIndex = function (episodeName) {
    if (DEBUG_.episodeMgr) {
      console.log("New Episode Index " + episodeName);
    }
    currentEpisodeName_ = episodeName;
    currentEpisodeInfo_ = episodeInfo_[episodeName];
    currentSongName_ = currentEpisodeInfo_.music;
  };

// reset to previous episode choice
  this.resetToLastEpisode = function () {
    this.setDifficulty(lastDifficulty_);
    this.setIndex(lastEpisodeName_);
  };

  this.isEpisodeOnlyFullVersion = function (episodeName) {
    return (episodeInfo_[episodeName].hasOwnProperty("onlyFullVersion") && episodeInfo_[episodeName]["onlyFullVersion"]);
  };

  this.getEpisodeList = function () {
    return episodeList_;
  };

  this.getEpisodeInfo = function () {
    return episodeInfo_;
  }

  this.getEpisodeNameList = function () {
    return episodeNameList_;
  };

  this.getEpisodeIDFromName = function (name) {
    return episodeNameToID_[name];
  };

  this.getCurrentEpisodeInfo = function () {
    return currentEpisodeInfo_;
  };

  this.getCurrentEpisodeIndex = function () {
    return episodeNameList_.indexOf(currentEpisodeName_);
  };

  this.getCurrentEpisodeName = function () {
    return currentEpisodeName_;
  };
}
