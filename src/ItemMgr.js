/**
 * Subset of the real item manager.
 *
 * This doesn't have a backend, it has a static list of items
 */
function ItemMgr() {

  var talentGroup_ = [
    {
      image: "talentExp",
      price: 36,
      msg: "Exp + 20%",
      onlyAffectEnd: true,
      fun: function (target) {
        if (target && target.hasOwnProperty("expEarn")) {
          target.expEarn *= 1.2;
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "talentMoney",
      price: 70,
      msg: "Money + 20%",
      onlyAffectEnd: true,
      fun: function (target) {
        if (target && target.hasOwnProperty("gemEarn") && target.hasOwnProperty("gemText")) {
          target.gemEarn = Math.floor(target.gemEarn * 1.2);
          target.gemText = target.gemEarn + " (+20%)";
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "talentAcc",
      price: 90,
      onlyAffectEnd: true,
      msg: "Accuracy + 2%",
      fun: function (target) {
        // note if acc is 91% then the value here is 91
        if (target && target.hasOwnProperty("acc") && target.hasOwnProperty("accText")) {
          target.acc = (target.acc + 1).toFixed(1);
          if (target.acc > 100) {
            target.acc = 100
          }
          target.accText = target.acc + " (+1)";
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "talentScore",
      price: 130,
      msg: "Score + 10%",
      onlyAffectEnd: true,
      fun: function (target) {
        if (target && target.hasOwnProperty("score") && target.hasOwnProperty("scoreText")) {
          target.score = Math.floor(target.score * 1.1);
          target.scoreText = target.score + " (+10%)";
        } else {
          applyCommon(target);
        }
      }
    }
  ];

  var itemGroup_ = [
    {
      image: "itemAcc",
      price: 5,
      msg: "Increase accuracy 20% for 10s",
      fun: function (target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemAccFactor(1.2);
          function endItemDo() {
            target.scoreMgr.setItemAccFactor(1);
            endDoCommon(target);
          }

          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemFullBlood",
      price: 5,
      msg: "Recover to full energy immediately",
      fun: function (target) {
        if (target && target.hasOwnProperty("hpBar")) {
          target.hpBar.setPercent(1);
          endDoCommon(target);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemRecoverDuration",
      price: 2,
      msg: "Recover 3%/sec for 20s",
      fun: function (target) {
        if (target && target.hasOwnProperty("hpBar") && target.hasOwnProperty("cancelFunList")) {
          var intervalId = Util.setIntervalWithTotal(1000, 20, function () {
            target.hpBar.incPercent(0.03);
          });

          function endItemDo() {
            endDoCommon(target);
          }

          setTimeout(endItemDo, 20000);
          // later it can remove interval if it is not finished when game ended
          target.cancelFunList.push(function () {
            clearInterval(intervalId)
          });
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemShield",
      price: 8,
      msg: "Reduce energy drop to 50% for 20s",
      fun: function (target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemHpFactor(0.5);
          function endItemDo() {
            target.scoreMgr.setItemHpFactor(1);
            endDoCommon(target);
          }

          setTimeout(endItemDo, 20000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemScoreDouble",
      price: 15,
      msg: "Score boost to twice for 10s",
      fun: function (target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemScoreFactor(2);
          function endItemDo() {
            target.scoreMgr.setItemScoreFactor(1);
            endDoCommon(target);
          }

          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemCombo",
      price: 10,
      msg: "Combo will not be interrupted for 10s",
      fun: function (target) {
        if (target && target.hasOwnProperty("scoreMgr")
          && target.hasOwnProperty("cancelFunList")) {
          target.scoreMgr.setItemComboFactor(true);
          function endItemDo() {
            target.scoreMgr.setItemComboFactor(false);
            endDoCommon(target);
          }

          setTimeout(endItemDo, 10000);
          target.cancelFunList.push(endItemDo);
        } else {
          applyCommon(target);
        }
      }
    },
    {
      image: "itemPass100",
      price: 25,
      msg: "No energy loss in one run",
      fun: function (target) {
        if (target && target.hasOwnProperty("scoreMgr")) {
          target.scoreMgr.setItemStrongFactor(true);
        } else {
          applyCommon(target);
        }
      }
    }
  ];

  var talentGroupHash_, itemGroupHash_;

  this.getTalentGroup = function () {
    return talentGroup_;
  };
  this.getItemGroup = function () {
    return itemGroup_;
  };

  function init() {
    talentGroupHash_ = Util.createHashFromArray(talentGroup_, "image");
    itemGroupHash_ = Util.createHashFromArray(itemGroup_, "image");
  }

  init();
}
