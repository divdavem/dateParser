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

{
	var separators = ["\s", "!-\/",":-@","\[-_","\{-\}"].join("");
	var wordPattern = "([^" + separators + "]+)";
}

start
  = items:(item*)
  {
    var buildRegexp = ["^"];
    var groups = [];
    for (var i = 0, l = items.length ; i < l; i++) {
      var curItem = items[i];
      buildRegexp.push(curItem.regExp);
      if (curItem.matching) {
        groups.push(curItem.original);
      }
    }
    buildRegexp.push("$");
    return {
      regExp: new RegExp(buildRegexp.join("")),
      groups: groups
    };
  }

item
  = fourDigits / word / twoDigits / oneOrTwoDigits / other

fourDigits
  = o:"yyyy"
  { return { regExp: "([0-9]{4})", original: o, matching: true } ; }

twoDigits
  = o:("yy" / "MM" / "dd" )
  { return { regExp: "([0-9]{2})", original: o, matching: true } ; }

oneOrTwoDigits
  = o:("y" / "M" / "d" )
  { return { regExp: "([0-9]{1,2})", original: o, matching: true } ; }

word
  = o:( "EEEE" / "EEE" / "EE" / "E" / "MMMM" / "MMM" )
  { return { regExp: wordPattern, original: o, matching: true } ; }

other
  = o:.
  { return { regExp: "\\"+ o, original: o, matching: false}; }
