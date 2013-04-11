var myGlobal = (function () {
	var aPrivateThing = 12;

	return {
		getIt : function () {
			return aPrivateThing;
		},

		multiply : function (factor) {
			aPrivateThing = aPrivateThing * factor;
		}
	};
})();