/* formulas from : https://easings.net/ */
const easing = function () {
    return {
        easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
        easeInOutCirc: (x) =>
            x < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
        easeInOutQuad: (x) =>
            x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
        easeInOutCubic: (x) =>
            x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
        easeOutBounce: (x) => {
            const n1 = 7.5625;
            const d1 = 2.75;
            let _result;
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

export default easing();
