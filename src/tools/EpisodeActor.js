/**
 * This actor creates a button that maintains episode info.
 *
 * It is a "little brother" to the LockActor class, that class also implements clickable links
 * to episode information, but also has an image, a frame around the image, and indicator for
 * locking status, rules for unlocking, etc.
 *
 * It is typically used on scenes that have a list of episodes.
 */
function EpisodeActor(episodeInfo) {
  var that = this;

  this.episodeInfo_ = episodeInfo;

  CAAT.Actor.call(this);

  this.getEpisodeInfo = function () {
    return that.episodeInfo_;
  };

  return this;
}

EpisodeActor.prototype = new CAAT.Actor();