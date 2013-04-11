var anotherObject = function (param) {
	var value = param;

	this.increase = function () {
		value += 1;
	};

	this.getValue = function () {
		return value;
	};
};

anotherObject.prototype.twice = function () {
	for (var i = this.getValue() - 1; i >= 0; i -= 1) {
		this.increase();
	}
};