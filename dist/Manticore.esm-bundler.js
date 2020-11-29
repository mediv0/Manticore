/*!
 * Manticore v0.1.0
 * (c) 2020 Mahdi Fakhr
 * @license MIT
 */
var variableType = function (variable) {
    return Object.prototype.toString.call(variable).slice(8, -1);
};

/* formulas from : https://easings.net/ */
var easing = function () {
    return {
        easeInOutSine: function (x) { return -(Math.cos(Math.PI * x) - 1) / 2; },
        easeInOutCirc: function (x) { return x < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2; },
        easeInOutQuad: function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; },
        easeInOutCubic: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
        easeOutBounce: function (x) {
            var n1 = 7.5625;
            var d1 = 2.75;
            var _result;
            if (x < 1 / d1) {
                _result = n1 * x * x;
            } else if (x < 2 / d1) {
                _result = n1 * (x -= 1.5 / d1) * x + 0.75;
            } else if (x < 2.5 / d1) {
                _result = n1 * (x -= 2.25 / d1) * x + 0.9375;
            } else {
                _result = n1 * (x -= 2.625 / d1) * x + 0.984375;
            }
            return _result;
        },
    };
};

var easing$1 = easing();

var Manticore = function Manticore(opts) {
    if (Manticore.instance) {
        return Manticore.instance;
    }
    Manticore.instance = this;

    // base variables
    this._element = null;
    this._easing = null;
    this._duration = null;
    //
    this._firstFrame = null;
};

Manticore.prototype.setBaseAnimationValues = function setBaseAnimationValues (element, duration, ease) {
    this._element = element;
    this._duration = duration;

    if (easing$1[ease]) {
        this._easing = ease;
    } else {
        this._easing = "easeInOutSine";
        console.warn(
            ("Invalid easing function name. swithing to default easing method. ease: " + (easing$1 || "no-name-provided") + " not found")
        );
    }
};

Manticore.prototype.setTarget = function setTarget (target) {
    return variableType(target) === "String"
        ? (target = document.querySelector(target))
        : target;
};

Manticore.prototype.calculateTween = function calculateTween (startPosition, pixleChangeRate) {
    var _pixleDiff = startPosition * pixleChangeRate;
    return startPosition - _pixleDiff;
};

Manticore.prototype.moveElement = function moveElement (left, top, opacity) {
    this._element.style.opacity = "" + opacity;
    this._element.style.transform = "translate3d(" + left + "px, " + top + "px, 0)";
};

Manticore.prototype.animate = function animate (timestamp, from, to) {
        var this$1 = this;

    !this._firstFrame && (this._firstFrame = timestamp);

    // remaining time to calculate
    var elapsed = timestamp - this._firstFrame;
    // change rate percentage
    var elapsedRate = elapsed / this._duration;
    // add easing curve
    var easingCurve = easing$1[this._easing](elapsedRate);
    // pixleChangeRate
    var pixleChange = Math.min(easingCurve, 1);

    // execute animations
    var _left = this.calculateTween(from.left, pixleChange);
    var _top = this.calculateTween(from.top, pixleChange);
    this.moveElement(_left, _top, pixleChange);

    if (elapsed < this._duration) {
        requestAnimationFrame(function (timestamp) {
            this$1.animate.call(this$1, timestamp, from, to);
        });
    }
};

Manticore.prototype.from = function from (opts) {
        var this$1 = this;
        if ( opts === void 0 ) opts = {};

    var element = this.setTarget(opts.target);
    var animationEndingOptions = {
        left: element.offsetLeft,
        top: element.offsetTop,
    };

    // set base options
    this.setBaseAnimationValues(element, opts.duration * 1000, opts.easing);

    var from = {
        left: opts.left,
        top: opts.top,
    };

    requestAnimationFrame(function (timestamp) {
        this$1.animate.call(this$1, timestamp, from, animationEndingOptions);
    });
};

var index = new Manticore();

export default index;
