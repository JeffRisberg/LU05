function WrapFont(content, textSize_, textColor,textStyle) {

  CAAT.Actor.call(this);
  var content_;
  var textColor_ = textColor || FONT_COLOR;
  var textStyle_ = textStyle || "Action Man Bold";
  var align_ = "left";
  var alignV_ = "";
  //var textStyle_ = textStyle || "SF Cartoonist Hand Bold";
  //var textStyle_ = textStyle || "Vanilla";
  var autoLayout_ = false;
  this.width = W_;
  this.enableEvents(false);

  Util.isInt(textSize_);
  textSize_ = Math.round(textSize_);
  var didOnce_ = false;

  function fragmentText(ctx, text, maxWidth) {
    var words = text.split(' '),
      lines = [],
      line = "";
    if (ctx.measureText(text).width < maxWidth) {
      return [text];
    }
    while (words.length > 0) {
      while (ctx.measureText(words[0]).width >= maxWidth) {
        var tmp = words[0];
        words[0] = tmp.slice(0, -1);
        if (words.length > 1) {
          words[1] = tmp.slice(-1) + words[1];
        } else {
          words.push(tmp.slice(-1));
        }
      }
      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += words.shift() + " ";
      } else {
        lines.push(line);
        line = "";
      }
      if (words.length === 0) {
        lines.push(line);
      }
    }
    return lines;
  }

  function processTextWithNewLine(ctx, text, maxWidth) {
    var words = text.split('\n');
    var lines = [];
    for (var i = 0; i < words.length; i++) {
      var linesSeg = fragmentText(ctx, words[i], maxWidth);
      lines = lines.concat(linesSeg);
    }
    return lines;
  }

  this.paint = function(director, time) {
    var ctx = director.ctx;
    ctx.font = "" + textSize_ + "px " + textStyle_;
    var fontHeight = parseInt(ctx.font, 0);
    ctx.fillStyle = textColor_;
    ctx.textAlign = align_;
    var startPos;
    if (align_ == "left") {
      startPos = 0;
    } else if (align_ == "center" ) {
      startPos = this.width /2;
    }


    var textArray_ = processTextWithNewLine(ctx, content_, this.width);
    var offset;
    if (alignV_ == "center") {
      var spaceTotalLines = Math.floor(this.height / fontHeight);
      offset = Math.floor((spaceTotalLines - textArray_.length) /2);
    } else {
      offset = 0;
    }

    for (var i = 0; i < textArray_.length; i++) {
      var textEachLine = textArray_[i];
      var height = (i+1+offset)*fontHeight;
      ctx.fillText(textEachLine, startPos, height);
      if (!didOnce_ && height > this.height && DEBUG_.notRelease) {
        console.error("WrapFont's content height " + height + " > actor height ", this.height);
        didOnce_ = true;
      }
    }

    if (autoLayout_) {
      this.setSize(this.width, textArray_.length * fontHeight);
    }

    if (DEBUG_.layout) {
      ctx.strokeStyle = "green";
      ctx.rect(0, 0, this.width, this.height);
      ctx.stroke();
    }
  };

  this.setText = function( text ) {
    content_ = text + "";
    return this;
  };

  this.appendText = function (text) {
    content_ = content_ + text;
    return this;
  };


  this.setAlign = function(align) {
    var aligns = ["left", "center"];
    if (aligns.indexOf(align) == -1) {
      console.error("align " + align + " not supported in WrapFont");
    }
    align_ = align;
    return this;
  };

  // set text appear in the center vertically
  this.setAlignCenterV = function() {
    alignV_ = "center";
    return this;
  };

  this.setAutoLayout = function(bool) {
    autoLayout_ = bool;
    return this;
  };

  this.getContent = function() {
    return content_;
  };

  // init
  this.setText(content);

  return this;

}

WrapFont.prototype = new CAAT.Actor();


