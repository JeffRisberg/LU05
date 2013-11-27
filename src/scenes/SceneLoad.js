/**
 * The load scene is shown before you start playing the game world
 *
 * @param sceneName
 */
SceneMgr.prototype.addSceneLoad = function (sceneName) {
  var that = this;

  var scene = this.createEmptyScene(sceneName);
  that.addBG(scene, "general");

  // check loading
  var imageReady;
  var audioReady;
  var loadingPercent = 0;

  var loadingText = Util.createText("Loading ... " + loadingPercent + "%");
  scene.addChild(loadingText);

  var audio = that.audioMgr.audio;
  var time;

  function incrementLoadingPercent(percent) {
    loadingPercent += percent;

    if (loadingPercent > 100) {
      if (DEBUG_.notRelease) {
        console.error("loading exceed 100% as ", loadingPercent);
      }
      loadingPercent = 100;
    }

    loadingText.setText("Loading ... " + loadingPercent + "%");
    loadingText.centerAt(W_ / 2, H_ / 2 - 100 * sf);
  }

  function checkAndGo() {
    if (DEBUG_.loading) {
      console.log("loading image status: " + imageReady + " audio: " + audioReady);
    }
    if (!imageReady || !audioReady) {
      return;
    }

    // reset to prevent others ready
    imageReady = false;
    audioReady = false;

    // remove it first to avoid adding twice
    if (that.setting.directPlay == 0) {
      scene.removeChild(button);
      scene.addChild(button);
    } else {
      var showTime = that.setting.directPlay;
      var diffTime = new Date().getTime() - time;

      if (diffTime < showTime) {
        diffTime = Math.abs(showTime - diffTime);
        if (diffTime > showTime) {
          diffTime = showTime;
        }

        setTimeout(
          function () {
            that.switchTo(that.loadData.sceneAfterLoad);
          },
          diffTime);
      } else {
        that.switchTo(that.loadData.sceneAfterLoad);
      }
    }
  }

  // load after go in to this scene
  scene.activated = function () {
    // find the chosen episode by asking episodeMgr
    alert(that.episodeMgr.getCurrentEpisodeInfo().name);
    alert(that.episodeMgr.getCurrentEpisodeInfo().music);
    alert(that.episodeMgr.getCurrentEpisodeInfo().background);

    time = new Date().getTime();
    scene.goOut();

    // set audio
    that.audioMgr.resetAudio();
    that.audioMgr.setSrc(that.episodeMgr.getCurrentEpisodeInfo().music);

    audio = that.audioMgr.audio;
    audio.addEventListener('canplaythrough', function (e) {
      audio.currentTime = 0;
      audioReady = true;
      incrementLoadingPercent(30);
      if (DEBUG_.loading) {
        console.log(audio.src + " is ready, loaded " + loadingPercent + "%");
      }
      that.audioMgr.lastSrc = audio.src;
      checkAndGo();
    }, false);
    //that.audioMgr.setSrc();

    if (audioReady) {
      // if it is already loaded , then done
    } else {
      if (that.audioMgr.lastSrc != audio.src) {
        that.audioMgr.lastSrc = audio.src;
      } else {
        // cached (same as last time), done;
        audioReady = true;
        incrementLoadingPercent(30);
      }
    }
    imageReady = false;

    audio.load();
    if (DEBUG_.loading) {
      console.log("command audio.load()  src:", audio.src);
    }

    audio.addEventListener('error', function () {
      if (that.director.getCurrentScene() == scene) {
        audio.src = R_ + "/music/demo" + MF_;
        audio.load();
      }
    });

    //get sprite for scene and character, contact to one array and put into CAAT.Module.Preloader.
    that.spriteEngine.setCharacterSprite(that.userInfo.character.getEquippedObj().key);
    var spritesArray = that.episodeMgr.getImagePath().concat(that.userInfo.character.getImagePath());

    //load images prior to game run
    new CAAT.Module.Preloader.ImagePreloader().loadImages(
      spritesArray,
      function on_load(counter, images) {
        incrementLoadingPercent(Math.floor(1 / images.length * 70));
        if (counter === images.length) {
          that.director.setImagesCache(that.director.imagesCache.concat(images));
          imageReady = true;
          if (DEBUG_.loading) {
            console.log("image load is ready");
          }
          checkAndGo();
        }
      }
    );
  };

  scene.goOut = function () {
    loadingPercent = 0;
    incrementLoadingPercent(0);
  };

  var tips = [
    "If you want to signed in with by different user, you have to log out facebook either using web or using existing facebook app( if you installed one)  ",
    "Sometimes you need to click facebook login twice to login",
    ""
  ]
};
