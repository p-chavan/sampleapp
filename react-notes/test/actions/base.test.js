var BaseAction = require("actions/base");

describe("actions - base", function() {
	describe("all", function() {
		it("should return 'all' constant for type", function() {
			var all = "the all constant";
			expect(new BaseAction({ "ALL": all }).all().type).toEqual(all);
		});
		
		it("should have no content", function() {
			expect(new BaseAction({ "ALL": "the all constant" }).all().content).toBe(undefined);
		});
	});	

});