/*
 * Copyright 2014 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var inputPatternParser = require("./inputPatternParser.peg.js");

var resources = {
	months : [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	monthsShort : null
};

var cutYear = ((new Date()).getFullYear() + 10) % 100;

var cachedInputPattern = {};
var compileInputPattern = function (inputPattern) {
	if (!cachedInputPattern.hasOwnProperty(inputPattern)) {
		cachedInputPattern[inputPattern] = inputPatternParser.parse(inputPattern);
	}
	return cachedInputPattern[inputPattern];
};

var digitParser = function (field) {
	return function (entry, result) {
		result[field] = parseInt(entry, 10);
	};
};
var monthDigitParser = digitParser("month");
var dateDigitParser = digitParser("date");

var monthsMap = null;
var fillMonthsMap = function () {
	monthsMap = {};
	for (var i = 0, l = resources.months.length; i < l; i++) {
		var curMonth = resources.months[i].toLowerCase();
		monthsMap[curMonth] = i+1;
		if (resources.monthsShort) {
			monthsMap[resources.monthShort[i].toLowerCase()] = i+1;
		} else {
			monthsMap[curMonth.substring(0, 3)] = i+1;
		}
	}
};

var monthParser = function (entry, result) {
	if (!monthsMap) {
		fillMonthsMap();
	}
	if (monthsMap.hasOwnProperty(entry)) {
		result.month = monthsMap[entry.toLowerCase()];
	}
};

var partInterpreters = {
	"yyyy": digitParser("year"),
	"yy" : function (entry, result) {
		var year = parseInt(entry, 10);
		year += (year > cutYear ? 1900 : 2000);
		result[year] = year;
	},
	"M" : monthDigitParser,
	"MM" : monthDigitParser,
	"MMM": monthParser,
	"MMMM" : monthParser,
	"d": dateDigitParser,
	"dd": dateDigitParser
};

module.exports = function (entry, inputPattern){
	var compiledPattern = compileInputPattern(inputPattern);
	var match = compiledPattern.regExp.exec(entry);
	if (match) {
		var groups = compiledPattern.groups;
		var result = {};
		for (var i = 0, l = groups.length; i < l; i++) {
			var element = match[i+1];
			var interpreter = partInterpreters[groups[i]];
			if (interpreter) {
				interpreter(element, result);
			}
		}
		if (result.year != null && result.month != null && result.date != null) {
			return new Date(result.year, result.month - 1, result.date);
		}
	}
};
