(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var x = 0;
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());

var Spinner = function(config) {
    var ctx;
    this.ms_per_frame = 2.778; // ms per frame to maintain 360deg rot per sec

    try {
        this.ctx = ctx = document.getElementById(config.canvas_id).getContext('2d');
    } catch (e) {
        throw new Error('couldn\'t find <canvas> context, canvas id was: "' + config.canvas_id + '"');
    }

    this.width = ctx.canvas.width;
    this.max_radius = this.width / 2;

    if (this.width !== ctx.canvas.height) {
        throw new Error('<canvas> must be square, width must equal height.');
    }

    this.segment_angle = config.segment_angle || 20;
    this.segment_gap_angle = config.segment_gap_angle || 0;
    this.segment_max_angle = config.segment_max_angle || 240;
    this.segment_max_angle++;

    var r = this.max_radius * 0.66; // sensible default for segment_radius
    if (config.segment_radius) {
        this.segment_radius = (config.segment_radius > this.max_width ) ?  r : config.segment_radius;
    } else {
        this.segment_radius = r;
    }

    this.segment_depth = config.segment_depth || 1;

    // colour values must be array of values [0-255] and length 3
    this.foreground = config.foreground || [221,72,20];

    this.speed = config.speed || 1;
};


Spinner.prototype = {

    play: function() {

        var ctx = this.ctx;
        var origin = this.max_radius;
        this.start = Date.now();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(origin, origin);
        this.frame();

    },


    frame: function() {

        var ctx = this.ctx;
        var now = Date.now();
        var delta = (now - this.start);
        var rotation_this_frame = (Math.PI / 180) * (delta / ((1 / this.speed) * this.ms_per_frame));
        this.start = now;
        this.clear();
        ctx.rotate(rotation_this_frame);
        this._draw_cone();
        var boundFrame = this.frame.bind(this);
        this.animationFrame = window.requestAnimationFrame(boundFrame);

    },

    _rgba: function(rgb, alpha) {
        var rgba;
        rgba = rgb.concat(alpha);
        return 'rgba(' + rgba.join() + ')';
    },

    _draw_cone: function() {

        var ctx = this.ctx;
        var large_radius = this.segment_radius;
        var small_radius = Math.abs(this.segment_radius - this.segment_depth);
        var total_segment_angle = this.segment_angle + this.segment_gap_angle;
        var alpha_unit = (this.segment_max_angle - 1) / 10;
        var i = 0;
        var alpha = 0;
        ctx.save();
        for (; i < this.segment_max_angle; i += total_segment_angle) {

            alpha = (i / alpha_unit | 0) / 10;
            ctx.fillStyle = this._rgba(this.foreground, alpha);
            this._draw_segment(this.segment_angle, small_radius, large_radius);
            ctx.rotate(Math.PI / 180 * total_segment_angle);

        }
        ctx.restore();

    },


    _draw_segment: function(theta, small_radius, large_radius) {

        var ctx = this.ctx;
        var rads = Math.PI/180 * theta;
        var arc_start = Math.PI/180 * 270;
        var arc_end = arc_start + rads;
        ctx.beginPath();
        ctx.moveTo(0, -small_radius);
        ctx.lineTo(0, -large_radius);
        ctx.arc(0, 0, large_radius, arc_start, arc_end);
        ctx.lineTo(
            Math.sin(rads) * small_radius,
            -(Math.cos(rads) * small_radius)
        );
        ctx.arc(0, 0, small_radius, arc_end, arc_start, true);
        ctx.closePath();
        ctx.fill();

    },


    clear: function() {

        var ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.width);
        ctx.restore();

    },


    stop: function() {

        window.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = undefined;

    }

};

