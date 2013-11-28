SceneMgr.prototype.conTalent = function (parent, actor) {

  var that = this;
  var topCon = that.createConBG();
  var lockMgr = that.userInfo.lock;
  var userEquip = that.userInfo.equip;

  function returnDo() {
    that.userPanel.showOffCurrentScene();
    Util.destroyObj(topCon);
    parent.backFromCon();
    that.conReturnCommonDo();
  }

  that.userPanel.showInCurrentScene(topCon);
  var conBg = Util.createImageConInBound(that.director, "bgContainer", 0.1 * W_, 0.2 * H_, W_ * 0.8, H_ * 0.8);
  topCon.addChild(conBg);

  var talentGroup = userEquip.getTalentGroup();

  var currentSelection = talentGroup[0];
  var picSize = 125 * sf;


  // slider and add item
  var scaleFactor = 1.5;
  var slider = new Slider(topCon, that.director);
  slider.setSliderBounds(0, 0, conBg.width - 200 * sf, picSize * scaleFactor);
  var i;
  for (i in talentGroup) {
    var eachItem = talentGroup[i];
    createOneItem(eachItem);
  }
  slider.setGap(30 * sf);
  slider.resetSize();

  var infoText, buyBtn, equipBtn, unEquipBtn;
  createInfoButtonArea();

  function createOneItem(itemInfo) {

    function pressDoCommon() {
      currentSelection = itemInfo;
    }

    function pressDoUnlock() {
      pressDoCommon();
      buyBtn.setVisible(false);
      if (userEquip.getValue(actor.buttonGroup) == itemInfo.image) {
        // current selection is already equipped
        unEquipBtn.setVisible(true);
        equipBtn.setVisible(false);
      } else {
        equipBtn.setVisible(true);
        unEquipBtn.setVisible(false);
      }
      infoText.setText(itemInfo.msg);
    }

    function pressDoLocked() {
      pressDoCommon();
      buyBtn.setVisible(true);
      equipBtn.setVisible(false);
      unEquipBtn.setVisible(false);

      infoText.setText(itemInfo.msg + "\nPrice: " + itemInfo.price + " " + GEM_UNIT);
      // set the buy button do here
      Util.changeActorPressDo(buyBtn, buttonUnlockedDoEachActor)
    }

    function buttonUnlockedDoEachActor() {
      if (itemActorCon.tryUnlockSuccess()) {
        pressDoUnlock();
      }
    }

    var lockImg = itemInfo.image + "Off";
    var itemActorCon = new LockActor(that.director, itemInfo.image, pressDoUnlock, lockMgr, true, lockImg)
      .setSlider(slider)
      .setPressDoScaleFactor(scaleFactor)
      .setSizeMy(picSize, picSize)
      .setLockInfo(itemInfo.msg, pressDoLocked)
      .setPrice(itemInfo.price, that.userInfo.money);

    slider.addItem(itemActorCon);
    var lockSt = !lockMgr.getGroupIsUnlockOrNum(itemInfo.image);
    itemActorCon.setLocked(lockSt);
  }

  function createInfoButtonArea() {

    infoText = new WrapFont("", 30 * sf, FONT_COLOR).setSize(slider.width * 0.6, 100 * sf);
    var buttonL = RBS_ * 0.6 * 2.5;
    var buttonW = RBS_ * 0.6;

    function buyButtonDo() {
      // change when pressed each item
    }

    buyBtn = Util.createButtonWithImageFunWH(that.director, "buyBtn", buyButtonDo, buttonL, buttonW);

    // equip, record it , then return to scene
    function equipButtonDo() {
      Util.changeActorImg(that.director, actor, currentSelection.image);
      userEquip.setValue(currentSelection.image, actor.buttonGroup);
      returnDo();
    }

    equipBtn = Util.createButtonWithImageFunWH(that.director, "equipBtn", equipButtonDo, buttonL, buttonW);

    // un#quip
    function unEquipButtonDo() {
      Util.changeActorImg(that.director, actor, "talentBox");
      userEquip.setValue("", actor.buttonGroup);
      returnDo();
    }

    unEquipBtn = Util.createButtonWithImageFunWH(that.director, "unequipBtn", unEquipButtonDo, buttonL, buttonW);

    var buttonWrapper = Util.createConWrapper(buyBtn);
    buttonWrapper.addChild(equipBtn);
    buttonWrapper.addChild(unEquipBtn);
    buyBtn.setVisible(false);
    equipBtn.setVisible(false);
    unEquipBtn.setVisible(false);

    var con = Util.createAlignContainerWithActor(HORIZONTAL, [infoText, buttonWrapper]);
    var upperCon = Util.createAlignContainerWithActor(VERTICAL, [slider, con]);

    conBg.addChild(upperCon);
    upperCon.centerAt(conBg.width / 2, conBg.height / 2);//related to conBg
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", returnDo, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  slider.setTouchy();
  slider.innerContainer.childrenList[0].pressDo();
  return topCon;

};

SceneMgr.prototype.conItem = function (parent, actor) {
//general
  var that = this;
  var topCon = that.createConBG();
  var lockMgr = that.userInfo.lock;
  var userEquip = that.userInfo.equip;

  function returnDo() {
    that.userPanel.showOffCurrentScene();
    Util.destroyObj(topCon);
    parent.backFromCon();
  }

  that.userPanel.showInCurrentScene(topCon);
  var conBg = Util.createImageConInBound(that.director, "bgContainer", 0.1 * W_, 0.2 * H_, W_ * 0.8, H_ * 0.8);
  topCon.addChild(conBg);

  var itemGroup = userEquip.getItemGroup();

  var currentSelection = itemGroup[0];
  var picSize = 125 * sf;

  // slider and add item
  var scaleFactor = 1.5;
  var slider = new Slider(topCon, that.director);
  slider.setSliderBounds(0, 0, conBg.width - 200 * sf, picSize * scaleFactor);
  var i;
  for (i in itemGroup) {
    var eachItem = itemGroup[i];
    createOneItem(eachItem);
  }
  slider.setGap(30 * sf);
  slider.resetSize();

  var infoText, buyBtn, equipBtn, unEquipBtn, warningText;
  createInfoButtonArea();

  function createOneItem(itemInfo) {

    function changeItemCountForActor() {
      var group = itemInfo.image;
      var oriOwn = parseInt(lockMgr.getGroupIsUnlockOrNum(group)) || 0;
      if (oriOwn == 0) {
        return;
      }
      itemCountActor.setText(oriOwn + "");
    }

    function pressDoCommon() {
      currentSelection = itemInfo;
      Util.changeActorPressDo(buyBtn, buttonUnlockedDoEachActor);
    }

    function pressDoUnlock() {
      pressDoCommon();
      buyBtn.setVisible(true);
      warningText.setVisible(false);
      if (userEquip.getValue(actor.buttonGroup) == itemInfo.image) {
        // current selection is already equipped
        unEquipBtn.setVisible(true);
        equipBtn.setVisible(false);
        // warningText.setVisible(false);
      } else {
        if (!userEquip.getIsEquip(itemInfo.image)) {
          equipBtn.setVisible(true);
          //  warningText.setVisible(false);
        } else {
          equipBtn.setVisible(false);
          warningText.setVisible(true);

        }
        unEquipBtn.setVisible(false);
      }
      infoText.setText(itemInfo.msg + "\nPrice: " + itemInfo.price + " " + GEM_UNIT);
    }

    function pressDoLocked() {
      pressDoCommon();
      buyBtn.setVisible(true);
      equipBtn.setVisible(false);
      unEquipBtn.setVisible(false);
      warningText.setVisible(false);

      infoText.setText(itemInfo.msg + "\nPrice: " + itemInfo.price + " " + GEM_UNIT);

      // set the buy button do here
    }

    function buttonUnlockedDoEachActor() {
      var group = currentSelection.image;
      var oriOwn = parseInt(lockMgr.getGroupIsUnlockOrNum(group)) || 0;
      if (itemActorCon.tryUnlockSuccess()) {
        pressDoUnlock();
        lockMgr.setGroupIsUnlockOrNum(group, oriOwn + 1);
      }
      changeItemCountForActor();
    }

    var lockImg = itemInfo.image;
    var itemActorCon = new LockActor(that.director, itemInfo.image, pressDoUnlock, lockMgr, true, lockImg)
      .setSlider(slider)
      .setPressDoScaleFactor(scaleFactor)
      .setSizeMy(picSize, picSize)
      .setLockInfo(itemInfo.msg, pressDoLocked)
      .setPrice(itemInfo.price, that.userInfo.money);

    var itemCountActor = Util.createText("").
      setLocation(itemActorCon.width - 20 * sf, 0).enableEvents(false);
    itemActorCon.addChild(itemCountActor);
    changeItemCountForActor();

    slider.addItem(itemActorCon);
    var unLockSt = lockMgr.getGroupIsUnlockOrNum(itemInfo.image);
    itemActorCon.setUnlocked(unLockSt);
  }

  function createInfoButtonArea() {

    infoText = new WrapFont("", 30 * sf, FONT_COLOR).setSize(slider.width * 0.6, 100 * sf);
    var buttonL = RBS_ * 0.6 * 2.5;
    var buttonW = RBS_ * 0.6;

    function buyButtonDo() {
      // place holder
      // change when pressed each item
    }

    buyBtn = Util.createButtonWithImageFunWH(that.director, "buyBtn", buyButtonDo, buttonL, buttonW);

    // equip, record it , then return to scene
    function equipButtonDo() {
      Util.changeActorImg(that.director, actor, currentSelection.image);
      userEquip.setValue(currentSelection.image, actor.buttonGroup);
      returnDo();
    }

    equipBtn = Util.createButtonWithImageFunWH(that.director, "equipBtn", equipButtonDo, buttonL, buttonW);

    // un#quip
    function unEquipButtonDo() {
      Util.changeActorImg(that.director, actor, "talentBox");
      userEquip.setValue("", actor.buttonGroup);
      returnDo();
    }

    unEquipBtn = Util.createButtonWithImageFunWH(that.director, "unequipBtn", unEquipButtonDo, buttonL, buttonW);
    warningText = Util.createText("Already equipped in other slot");
    var warningTextWrapper = Util.createConWrapper(warningText);
    var buttonWrapper = Util.createConWrapper(equipBtn);
    buttonWrapper.addChild(unEquipBtn);
    buyBtn.setVisible(true);
    equipBtn.setVisible(false);
    unEquipBtn.setVisible(false);
    warningText.setVisible(false);
    //warningText.setVisible(false);

    var buttonCon = Util.createAlignContainerWithActor(VERTICAL, [buyBtn, buttonWrapper]);
    var con = Util.createAlignContainerWithActor(HORIZONTAL, [infoText, buttonCon]);
    Util.changeLayoutAlignOnActor(con, "CENTER", "TOP");
    var upperCon = Util.createAlignContainerWithActor(VERTICAL, [slider, warningTextWrapper, con]);

    conBg.addChild(upperCon);
    upperCon.centerAt(conBg.width / 2, conBg.height / 2);//related to conBg
  }

  var goBackButton = Util.createButtonConWithImageFunInBound(that.director, "btnBack", returnDo, 10 * sf, 10 * sf, RBS_, RBS_);
  topCon.addChild(goBackButton);

  slider.setTouchy();
  slider.innerContainer.childrenList[0].pressDo();
  return topCon;

};
