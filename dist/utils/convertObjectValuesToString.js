"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertObjectValuesToString = void 0;
function convertObjectValuesToString(obj) {
    function isObject(val) {
        return typeof val === "object" && !Array.isArray(val);
    }
    function convertValueToString(val) {
        return isObject(val) ? convertObjectValuesToString(val) : String(val);
    }
    if (isObject(obj)) {
        const convertedObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                convertedObj[key] = convertValueToString(value);
            }
        }
        return convertedObj;
    }
    else {
        return convertValueToString(obj);
    }
}
exports.convertObjectValuesToString = convertObjectValuesToString;
//# sourceMappingURL=convertObjectValuesToString.js.map