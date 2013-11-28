/**
 * User: Niu Niu
 * Date: 5/12/13
 * UserCharacter is to manage multiple characters like rabbits etc in game
 */
function UserCharacter(lockMgr_) {
  // var that= this;

  var characterGroup_ = [
    {
      "key": "rabbit",//key is for build hash out of it
      "name": "Bunny",
      "img": "rabbit",
      "price": 0,
      "spriteName": "spriteRabbit",
      "description": "Bunny the rabbit",
      "skill": ""
    },
    {
      "key": "squirrel",
      "name": "Sparky",
      "img": "rabbit2",
      "price": 200,
      "spriteName": "spriteSquirrel",
      "description": "Sparky the squirrel",
      "skill": ""
    },
    {
      "key": "bird",
      "name": "Polly",
      "img": "rabbit3",
      "price": 100,
      "spriteName": "spriteBird",
      "description": "Polly the bird",
      "skill": ""
    }
  ];

  var userEquippedIndex_;

  this.getEquippedIndex = function () {
    //get from local storage
    return parseInt(this.getValue('userEquippedIndex_') || 0);
  };

  this.getEquippedObj = function () {
    userEquippedIndex_ = this.getEquippedIndex();
    return characterGroup_[userEquippedIndex_];
  };

  this.getCharacterGroup = function () {
    return characterGroup_;
  };

  this.setEquippedIndex = function (val) {
    userEquippedIndex_ = val;
    this.setValue(val, 'userEquippedIndex_');
  };

  this.resetCharacter = function () {
    this.setEquippedIndex(0);
    lockMgr_.setGroupIsUnlockOrNum("rabbit", 1);//unlock rabbit initially
  };

  function addAllGroup() {
    for (var i in characterGroup_) {
      if (i == 0) continue;
      lockMgr_.addLockGroup(characterGroup_[i]['key']);
    }
  }

  function init() {
    addAllGroup();
  }

  init();
}

UserCharacter.prototype = new LocalStorageMgr("CHARACTER");

/**
 * get the path of sprite of current selected character
 * @returns {Array}
 */
UserCharacter.prototype.getImagePath = function () {
  var commonPath = R_ + "/images/gameScene/character/";

  var imagePath = [
    {id: "SG_character", url: commonPath + this.getEquippedObj().key + "/sprites.png"}
  ];
  return imagePath;
};
