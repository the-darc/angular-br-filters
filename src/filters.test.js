require('./filters.js');

/* global expect,inject,beforeEach,it,describe */
describe('br-filters', function() {
	beforeEach(angular.mock.module('idf.br-filters'));

	function testFilter(name) {
		var filter;

		inject(['$filter', function($filter) {
			filter = $filter(name);
		}]);

		return filter;
	}

	describe('percentage', function() {
		it('should not format if null or undefined', function(){
			expect(testFilter('percentage')(null)).toBe(null);
			expect(testFilter('percentage')(undefined)).toBe(undefined);
		});

		it('should format numbers', function() {
			expect(testFilter('percentage')('')).toBe('0%');
			expect(testFilter('percentage')(0)).toBe('0%');
			expect(testFilter('percentage')(0.3)).toBe('30%');
			expect(testFilter('percentage')(0.189)).toBe('18.9%');
			expect(testFilter('percentage')('0.045')).toBe('4.5%');
			expect(testFilter('percentage')(2.345e-4)).toBe('0.023%');
		});

		it('should format numbers with correct number of decimals', function() {
			expect(testFilter('percentage')(0.3, 2)).toBe('30.00%');
			expect(testFilter('percentage')(0.189, 3)).toBe('18.900%');
			expect(testFilter('percentage')('0.045', 0)).toBe('5%');
			expect(testFilter('percentage')(2.345e-4, 2)).toBe('0.02%');
		});
	});

	describe('brCep', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brCep')(null)).toBe(null);
			expect(testFilter('brCep')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('brCep')('30480530')).toBe('30480-530');
			expect(testFilter('brCep')(30480530)).toBe('30480-530');
		});
	});

	describe('brPhoneNumber', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brPhoneNumber')(null)).toBe(null);
			expect(testFilter('brPhoneNumber')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('brPhoneNumber')('3133340167')).toBe('(31) 3334-0167');
			expect(testFilter('brPhoneNumber')(3133340167)).toBe('(31) 3334-0167');
			expect(testFilter('brPhoneNumber')('38212201255')).toBe('(38) 21220-1255');
			expect(testFilter('brPhoneNumber')(38212201255)).toBe('(38) 21220-1255');
		});
	});

	describe('brCpf', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brCpf')(null)).toBe(null);
			expect(testFilter('brCpf')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('brCpf')('97070868669')).toBe('970.708.686-69');
			expect(testFilter('brCpf')(97070868669)).toBe('970.708.686-69');
			expect(testFilter('brCpf')('1435151')).toBe('143.515.1');
			expect(testFilter('brCpf')(1435151)).toBe('143.515.1');
		});
	});

	describe('brCnpj', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brCnpj')(null)).toBe(null);
			expect(testFilter('brCnpj')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('brCnpj')('10157471000161')).toBe('10.157.471/0001-61');
			expect(testFilter('brCnpj')(10157471000161)).toBe('10.157.471/0001-61');
		});
	});

	describe('brCpfCnpj', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brCpfCnpj')(null)).toBe(null);
			expect(testFilter('brCpfCnpj')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('brCpfCnpj')('97070868669')).toBe('970.708.686-69');
			expect(testFilter('brCpfCnpj')('1435151')).toBe('143.515.1');
			expect(testFilter('brCpfCnpj')('10157471000161')).toBe('10.157.471/0001-61');
		});
	});

	describe('brIe', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('brIe')(null)).toBe(null);
			expect(testFilter('brIe')(undefined)).toBe(undefined);
		});

		it('should not format a number', function() {
			expect(testFilter('brIe')(32141840, 'PE')).toBe(32141840);
		});

		it('should format a string', function() {
			expect(testFilter('brIe')('032141840', 'PE')).toBe('0321418-40');
		});
	});

	describe('finance', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('finance')(null)).toBe(null);
			expect(testFilter('finance')(undefined)).toBe(undefined);
		});

		it('should format a string or a number', function() {
			expect(testFilter('finance')('123.1237123', '$ ', 3)).toBe('$ 123.124');
			expect(testFilter('finance')(123.1237123, 'R$ ', 3)).toBe('R$ 123.124');
			expect(testFilter('finance')(123.1237123, true)).toMatch(/.+ 123.12/);
			expect(testFilter('finance')(0)).toMatch(/0.00/);
		});
	});

	describe('nfeAccessKey', function () {
		it('should not format if null or undefined', function() {
			expect(testFilter('nfeAccessKey')(null)).toBe(null);
			expect(testFilter('nfeAccessKey')(undefined)).toBe(undefined);
		});

		it('should format a string', function() {
			expect(testFilter('nfeAccessKey')('35140111724258000157550010006882191630386000'))
				.toBe('3514 0111 7242 5800 0157 5500 1000 6882 1916 3038 6000');
		});
	});
	describe('age', function() {
		it('should be undefined if null, undefined or empty', function() {
			expect(testFilter('age')(null)).toBe(undefined);
			expect(testFilter('age')(undefined)).toBe(undefined);
			expect(testFilter('age')('')).toBe(undefined);
		});

		it('should be undefined if not date or time in milliseconds', function() {
			expect(testFilter('age')('not a date')).toBe(undefined);
			expect(testFilter('age')(true)).toBe(undefined);
		});

		it('should be undefined for future birthdate', function() {
			var futureYear = new Date();
			futureYear.setFullYear(futureYear.getFullYear() + 1);
			expect(testFilter('age')(futureYear)).toBe(undefined);
			var futureMonth = new Date();
			futureMonth.setMonth(futureMonth.getMonth() + 1);
			expect(testFilter('age')(futureMonth)).toBe(undefined);
			var futureDay = new Date();
			futureDay.setDate(futureDay.getDate() + 1);
			expect(testFilter('age')(futureDay)).toBe(undefined);
			var futureMinute = new Date();
			futureMinute.setMinutes(futureMinute.getMinutes() + 1);
			expect(testFilter('age')(futureMinute)).toBe(undefined);
		});

		it('should format date as 27', function() {
			var age = 27;
			var yearInMs = 366 * 24 * 60 * 60 * 1000;
			var born = new Date(new Date().getTime() - age*yearInMs);
			expect(testFilter('age')(born)).toBe(age);
			expect(testFilter('age')(born.getTime())).toBe(age);
		});
	});
});
