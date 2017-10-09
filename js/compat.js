/*
* ADR Reporting
* Copyright (C) 2017 Divay Prakash
* GNU Affero General Public License 3.0 (https://github.com/divayprakash/adr/blob/master/LICENSE)
*/
//var dataUriTest = Modernizr.datauri.valueOf() && Modernizr.datauri.over32kb;
var formValidationTest = Modernizr.formvalidation;
var hiddenTest = Modernizr.hidden;
var inputTest = Modernizr.input.max && Modernizr.input.min && Modernizr.input.pattern && Modernizr.input.placeholder && Modernizr.input.required && Modernizr.input.step;
var inputTypesTest = Modernizr.inputtypes.date && Modernizr.inputtypes.email && Modernizr.inputtypes.number && Modernizr.inputtypes.range && Modernizr.inputtypes.tel;
var mediaQueriesTest = Modernizr.mediaqueries;
var placeholderTest = Modernizr.placeholder;
var sessionStorageTest = Modernizr.sessionstorage;
//var totalTest = dataUriTest && formValidationTest && hiddenTest && inputTest && inputTypesTest && mediaQueriesTest && placeholderTest && sessionStorageTest;
var totalTest = formValidationTest && hiddenTest && inputTest && inputTypesTest && mediaQueriesTest && placeholderTest && sessionStorageTest;
if (totalTest) document.getElementById('warning').style.display = 'none';
else document.getElementById('main-div').style.display = 'none';
