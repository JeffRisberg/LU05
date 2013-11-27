	var Touchy = function() {
		var that = this;
		this.touchStarted = false;
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
		this.listenFns = {};

    this.reset = function() {
      this.deltaX = 0;
      this.deltaY = 0;
      this.speedX = 0;
      this.speedY = 0;
    };

    this.reset();

		this.listen = function(bounds, fn) {
			this.listenFns[bounds.x1 + '_' + bounds.y1 + '_' + bounds.x2 + '_' + bounds.y2] = fn;
		};

		this.isInBounds = function(bounds, touchX, touchY) {
			var verts = bounds.split('_');
			var x1 = verts[0];
			var y1 = verts[1];
			var x2 = verts[2];
			var y2 = verts[3];
			return (touchY >= y1 && touchY <= y2) && (touchX >= x1 && touchX <= x2);
		};

    this.record = function( touchX, touchY) {
      that.lastNow = Util.timestamp();
      that.lastX = touchX;
      that.lastY = touchY;
    };

    this.calculateSpeed  = function( touchX, touchY) {
      that.now = Util.timestamp();
      var dt = that.now - that.lastNow;
      that.lastNow = that.now;
      that.deltaX = Util.limit(touchX - that.lastX, -50, 50);
      that.deltaY = Util.limit(touchY - that.lastY, -50, 50);
      that.speedX = dt? (Util.limit(that.deltaX / dt, -5, 5)): 5;
      that.speedY = dt? (Util.limit(that.deltaY / dt, -5, 5)): 5;
      if (DEBUG_.slider) {
        console.log("speed:", that.speedX, that.speedY);
      }
      that.lastX = touchX;
      that.lastY = touchY;
    };

		window.document.addEventListener('touchmove', function(e) {
      if( !that.touchStarted) {
        return;
      }

			var touchX = e.changedTouches[0].pageX;
			var touchY = e.changedTouches[0].pageY;
      that.calculateSpeed(touchX, touchY);
			for(x in that.listenFns) {
				if(that.isInBounds(x, touchX, touchY)) {
					that.listenFns[x]({
						x: touchX,
						y: touchY
					}, 'touchmove', e);
				}
			}
		});
		window.document.addEventListener('touchstart', function(e) {
			var touchX = e.changedTouches[0].pageX;
			var touchY = e.changedTouches[0].pageY;
			for(x in that.listenFns) {
				if(that.isInBounds(x, touchX, touchY)) {
					that.listenFns[x]({
						x: touchX,
						y: touchY
					}, 'touchstart', e);
				}
			}
		});
		window.document.addEventListener('touchend', function(e) {
			var touchX = e.changedTouches[0].pageX;
			var touchY = e.changedTouches[0].pageY;
			for(x in that.listenFns) {
					that.listenFns[x]({
						x: touchX,
						y: touchY
					}, 'touchend', e);
			}
		});
		window.document.addEventListener('mousemove', function(e) {
			if(that.touchStarted) {
				var touchX = e.pageX;
				var touchY = e.pageY;
        that.calculateSpeed(touchX, touchY);
        for(x in that.listenFns) {
					if(that.isInBounds(x, touchX, touchY)) {
						that.listenFns[x]({
							x: touchX,
							y: touchY
						}, 'touchmove', e);
					}
				}
			}
		});
		window.document.addEventListener('mousedown', function(e) {
			var touchX = e.pageX;
			var touchY = e.pageY;
			for(x in that.listenFns) {
				if(that.isInBounds(x, touchX, touchY)) {
					that.listenFns[x]({
						x: touchX,
						y: touchY
					}, 'touchstart', e);
				}
			}
		});
		window.document.addEventListener('mouseup', function(e) {
			var touchX = e.pageX;
			var touchY = e.pageY;
			for(x in that.listenFns) {
					that.listenFns[x]({
						x: touchX,
						y: touchY
					}, 'touchend', e);
			}
		});
	};

	// var touchy = new Touchy();
	// touchy.listen(
	// 	{
	// 		x1: 100,
	// 		y1: 100,
	// 		x2: 800,
	// 		y2: 800
	// 	},
	// 	function(e, eventType) {
	// 		console.log(eventType);
	// 	}
	// );
