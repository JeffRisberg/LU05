/**
 * The backend communicates with the Heroku server application
 *
 * @author Jeff Risberg, Linghua
 * @since November 2013 (this version)
 */
var Backend = {
  getBaseUrl: function(){
    if ( window["BACKEND_ENV"]=="dev"){
      return "http://localhost:3000/";
    }else if(window["BACKEND_ENV"] =="prod"){
      return "http://fast-harbor-4553.herokuapp.com/";
    }
  },

  facebookLoginDo: function (facebookUserInfo) {
    var that = this;
    var facebookId = facebookUserInfo.userID;
    var facebookName = facebookUserInfo.userName;

    Backend.getHeroku({q: {"facebookId": facebookId}}, {
      success: function (rsp) {
        //       if (DEBUG_.server) { console.log("face response:"+ JSON.stringify(rsp)); }

        if (rsp.length == 0) {
          //        if (DEBUG_.server) { console.log("no facebook got, post new one");}
          Backend.postHeroku({"facebookId": facebookId, "userName": facebookName}, {}, {
            success: function (rsp) {
            },
            error: function (err) {
              //console.log(err);
            }
          });
        } else {
          //that.serverId = rsp[0]["_id"];
//           if (DEBUG_.server) { console.log("got facebook info");}
        }
      },
      error: function () {
      }

    });

    //Backend.postHeroku({name:"niuniu"});
    //console.log(facebookUserInfo);
  },

  /** fetch episode information from RR016 back end on Heroku */
  getEpisodes: function (cb) {
    var that = this;

    that.getHeroku("episode", "index/1.json", {
      success: function (response) {
        var episodeData = [];
        var length = response.results.length
        for (var index = 0; index < length; ++index) {

          var row = response.results[index];
          var oneRow = {
            "id": row['id'],
            "seq_num": row['seq_num'],
            "name": row['name'],
            "description": row['description'],
            "price": row['price'],
            "difficulty": row['difficulty'],
            "background": row['background'],
            "foreground": row['foreground'],
            "iconId": row['iconId'],
            "music": row['music'],
            "updated_at": row['updated_at']
          };
          episodeData.push(oneRow);
        }
        cb(episodeData);
      }
    });
  },


    /** fetch shopping items information from RR016 back end on Heroku */
    getTreasures: function (cb) {
        var that = this;

        that.getHeroku("treasure", "index/1.json", {
            success: function (response) {
                var treasuresData = [];
                var length = response.results.length
                for (var index = 0; index < length; ++index) {

                    var row = response.results[index];
                    var oneRow = {
                        "id": row['id'],
                        "game_id": row['game_id'],
                        "parent_id": row['parent_id'],
                        "name": row['name'],
                        "msg": row['description'],
                        "icon_url": row['icon_url'],
                        "price": row['price'],
                        "score_points": row['score_points'],
                        "iconId": row['iconId'],
                        "updated_at": row['updated_at']
                    };
                    treasuresData.push(oneRow);
                }
                cb(treasuresData);
            }
        });
    },

  /** fetch leaderboard information from RR016 back end on Heroku */
  getLeaderboards: function (callbackFunc) {
    var that = this;

    that.getHeroku("leaderboard", "index/1.json", {
      success: function (response) {
        var leaderboardData = [];
        var length = response.results.length
        for (var index = 0; index < length; ++index) {
          var row = response.results[index];
          var oneRow = {
            "id": row['id'],
            "episode_id": row['episode_id'],
            "name": row['name']
          };
          leaderboardData.push(oneRow);
        }
        callbackFunc(leaderboardData);
      }
    });
  },

  /** fetch leaderboard evaluated content */
  getTopTenScores: function (leaderboardId, callbackFunc) {
    var that = this;

    that.getHeroku("leaderboard", "eval/" + leaderboardId + ".json", {
      success: function (rsp) {
        rsp = rsp["results"];
        var leaderboardData = [];
        for (var i in rsp) {
          //console.log(rsp[i]);
          var oneRow = {
            "userName": rsp[i]["email"],
            "bestScore": rsp[i]["max_score"]
          };
          leaderboardData.push(oneRow);
        }
        callbackFunc(leaderboardData);
      }
    });
  },

     /** update the purchase count for each item*/
    buy: function ( treasureId) {
        var that = this;
        Backend.getHeroku("treasure", "buy/" + treasureId + ".json",  {}, {
             success: function (rsp) {
             },
             error: function (err) {
                 //console.log(err);
             }
         });
    },

  // probably not called
  checkAndUpdateHighScore: function (id, songName, currentHighScore) {
    var that = this;
    var query = {q: { "facebookId": id}, f: {}};
    query.f[songName] = 1;

    that.getHeroku(query, {
      success: function (rsp) {
        if (rsp.length != 0 && rsp[0].hasOwnProperty(songName) && rsp[0][songName] >= currentHighScore) {
          //console.log("><22", rsp.length, rsp[0][songName] , currentHighScore);
          return;
        }
        that.updateHighScore(id, songName, currentHighScore);
      }
    });
  },

  /** utility */
  postHeroku: function (entityName, options, parameters, cb) {
    var xhr = new XMLHttpRequest();
    var url = this.generateQuery(entityName, options);

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    var parameterMap = {};
    parameterMap[entityName] = parameters;

    xhr.onreadystatechange = function () {
      Backend.onReadyFun(xhr, cb);
    };

    xhr.send(JSON.stringify(parameterMap));
  },

  /** utility */
  getHeroku: function (entityName, options, cb) {//option is for query
    var xhr = new XMLHttpRequest();
    var url = this.generateQuery(entityName, options);

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    xhr.onreadystatechange = function () {
      Backend.onReadyFun(xhr, cb);
    };

    xhr.send();
  },

  /** Utility */
  onReadyFun: function (xhr, cb) {
    if (xhr.readyState == 4) {
      if (cb && cb.success) {
        var rspObject = JSON.parse(xhr.responseText);
        cb.success(rspObject);
      }
    } else {
      if (cb && cb.error) {
        cb.error("error");
      }
    }
  },

  /* utility */
  generateQuery: function (entityName, queryString) {
    var time = Util.timestamp();
    var url = this.getBaseUrl() + entityName + "s/" + queryString + "?time=" + time;
    if (DEBUG_.server) { console.log("generate: "+ url);}
    return url;
  },
  /** utility which repeats a call ten times */
  submitTry: function (callback, totalNum, interval) {
    totalNum = totalNum || 10;
    var intervalBetweenSubmit = interval || 8000; // mill sec
    var count = 0;

    function intervalDo() {
      count++;
      //console.log(">< trying " + count);
      if (count > totalNum) {
        clearInterval(intervalId);
        //alert("Error: internet has problem, cannot save/get data from server");
      }
      callback(intervalId);
    }

    var intervalId = setInterval(intervalDo, intervalBetweenSubmit);
    intervalDo();
  },

  dummy: "For comma"
};
