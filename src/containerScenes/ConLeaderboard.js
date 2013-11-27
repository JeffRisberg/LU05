SceneMgr.prototype.conLeaderboard = function (parent) {
  var that = this;
  that.leaderboardData.updateFromServer();

  var topCon = that.createConBG();
  var userScore = that.userInfo.score;

  var oneRowFontSize = 26 * sf;
  var displayRows = 10;

  if (W_ / H_ > 1.82) {
    oneRowFontSize = 20 * sf;
  }
  if (W_ / H_ < 1.5) {
    oneRowFontSize = 35 * sf;
  }
  var oneRowHeight = oneRowFontSize + 1 * sf
  var episodeTitleFontSize = oneRowFontSize + 5 * sf
  var settingFontColor = FONT_COLOR;

  function destroyTopCon() {
    Util.destroyObj(topCon);
    parent.backFromCon();
    that.conReturnCommonDo();
  }

  var bgX = 0.18 * W_; //bgX representing the craft paper bg starting x
  var bgY = 0;//bgY representing the craft paper bg starting x

  var containerBg = Util.createImageConInBound(that.director, "containerBg", bgX, bgY, W_ * 0.65, H_)
    .enableEvents(false);
  topCon.addChild(containerBg);

  var episodeNameWidth = containerBg.width * 0.7;
  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", destroyTopCon, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  var songList = this.audioMgr.songList; //TODO: think for locker
  var currentSong = that.episodeMgr.songName;
  var currentSongIndex = songList.indexOf(currentSong);

  var rbsSmall = RBS_ * 0.7;

  // text area that shows current song's leader board
  var episodeNameTextArea = new WrapFont(currentSong, episodeTitleFontSize, settingFontColor).
    setSize(episodeNameWidth, 65 * sf).
    setAlign("center");

  // create button to change current song
  function songIndexChange(delta) {
    var newSongIndex = currentSongIndex + delta;
    if (newSongIndex == songList.length) {
      newSongIndex = 0;
    }
    if (newSongIndex < 0) {
      newSongIndex = songList.length - 1;
    }
    if (newSongIndex >= 0 && newSongIndex < songList.length) {
      currentSong = songList[newSongIndex];
      currentSongIndex = newSongIndex;
      episodeNameTextArea.setText(currentSong);
      applyToLeaderboard(currentSong);
    }
  }

  var difficultyInfoTextArea = new WrapFont("Easy, 0.5X", 20 * sf, FONT_COLOR).setSize(120 * sf, 50 * sf);
  songNameTextArea.centerAt(containerBg.width / 2, containerBg.height * 0.2);
  //containerBg.addChild(songNameTextArea);

  var distanceFromBg = 10 * sf;
  var btnLeft = Util.createButtonWithImageFunWH(that.director, "btnLeft",
    function () {
      songIndexChange(-1);
    }, RBS_, RBS_);
  btnLeft.setLocation(bgX - distanceFromBg - RBS_, H_ / 2 - RBS_ / 2).setAlpha(0.9);
  topCon.addChild(btnLeft);
  var btnRight = Util.createButtonWithImageFunWH(that.director, "btnRight",
    function () {
      songIndexChange(1);
    }, RBS_, RBS_);
  btnRight.setLocation(bgX + containerBg.width + distanceFromBg, H_ / 2 - RBS_ / 2).setAlpha(0.9);
  topCon.addChild(btnRight);

  var currentSelect = undefined;

  function addOneSongToSlider(songId, slider) {
    function pressDo() {
      currentSelect = songId;
      applyToLeaderboard(songId);
    }

    var button = Util.createButtonWithTextFun(songId, pressDo);
    var buttonCon = Util.createAlignContainerWithActor(false, [button]);
    slider.addItem(buttonCon);
  }

  // create leaderboard view
  var disFromBgEdge = 100 * sf;
  var leaderboardSliderW = containerBg.width - 2 * disFromBgEdge;

  // init wrapfont
  var fontSize = 20 * sf;
  var rankW = 40 * sf;
  var scoreW = 70 * sf;
  var wrapFontH = 360 * sf;
  var rankList = new WrapFont("", fontSize).setSize(rankW, wrapFontH).setAutoLayout(true);
  var nameList = new WrapFont("", fontSize).setSize(leaderboardSliderW - rankW - scoreW, wrapFontH)
    .setAutoLayout(true);
  var scoreList = new WrapFont("", fontSize).setSize(scoreW, wrapFontH).setAutoLayout(true);

  //TODO: 1)associate with user score

  var leaderContent = createDummyLeaderContent();
  var userRankActor = Util.createText("", 20 * sf);
  var userRankCon = Util.createConWrapper(userRankActor);
  userRankCon.setSize(leaderContent.width, userRankCon.height)
  var leaderContentWrapper = Util.createConWrapper(leaderContent);
  //put songNameTextArea here for now
  var leaderCon = Util.createAlignContainerWithActor(true, [songNameTextArea, leaderContentWrapper, userRankCon], 0);
  Util.changeLayoutAlignOnActor(leaderCon, "CENTER", "CENTER");
  leaderCon.setLocation(disFromBgEdge, 60 * sf);//songNameTextArea.height + 50*sf
  containerBg.addChild(leaderCon);

  // TODO: create less text

  function createOneRowAuto(rank, name, score, size) {
    var prefix = "\n";

    if (rankList.getContent() != "") {
      rank = prefix + rank;
      name = prefix + name;
      score = prefix + score;
    }

    rankList.appendText(rank);
    nameList.appendText(name);
    scoreList.appendText(score);
  }

  function createOneRowNew(rank, name, score, isUserInRank) {
    var rankActor = Util.createText(rank, oneRowFontSize).setSize(50 * sf, oneRowFontSize)//new WrapFont(rank, size).setSize(50*sf, size);
    var scoreActor = Util.createText(score, oneRowFontSize, null, FONT_COLOR)// new WrapFont(score, size).setSize(100*sf, size);
    var nameActor = new WrapFont(name, oneRowFontSize)
      .setSize(leaderboardSliderW * 0.65, oneRowHeight);

    var con = Util.createAlignContainerWithActor(HORIZONTAL, [rankActor, nameActor, scoreActor], 0);

    if (isUserInRank) {
      con.setFillStyle('green').setAlpha(0.3);
    }
    return con;
  }

  function createOneRowOld(rank, name, score, size) {

    var rankActor = Util.createText(rank, size);
    rankActor.setSize(100, rankActor.height);
    var scoreActor = Util.createText(score, size);
    scoreActor.setSize(100, scoreActor.height);
    var nameActor = Util.createText(name, size);
    nameActor.setSize(leaderboardSliderW - rankActor.width - scoreActor.width, nameActor.height);
    return Util.createAlignContainerWithActor(HORIZONTAL, [rankActor, nameActor, scoreActor], 0);
  }

  function applyToLeaderboard(episodeId) {
    var resultList = that.leaderboardData.getValueFromLocal(episodeId);
    if (!resultList) {
      resultList = [];
    }
    var isUserInTheRank = false;
    var isUserInsertedInTheRank = false;
    var rankOffset = 1;
    var listOfRank = [];

    var userCurrentBestScore = getUserCurrentBestScore(songId);

    var totalIndex = resultList.length;
    var oneRow;
    for (var i = 0; i < totalIndex; i++) {
      var resultJson = resultList[i];
      if (!isUserInTheRank && resultJson["bestScore"] < userCurrentBestScore) {
        oneRow = createOneRowNew(i + rankOffset, that.userInfo.getUserName(), userCurrentBestScore, true);
        listOfRank.push(oneRow);
        rankOffset++;
        totalIndex--;
        isUserInsertedInTheRank = true;
        isUserInTheRank = true;
      }

      if (resultJson["userName"] == that.userInfo.getUserName()) {
        isUserInTheRank = true;
        if (isUserInsertedInTheRank) {
          // already has this user, reset totalIndex to original, and skip it
          totalIndex++;
          rankOffset--;
          continue;
        }
        // highlight
        oneRow = createOneRowNew(i + rankOffset, resultJson["userName"], resultJson["bestScore"], true);
      } else {
        oneRow = createOneRowNew(i + rankOffset, resultJson["userName"], resultJson["bestScore"]);
      }
      listOfRank.push(oneRow);
    }

    if (!isUserInTheRank && userCurrentBestScore && totalIndex < displayRows) {
      oneRow = createOneRowNew(i + rankOffset, that.userInfo.getUserName(), userCurrentBestScore, true);
      listOfRank.push(oneRow);
      isUserInTheRank = true;
    }

    // destroy and removed from leaderContentWrapper
    Util.destroyObj(leaderContent);
    leaderContent = Util.createAlignContainerWithActor(VERTICAL, listOfRank, 5 * sf);
    leaderContentWrapper.addChild(leaderContent);

    if (isUserInTheRank) {
      userRankActor.setText("");
    } else if (!userCurrentBestScore) {
      userRankActor.setText("You have no score on this song");
    } else {
      userRankActor.setText("Your score " + userCurrentBestScore);
    }
  }

  function createDummyLeaderContent() {
    var listOfRank = [];
    for (var i = 1; i <= displayRows; i++) {
      listOfRank.push(createOneRowNew(i, "", 0));
    }
    return Util.createAlignContainerWithActor(VERTICAL, listOfRank, 5 * sf);
  }

  function getUserCurrentBestScore(episodeId) {
    var max = 0;
    for (var i in userScore.difficultyRange) {
      var score = userScore.getSongBestScore(episodeId, userScore.difficultyRange[i]);
      if (score > max) {
        max = score;
      }
    }
    return max;
  }

  applyToLeaderboard(currentEpisode);
  return topCon;
};
