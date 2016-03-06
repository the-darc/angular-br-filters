var BrM = require('br-masks');

var m = angular.module('idf.br-filters', []);

module.exports = m.name;

m.filter('percentage', ['$filter', function($filter) {
	return function(input, decimals) {
		if (angular.isUndefined(input) || input === null) {
			return input;
		}

		return $filter('number')(input * 100, decimals) + '%';
	};
}])
.filter('brCep', [function() {
	return function(input) {
		return BrM.cep(input);
	};
}])
.filter('brPhoneNumber', [function() {
	return function(input) {
		return BrM.phone(input);
	};
}])
.filter('brCpf', [function() {
	return function(input) {
		return BrM.cpf(input);
	};
}])
.filter('brCnpj', [function() {
	return function(input) {
		return BrM.cnpj(input);
	};
}])
.filter('brCpfCnpj', [function() {
	return function(input) {
		return BrM.cpfCnpj(input);
	};
}])
.filter('brIe', [function() {
	return function(input, uf) {
		return BrM.ie(input,uf);
	};
}])
.filter('finance', ['$locale', function($locale) {
	return function(input, currency, decimals) {
		if (angular.isUndefined(input) || input === null) {
			return input;
		}

		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
			currencySym = '';

		if (currency === true) {
			currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM + ' ';
		} else if (currency) {
			currencySym = currency;
		}

		return currencySym + BrM.finance(input, decimals, decimalDelimiter, thousandsDelimiter);
	};
}])
.filter('nfeAccessKey', [function() {
	return function(input) {
		return BrM.nfeAccessKey(input);
	};
}])
.filter('age', function() {
	/**
	 * @param value birthdate can be a date object or a time in milliseconds
	 * return the age based on the birthdate or undefined if value is invalid.
	 */
	 return function calculateAge(value) {
		 if (!value) {
			 return undefined;
		 }
		 var isDateInstance = (value instanceof Date);
		 var isValidType = isDateInstance || !isNaN(parseInt(value));
		 if (!isValidType) {
			 return undefined;
		 }
		 var birthdate = isDateInstance ? value : new Date(value);
		 if (birthdate > new Date()) {
			 return undefined;
		 }
		 var ageDifMs = Date.now() - birthdate.getTime();
		 var ageDate = new Date(ageDifMs); // miliseconds from epoch
		 return Math.abs(ageDate.getUTCFullYear() - 1970);
	 };
});
