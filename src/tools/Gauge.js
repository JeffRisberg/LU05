/**
 *
 * All rights reserved by Squirrel Legend
 */
function Gauge(director, minValue, maxValue) {
  this.director = director;
  CAAT.ActorContainer.call(this);

  this.minValue = minValue;
  this.maxValue = maxValue;

  this.dial = Util.createImageActorInBound(this.director, "dial", 0, 0, 100 * sf, 100 * sf);
  this.addChild(this.dial);

  this.needle = Util.createImageActorInBound(this.director, "needle", 0, 0, 100 * sf, 100 * sf);
  this.addChild(this.needle);

  this.setValue(minValue);

  return this;
}

Gauge.prototype = new CAAT.ActorContainer();

Gauge.prototype.setValue = function (value) {

  // Calculate fraction of range (number between 0 and 1)
  var fracRange = (value - this.minValue) / (this.maxValue - this.minValue);

  // Calculate angle based upon range fraction. Need to lookup in degrees or radius
  var angle = -140 + 280 * fracRange;
  console.log(angle);

  var angleInRads = angle / 57.29;

  // Rotate the dial actor to the angle calculated.
  this.needle.setRotation(angleInRads);
};
