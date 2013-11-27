function AudioMgr() {
  this.beepAudio = new Audio();
  this.audio = new Audio();
  this.beepAudio.src = R_ + "/music/beep" + MF_;
  this.lastSrc = undefined;
  this.bgAudioSrc = R_ + "/music/BgMusic" + MF_;
}

AudioMgr.prototype.isBgPlaying = function () {
  if (this.audio.src) {
    if (this.audio.src.indexOf(this.bgAudioSrc) != -1) {
      return true;
    }
  }
  return false;
};

AudioMgr.prototype.resetAudio = function () {
  this.audio.pause();
  // every change song needs a new audio
  this.audio = null;
  this.audio = new Audio();
};

AudioMgr.prototype.setSrc = function () {
  this.audio.src = R_ + "/music/" + this.songName + MF_;
  this.audio.loop = false;
};

AudioMgr.prototype.resetBgAudio = function () {
  if (this.isBgPlaying()) {
    // already playing
    return;
  }
  this.audio.src = this.bgAudioSrc;
  this.audio.loop = true;
  this.audio.play();
};
