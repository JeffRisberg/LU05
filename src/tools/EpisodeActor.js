
function EpisodeActor(episodeInfo) {
    var that = this;

    CAAT.ActorContainer.call(this);

    console.log(episodeInfo.name)

    return this;
}

EpisodeActor.prototype = new CAAT.ActorContainer();