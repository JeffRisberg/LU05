SceneMgr.prototype.conDifficulty = function (parent) {
  var that = this;
  var topCon = that.createConBG();

  // left lower corner ring
  var height = 200 * sf;
  var scaleFactor = 1.7;
  if (W_ / H_ < 1.6) {
    scaleFactor = 2.0;
  }

  var difficultyBg = Util.createImageActorInBound(that.director, "conDifficultyBg", 0, H_ - height, height, height).
    setScaleAnchored(scaleFactor, scaleFactor, 0, 1);
  topCon.addChild(difficultyBg);

  function destroyTopCon() {
    Util.destroyObj(topCon);
    parent.backFromCon();
    parent.resetInfo();
    parent.backFromDifficultyCon();
    that.conReturnCommonDo();
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", destroyTopCon, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  var topY = 10 * sf;
  var newSL = (height + 5 * sf) * scaleFactor;
  var newSLE = newSL - 8 * sf * scaleFactor;
  var offsetE = 23 * sf;

  function btnEasyDo() {
    that.episodeMgr.setDifficulty(0);
    destroyTopCon();
  }

  function btnMediumDo() {
    that.episodeMgr.setDifficulty(1);
    destroyTopCon();
  }

  function btnHardDo() {
    that.episodeMgr.setDifficulty(2);
    destroyTopCon();
  }

  var newSLM = newSL * 0.74;

  var btnEasy = Util.createButtonConWithImageFunInBound(that.director, "btnEasy", btnEasyDo, 0 + offsetE, H_ - newSLE + offsetE / 5, RBS_, RBS_);
  var btnMedium = Util.createButtonConWithImageFunInBound(that.director, "btnMedium", btnMediumDo, newSLM - RBS_, H_ - newSLM, RBS_, RBS_);
  var btnHard = Util.createButtonConWithImageFunInBound(that.director, "btnHard", btnHardDo, newSLE - RBS_ - offsetE / 5, H_ - RBS_ - offsetE, RBS_, RBS_);

  var easyText = Util.createText("easy");
  easyText.setLocation(btnEasy.x, btnEasy.y + btnEasy.height + 0 * sf);
  topCon.addChild(easyText);

  var mediumText = Util.createText("medium");
  mediumText.setLocation(btnMedium.x, btnMedium.y + btnMedium.height + 0 * sf);
  topCon.addChild(mediumText);

  var hardText = Util.createText("hard");
  hardText.setLocation(btnHard.x, btnHard.y + btnHard.height + 0 * sf);
  topCon.addChild(hardText);

  var msgMedium = "Medium: suggest lv8 or higher \nHard: suggest lv 20 or higher \n\nOtherwise one mistake will \ndrain all your energy.";

  var difficultyInfoTextArea = new WrapFont(msgMedium, 30 * sf, "#FFFFFF").
    setBounds(0.3 * W_, 0.3 * H_, 0.5 * W_, 300 * sf);
  topCon.addChild(difficultyInfoTextArea);

  topCon.addChild(btnEasy);
  topCon.addChild(btnMedium);
  topCon.addChild(btnHard);
//license related here

  var topY = 10 * sf;//topH is the ref to the top most button start height
  var btnLicense = that.createButtonConPopCon("btnLicense", that.conLicense, topCon, W_ - RBS_ - 18 * sf, topY, RBS_, RBS_);
  topCon.addChild(btnLicense);

  //TODO:draw the rabbit due to it's license

  var rabbitImg = Util.createImageActorWH(that.director, "rabbitNormal", 195 * sf, 280 * sf);
  rabbitImg.setLocation(W_ * 0.73, H_ * 0.35);

  var userLicense = that.userInfo.license;
  var licenseName = userLicense.getHighestLicense();
  var bunnyType = "rabbitNormal";
  if (licenseName) {
    bunnyType = "bunny" + licenseName;
  }

  Util.changeActorImg(that.director, rabbitImg, bunnyType);

  topCon.addChildAt(rabbitImg, 0);

  return topCon;
};

SceneMgr.prototype.conLicense = function (parent, actor) {
//general
  var that = this;
  var topCon = that.createConBG();
  var userLicense = that.userInfo.license;

  function returnDo() {
    that.userPanel.showOffCurrentScene();
    Util.destroyObj(topCon);
  }

  that.userPanel.showInCurrentScene(topCon);
  var conBg = Util.createImageConInBound(that.director, "bgContainer", 0.1 * W_, 0.2 * H_, W_ * 0.8, H_ * 0.8);
  topCon.addChild(conBg);

  var picSize = 125 * sf
  var scaleFactor = 1.5;
  var slider = new Slider(topCon, that.director);
  slider.setSliderBounds(conBg.x, 0.2 * H_, conBg.x + conBg.width * 0.6, picSize * scaleFactor);

  var infoText, buyBtn;
  createInfoButtonArea();

  var licenses = userLicense.getLicenseGroup();
  var count = 0;
  for (var i in licenses) {
    var eachItem = licenses[i];
    createOneItem(eachItem, count == 0);
    count++;
  }
  slider.setGap(30 * sf);
  slider.resetSize();

  var currentSelection = licenses[0];

  function createOneItem(itemInfo, toRunPress) {

    function pressDoCommon() {
      currentSelection = itemInfo;
      //Util.changeActorPressDo(buyBtn, buttonUnlockedDoEachActor);
    }

    function pressDoUnlock() {
      pressDoCommon();
      buyBtn.setVisible(true);
      infoText.setText(itemInfo.msg + "\n\nPrice: " + itemInfo.price + " " + GEM_UNIT);
    }

    function loadSongFun() {
      // difficulty has to be set first
      that.episodeMgr.setDifficulty(itemInfo.difficulty);
      that.episodeMgr.setIndex("License");
      that.gameMgr.mode = "exam";
      that.loadData.sceneAfterLoad = "sceneGame";
      userLicense.setCurrentChallengeLicense(itemInfo.name);

      pressDoUnlock();
    }

    var licenseCon = new LockActor(that.director, itemInfo.image, loadSongFun, null, false)
      .setSlider(slider)
      .setPressDoScaleFactor(1.4)
      .setSizeMy(picSize, picSize);

    if (userLicense.getValue(itemInfo.name)) {
      // already achieved
      var size = 20 * sf
      var actor = Util.createImageActorInBound(that.director, "btnChecked",
        licenseCon.width - size, 0, size, size);
      licenseCon.addChild(actor);
    }

    slider.addItem(licenseCon);
    if (toRunPress) {
      licenseCon.pressDo();
    }
  }

  function createInfoButtonArea() {

    infoText = new WrapFont("", 30 * sf, FONT_COLOR).setSize(slider.width - 150 * sf, 100 * sf);
    var buttonL = RBS_ * 0.6 * 2.5;
    var buttonW = RBS_ * 0.6;

    function buyButtonDo() {
      if (!that.userInfo.money.addGems(-currentSelection.price)) {
        Util.createPopUpNotEnough(that.director);
        return;
      }
      that.switchTo("sceneLoad");
      returnDo();
    }

    buyBtn = Util.createButtonWithImageFunWH(that.director, "btnChallenge", buyButtonDo, buttonL, buttonW);
    buyBtn.setVisible(true);

    var buttonCon = Util.createAlignContainerWithActor(VERTICAL, [buyBtn]);
    var con = Util.createAlignContainerWithActor(HORIZONTAL, [infoText, buttonCon]);
    var upperCon = Util.createAlignContainerWithActor(VERTICAL, [slider, con]);

    conBg.addChild(upperCon);
    upperCon.setLocation(100 * sf, 50 * sf);//related to conBg
  }

  slider.setTouchy();

  function goBackDo() {
    that.episodeMgr.resetToLastSong();
    returnDo();
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", goBackDo, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);
  return topCon;
};
