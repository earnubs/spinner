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
    try {
        var ctx = this.ctx = document.getElementById(config.canvas_id).getContext('2d');
    } catch (e) {
        throw new Error('couldn\'t find <canvas> context, canvas id was: "' + config.canvas_id + '"');
    }

    this.width = ctx.canvas.width;

    if (this.width !== ctx.canvas.height) {
        throw new Error('<canvas> must be square, width must equal height.')
    }

};


Spinner.prototype = {
    play: function() {
        var ctx = this.ctx;
        var origin = this.width / 2;
        this.start = Date.now();
        this.rotation_per_frame = (Math.PI / 180) * 5;
        this.displacement = 0;
        this.increment = 0;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(origin, origin);
        this.frame();
    },
    stop: function() {
        window.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = undefined;
    },
    clear: function() {
        var ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.width);
        ctx.restore();
        ctx.arc(0, 0, this.width/2 - 1, 0, Math.PI * 2);
        ctx.fillStyle = '#dd4814';
        ctx.fill();
    },
    frame: function() {
        var ctx = this.ctx;
        var now = Date.now();
        var delta = (now - this.start);
        var rotation_this_frame = (Math.PI / 180) * (delta / 2.778); // 2.778ms per frame, @60fps = 360deg per sec

        this.start = now;
        this.clear();
        ctx.rotate(rotation_this_frame);

        this.draw_cone();

        var boundFrame = this.frame.bind(this);

        this.animationFrame = window.requestAnimationFrame(boundFrame);
    },

    draw_cone: function() {
        var ctx = this.ctx;
        var large_radius = this.width / 2 * 0.66;
        var small_radius = large_radius * 0.5;
        var angle = 10;
        var gap = 2;
        var i = 0;
        var alpha = 0;

        ctx.save();

        for (; i < 360; i += (angle * gap)) {

            alpha = ((i / 360 * 100) | 0) / 100;

            ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
            drawRadial(angle, small_radius, large_radius);
            ctx.rotate(Math.PI / 180 * (angle * gap));

        }

        ctx.restore();

        function drawRadial(theta, small_radius, large_radius) {
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
        }
    }
};


/**

Spinner.play = function () {
    Spinner.ctx = document.getElementById('spinner').getContext('2d');

    Spinner.width = Spinner.ctx.canvas.width;
    Spinner.height = Spinner.ctx.canvas.height;
    Spinner.start = Date.now();
    Spinner.rotation_per_frame = (Math.PI / 180) * 30;
    Spinner.displacement = 0;
    Spinner.increment = 0;
    Spinner.COLOURS = Spinner.COLOURS || {};
    Spinner.COLOURS.bg = '#dd4814';
    Spinner.COLOURS.fg = 'rgba(255,255,255,';

    Spinner.ctx.setTransform(1, 0, 0, 1, 0, 0);
    Spinner.ctx.translate(Spinner.width / 2 + 0.5, Spinner.height / 2 + 0.5);

    Spinner.core.frame();
};

Spinner.stop = function () {
    window.cancelAnimationFrame(Spinner.core.animationFrame);
};

Spinner.setup = {};

Spinner.core = {
    frame: function () {
        var now = Date.now();
        var delta = (now - Spinner.start) / 4;
        var increment;
        Spinner.start = now;

        Spinner.displacement += (delta);
        if (Spinner.displacement > 360) t = 0;
        increment = (Spinner.displacement / 10) | 0;
        Spinner.ctx.globalCompositeOperation = 'source-over';
        Spinner.core.clear();
        if (increment !== Spinner.increment) {
            Spinner.ctx.rotate(Spinner.rotation_per_frame);
        }
        Spinner.ctx.globalCompositeOperation = 'source-over';
        Spinner.core.radial();
        Spinner.increment = increment;

        Spinner.core.animationFrame = window.requestAnimationFrame(Spinner.core.frame);
    },

    clear: function () {
        Spinner.ctx.save();
        Spinner.ctx.setTransform(1, 0, 0, 1, 0, 0);
        Spinner.ctx.clearRect(0, 0, Spinner.width, Spinner.height);
        Spinner.ctx.restore();
    },

    radial: function (continuous) {
        var ctx = Spinner.ctx;
        var radius = ctx.canvas.width / 2;
        var hypotenuse = radius;
        var angle = 10;
        var gap = 2.5;
        continuous = continuous || false;
        var opposite = Math.sin(angle * (Math.PI / 180)) * hypotenuse;
        var i = 0;
        var alpha = 0;

        ctx.save();
        for (; i < 360; i += (angle * gap)) {

            alpha = ((i / 360 * 100) | 0) / 100;
            //alpha = Math.cos((Math.PI / 180) * i );

            ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
            drawRadial(0, 0, radius, opposite);
            ctx.rotate(Math.PI / 180 * (angle * gap));

        }

        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.66, 0, Math.PI * 2, true);
        ctx.lineWidth = radius / 5;
        ctx.stroke();
        ctx.restore();

        function drawRadial(x, y, length, width) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(-width, -length);
            ctx.lineTo(width, -length);
            ctx.fill();
        }
    }
};

/**

var gui = new dat.GUI();
gui.add(Spinner, 'width', 0, 20);

var play = document.getElementById('play');
var stop = document.getElementById('stop');

play.addEventListener('click', function (e) {
    e.preventDefault();
    Spinner.play();
});

stop.addEventListener('click', function (e) {
    e.preventDefault();
    Spinner.stop();
    Spinner.core.animationFrame = undefined;
});

**/
