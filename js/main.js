$(document).ready(function(){
  $('.chips').material_chip();
  $('.datepicker').pickadate({
    format: 'dd/mm/yyyy',
    selectMonths: true
  });
  $('.datepicker-year').pickadate({
    format: 'dd/mm/yyyy',
    selectMonths: true,
    selectYears: 7
  });
  $('#medication-add').modal();
});

var medicationCount = 0;
var medicationOne;
function medicationAdd() {
  var name = $('#medication-name').val();
  medicationOne = name;
  var manufacturer = $('#manufacturer').val();
  var batch = $('#batch').val();
  var expiry = $('#expiry').pickadate().pickadate('picker').get();
  var dose = $('#dose').val();
  var route = $("input[type='radio'][name='route']:checked").val();
  var frequency = $('#freq').val();
  var therapyStart = $('#therapy-start').pickadate().pickadate('picker').get();
  var therapyEnd = $('#therapy-end').pickadate().pickadate('picker').get();
  var duration = $('#duration').val();
  var reason = $('#reason').val();
}
