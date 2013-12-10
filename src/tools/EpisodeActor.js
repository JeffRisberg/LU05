
function EpisodeActor(episodeInfo) {
    var that = this;

    CAAT.Actor.call(this);

    console.log(episodeInfo.name)

    return this;
}

EpisodeActor.prototype = new CAAT.Actor();