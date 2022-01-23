exports.printStr = function (str) {
    console.log(str);
};
exports.exports = /** @class */ (function () {
    function class_1(name, age) {
        this.name = name;
        this.age = age;
    }
    class_1.prototype.getName = function () {
        return this.name;
    };
    return class_1;
}());
