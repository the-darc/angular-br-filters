'use strict';

/*globals BrM */
angular.module('idf.br-filters', [])
.filter('percentage', ['$filter', function($filter) {
	return function(input, decimals) {
		return $filter('number')(input*100, decimals)+'%';
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
.filter('brIe', [function() {
	return function(input, uf) {
		return BrM.ie(input,uf);
	};
}])
.filter('finance', ['$locale', function($locale) {
	return function(input, currency, decimals) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
			currencySym = '';

		if(currency === true) {
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
}]);
