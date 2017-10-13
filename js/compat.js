/*
* ADR Reporting
* Copyright (C) 2017 Divay Prakash
* GNU Affero General Public License 3.0 (https://github.com/divayprakash/adr/blob/master/LICENSE)
*/
var dataUriTest;
Modernizr.on('datauri', function(result) {
  dataUriTest = result.valueOf() && result.over32kb;
  var inputTest = Modernizr.input.max && Modernizr.input.min && Modernizr.input.placeholder && Modernizr.input.step;
  var inputTypesTest = Modernizr.inputtypes.date && Modernizr.inputtypes.email && Modernizr.inputtypes.number && Modernizr.inputtypes.range && Modernizr.inputtypes.tel;
  var mediaQueriesTest = Modernizr.mediaqueries;
  var placeholderTest = Modernizr.placeholder;
  var totalTest = dataUriTest && inputTest && inputTypesTest && mediaQueriesTest && placeholderTest;
  if (totalTest) document.getElementById('warning').style.display = 'none';
  else document.getElementById('main-div').style.display = 'none';
});
