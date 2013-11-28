SceneMgr.prototype.conAchievement = function (parent) {
  var that = this;
  var topCon = that.createConBG();
  var achievements = that.userInfo.achievement.achievements;

  function destroyTopCon() {
    Util.destroyObj(topCon);
    parent.backFromCon();
    that.conReturnCommonDo();
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", destroyTopCon, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  var conBg = Util.createImageConInBound(that.director, "bgContainer", 0.13 * W_, 0, W_ * 0.8, H_);
  topCon.addChild(conBg);
  var picSize = 100 * sf;
  var scaleFactor = 1.5;
  var slider = new Slider(conBg, that.director);
  slider.setSliderBounds(conBg.width * 0.1, conBg.height * 0.1, conBg.width * 0.8, picSize * scaleFactor);
  conBg.addChild(slider);
  slider.setGap(30 * sf);
  var achieveTextBg = Util.createImageConInBound(that.director, "achieveTextBg", slider.x, slider.y + slider.height + 20 * sf, slider.width, 200 * sf);
  conBg.addChild(achieveTextBg);

  var infoText = new WrapFont("", 30 * sf, "black").setSize(slider.width * 0.8, 80 * sf);
  var achievedText = Util.createText("Achieved");
  var rewardsText = Util.createText("Rewards");

  var infoImgCon = new ImageProgressCon(Util.createImageActorWH(this.director, "achieveGeneral", picSize * 1.5 * sf, picSize * 1.5 * sf));
  var infoCon = Util.createAlignContainerWithActor(VERTICAL, [infoText, achievedText, rewardsText]);

  infoCon.setLocation(50 * sf, 20 * sf);
  achieveTextBg.addChild(infoCon);
  achievedText.setVisible(false);
  rewardsText.setVisible(false);
  function changeInfoImageCon(img, completePercent, description) {
    Util.changeActorImg(that.director, infoImgCon.childrenList[0], img);
    infoImgCon.setProgress(completePercent);
    infoText.setText(description);
  }

  // set first achievement to be shown in info container
  for (var i in achievements) {
    var achievement = achievements[i];
    var achievedPercent = that.userInfo.achievement.getValueFromLocal(i, "isAchieved");
    changeInfoImageCon(achievement.img, achievedPercent, achievement.description);
    break;
  }

  // create achievement button in slider
  for (i in achievements) {
    achievement = achievements[i];
    var isAchieved = that.userInfo.achievement.getValueFromLocal(i, "isAchieved");
    // var archLogo="logoNotAchieve";
    var archLogoButtonActor = createOneAchievement(achievement, isAchieved);
    slider.addItem(archLogoButtonActor);
  }
  slider.resetSize();

  function createOneAchievement(achievement, completePercent) {
    // console.log(achievement);
    var img = achievement.img || "logoNotAchieve";
    var description = achievement.description;

    function pressDoCommon() {
      //Util.changeActorImg(that.director, infoImg, img);
      if (completePercent == 1) {
        achievedText.setVisible(true);
        rewardsText.setVisible(false);
      } else {
        //set rewards text
        rewardsText.setText("Rewards: " + achievement.reward + " " + GEM_UNIT);
        rewardsText.setVisible(true);
        achievedText.setVisible(false);
      }

      changeInfoImageCon(img, completePercent, description);
      infoText.setText(description);
    }

    var button = new ImageProgressCon(Util.createButtonWithImageFunWH(that.director, img, pressDoCommon, picSize, picSize));
    button.setProgress(completePercent);
    return button;
  }

  slider.resetWhenActivated();
  slider.setTouchy();

  return topCon;
};
