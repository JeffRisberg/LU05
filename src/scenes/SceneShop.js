/**
 * create shop scene
 * @param sceneName
 */
SceneMgr.prototype.addSceneShop = function (sceneName) {

  var that = this;

  var scene = this.createEmptyScene(sceneName);
  this.addBG(scene, "general");
  var shoppingFontSize = 25 * sf;
  var shoppingFontColor = FONT_COLOR;
  var shoppingLabelWidth = 120 * sf
  var userEquip = that.userInfo.equip;
  var upperCon;
  var characterCon;
  var lockMgr = that.userInfo.lock;
  var userCharacter = that.userInfo.character;

  // top left
  var btnBack = that.createButtonConSwitchScene("btnBack", "sceneInitial", 10 * sf, 10 * sf, RBS_, RBS_);
  scene.addChild(btnBack);

  function beforeButtonDo() {
    return true;
  }

  var buttonSize = RBS_ * 1.2;

  function createOneRow(message, btnName, conScene, group) {
    var button = [];
    that.debug = button;
    var count = 0;
    for (var i in group) {
      var buttonGroupName = group[i];
      button[i] = that.createButtonConPopCon(btnName, conScene, scene, 0, 0, buttonSize, buttonSize, beforeButtonDo);
      button[i].childrenList[0].buttonGroup = buttonGroupName;
      var equipImg = userEquip.getValue(buttonGroupName);
      if (equipImg) {
        Util.changeActorImg(that.director, button[i].childrenList[0], equipImg);
      }

      // start from the second, add lock
      if (count > 0) {
        // TODO: also hard coded in UserEquip
        var lockActor = createOneLockActor(buttonGroupName + "_lockBox");
        if (lockActor) {
          button[i].addChild(lockActor);
        }
      }
      count++;
    }

    var settingTextArea = new WrapFont(message, shoppingFontSize, shoppingFontColor).setSize(shoppingLabelWidth, RBS_);
    var con = Util.createAlignContainerWithActor(HORIZONTAL, [settingTextArea, button[0], button[1]], 5 * sf);
    return con;
  }

  function createOneLockActor(groupName) {
    var price = 100;
    if (lockMgr.getGroupIsUnlockOrNum(groupName)) {
      return undefined;
    }

    function pressDoLocked() {
      var unlockMsg = "Unlock additional slot with " + price + " " + GEM_UNIT;
      var buttonUnlock = Util.createButtonWithImageFunWH(that.director, "btnUnlock", buttonUnlockDo,
        120 * sf, 50 * sf);
      var buttonCancel = Util.createButtonWithImageFunWH(that.director, "btnCancel", btnCancelDo,
        120 * sf, 50 * sf);
      var popup = new PopUp(that.director, scene, unlockMsg, "rabbit", 100 * sf, 150 * sf, [buttonUnlock, buttonCancel]);

      function buttonUnlockDo() {
        if (!that.userInfo.money.addGems(-price)) {
          Util.createPopUpNotEnough(that.director);
          return;
        }
        popup.closeDo();
        Util.destroyActor(lockActor);
        that.userPanel.resetAll(that.userInfo);
        lockMgr.setGroupIsUnlockOrNum(groupName, 1);
      }

      function btnCancelDo() {
        popup.closeDo();
      }
    }

    var lockActor = Util.createButtonWithImageFunWH(that.director, "locked2", pressDoLocked,
      buttonSize, buttonSize);

    return lockActor;
  }

  /*
   character is locked through the key
   */
  function createOneCharacterLockActor(characterObj) {

    var price = characterObj.price;
    var groupName = characterObj.key;
    var lockSize = 90 * sf;

    if (!lockMgr.isGroupRegistered(groupName) || lockMgr.getGroupIsUnlockOrNum(groupName)) {
      return undefined;
    }

    function pressDoLocked() {
      var unlockMsg = "Unlock additional character with " + price + " " + GEM_UNIT;
      var buttonUnlock = Util.createButtonWithImageFunWH(that.director, "unlock", buttonUnlockDo,
        120 * sf, 50 * sf);
      var buttonCancel = Util.createButtonWithImageFunWH(that.director, "btnCancel", btnCancelDo,
        120 * sf, 50 * sf);
      var popup = new PopUp(that.director, scene, unlockMsg, characterObj.img, 100 * sf, 150 * sf, [buttonUnlock, buttonCancel]);

      function buttonUnlockDo() {
        if (!that.userInfo.money.addGems(-price)) {
          Util.createPopUpNotEnough(that.director);
          return;
        }
        popup.closeDo();
        Util.destroyActor(lockActor);
        btnSelect.setVisible(true);
        lockMgr.setGroupIsUnlockOrNum(groupName, 1);

      }

      function btnCancelDo() {
        popup.closeDo();
      }
    }

    var lockActor = Util.createButtonWithImageFunWH(that.director, "locked2", pressDoLocked,
      lockSize, lockSize);

    return lockActor;
  }

  //TODO add this as a general function

  function rotateNextIndex(currentIndex, delta, arrayName) {
    var nextIndex = (currentIndex + delta) % arrayName.length;
    if (nextIndex < 0) {
      nextIndex = arrayName.length + nextIndex;
    }
    return nextIndex;
  }

  var btnSelect;
  scene.activated = function () {
    that.commonDoWhenSceneStart();
    that.userPanel.showInCurrentScene(scene);
    var talentCon = createOneRow("Talent", "talentBox", that.conTalent, userEquip.getButtonTalentGroup());
    var itemCon = createOneRow("Item", "itemBox", that.conItem, userEquip.getButtonItemGroup());
    upperCon = Util.createAlignContainerWithActor(VERTICAL, [
      talentCon, itemCon], 30 * sf);
    upperCon.setLocation(20 * sf, 150 * sf);
    scene.addChild(upperCon);
    var userCharacters = userCharacter.getCharacterGroup();
    var imgH = 150 * 1.5 * sf;
    var imgW = 100 * 1.5 * sf;
    var currentIndex = userCharacter.getEquippedIndex();
    var currentCharacter = userCharacters[currentIndex];
    var centerImg = Util.createImageConWH(that.director, currentCharacter['img'], imgW, imgH);
    var checkMark = Util.createImageActorWH(that.director, "checkMark", 90 * sf, 90 * sf);
    var characterDescription = Util.createText(currentCharacter['description'], 25 * sf, null, '#996633');
    var btnLeft = Util.createButtonWithImageFunWH(that.director, "btnLeft",
      function () {
        imgIndexChange(-1);
      }, RBS_, RBS_);
    var btnRight = Util.createButtonWithImageFunWH(that.director, "btnRight",
      function () {
        imgIndexChange(1);
      }, RBS_, RBS_);
    btnSelect = Util.createButtonWithImageFunWH(that.director, "btnSelect",
      btnSelectDo, 120 * sf, 50 * sf);

    var characterSelectCon = Util.createAlignContainerWithActor(HORIZONTAL, [
      btnLeft, centerImg, btnRight], 50 * sf);

    characterCon = Util.createAlignContainerWithActor(VERTICAL, [characterSelectCon, characterDescription, Util.createConWrapper(btnSelect)]);
    Util.changeLayoutAlignOnActor(characterCon, "CENTER", "CENTER");
    characterCon.setLocation(upperCon.x + upperCon.width, upperCon.y);
    scene.addChild(characterCon);

    if (currentIndex == userCharacter.getEquippedIndex()) {
      checkMark.setLocation(centerImg.width - checkMark.width, centerImg.height - checkMark.height);
      centerImg.addChild(checkMark);
      checkMark.setVisible(true);
      btnSelect.setVisible(false);
    }

    var lockActor;

    function btnSelectDo() {
      userCharacter.setEquippedIndex(currentIndex);
      checkMark.setVisible(true);
      btnSelect.setVisible(false);
    }

    function imgIndexChange(delta) {
      var nextIndex = rotateNextIndex(currentIndex, delta, userCharacters);
      currentIndex = nextIndex;
      if (currentIndex != userCharacter.getEquippedIndex()) {
        checkMark.setVisible(false);
        btnSelect.setVisible(true);

      } else {
        checkMark.setVisible(true);
        btnSelect.setVisible(false);
      }

      var characterObj = userCharacters[nextIndex];
      Util.changeActorImg(that.director, centerImg.childrenList[0], characterObj['img']);
      characterDescription.setText(characterObj['description']);

      if (lockActor) {
        Util.destroyActor(lockActor);
      }
      lockActor = createOneCharacterLockActor(characterObj);

      if (lockActor) {
        btnSelect.setVisible(false);
        lockActor.setLocation(centerImg.width - lockActor.width, centerImg.height - lockActor.height);
        centerImg.addChild(lockActor);
      }
    }
  };

  scene.goOut = function () {
    Util.destroyObj(upperCon);
    Util.destroyObj(characterCon);
  };

  scene.backFromCon = function () {
    that.userPanel.showInCurrentScene(scene);
  }

};
