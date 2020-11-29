export const variableType = (variable) => {
    return Object.prototype.toString.call(variable).slice(8, -1);
};
