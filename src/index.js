import { variableType } from "./utils.js";
import easing from "./easing.js";

class Manticore {
    constructor(opts) {
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
    }

    setBaseAnimationValues(element, duration, ease) {
        this._element = element;
        this._duration = duration;
        this._firstFrame = null;

        if (easing[ease]) {
            this._easing = ease;
        } else {
            this._easing = "easeInOutSine";
            console.warn(
                `Invalid easing function name. swithing to default easing method. ease: ${
                    easing || "no-name-provided"
                } not found`
            );
        }
    }

    setTarget(target) {
        return variableType(target) === "String"
            ? (target = document.querySelector(target))
            : target;
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
        const easingCurve = easing[this._easing](elapsedRate);
        // pixleChangeRate
        const pixleChange = Math.min(easingCurve, 1);


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
        };

        // set base options
        this.setBaseAnimationValues(element, opts.duration * 1000, opts.easing);

        const from = {
            left: opts.left,
            top: opts.top,
        };

        requestAnimationFrame((timestamp) => {
            this.animate.call(this, timestamp, from, animationEndingOptions);
        });
    }
}

export default new Manticore();
