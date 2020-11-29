import { variableType } from "./utils.js";
import easing from "./easing.js";

class Manticore {
    constructor(opts) {
        if (Manticore.instance) {
            return Manticore.instance;
        }
        Manticore.instance = this;

        // base variables
        this._diff = null;
        this._element = null;
        this._easing = null;
        this._duration = null;
        //
        this._firstFrame = null;
        this._validAnimations = {
            transform: (left, top) => { this._element.style.transform = `translate3d(${left}px, ${top}px, 0)`; },
            opacity: (opacity) => { this._element.style.opacity = opacity ; }
        }
    }

    setBaseAnimationValues(element, duration, easing) {
        this._element = element;
        this._duration = duration;
        this._easing = easing;
    }

    setTarget(target) {
        return variableType(target) === "String" ? (target = document.querySelector(target)) : (target);
    }

    diff(from, to) {
        const _diff = {
            transform: {
                left: -1,
                top: -1,
            },
            opacity: -1,
        };
        if(from.left >= to.left) {
            _diff.transform.left = from.left;
        }
        if(from.top >= to.top) {
            _diff.transform.top = from.top;
        }
        if(from.opacity < to.opacity) {
            _diff.opacity = from.opacity;
        }

        return _diff;
    }

    calculateTween(startPosition, pixleChangeRate) {
        const _pixleDiff = startPosition * pixleChangeRate;
        return startPosition - _pixleDiff;
    }

    moveElement(left, top, opacity) {
        this._element.style.opacity = `${opacity}`;
        this._element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }

    animate(timestamp, from, to) {
        !this._firstFrame && (this._firstFrame = timestamp);

        // remaining time to calculate
        const elapsed = timestamp - this._firstFrame;
        // change rate percentage
        const elapsedRate = elapsed / this._duration;
        // add easing curve
        const easingCurve = easing.easeInOutCubic(elapsedRate);
        // pixleChangeRate
        const pixleChange =  Math.min(easingCurve, 1);

        // execute animations
        const _left = this.calculateTween(from.left, pixleChange);
        const _top = this.calculateTween(from.top, pixleChange);
        this.moveElement(_left, _top, pixleChange);

        if (elapsed < this._duration) {
            requestAnimationFrame((timestamp) => {
                this.animate.call(this, timestamp, from, to);
            });
        }
    }

    from(opts = {}) {
        const element = this.setTarget(opts.target);
        const animationEndingOptions = {
            left: element.offsetLeft,
            top: element.offsetTop,
            opacity: getComputedStyle(element).getPropertyValue("opacity"),
        };

        // set base options
        this.setBaseAnimationValues(element, opts.duration * 1000, opts.easing);

        // move element to start position
        //this.moveElement(element, opts);
        // ....

        const from = {
            left: opts.left,
            top: opts.top,
            opacity: opts.opacity,
        };
        this._diff = this.diff(from, animationEndingOptions);
        console.log(this._diff);
        

        requestAnimationFrame(timestamp => {
            this.animate.call(this, timestamp, from, animationEndingOptions);
        });
        
    }
}

export default new Manticore();