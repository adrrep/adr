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
  enableSpecFieldOnRadio('stop','#stop-reduced');
  enableSpecFieldOnRadio('reintro','#reintro-reduced');
});

function enableSpecFieldOnRadio(radioId, fieldSelector) {
  $('input[type=radio][name=' + radioId + ']').on('change', function() {
    switch($(this).val()) {
      case 'yes':
        $(field).prop('disabled', false);
        break;
      case 'no':
      case 'unknown':
      case 'na':
        $(fieldSelector).val("");
        $(fieldSelector).removeClass('valid');
        $(fieldSelector).removeClass('invalid');
        $(fieldSelector).prop('disabled', true);
        break;
    }
  });
}

var medicationCount = 0;
function medicationAdd() {
  var name = $('#medication-name').val();
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
  var stop = $("input[type='radio'][name='stop']:checked").val();
  var stopReduced = 0;
  if (stop == "yes") stopReduced = $('#stop-reduced').val();
  var reintro = $("input[type='radio'][name='reintro']:checked").val();
  var reintroReduced = 0;
  if (reintro == "yes")  reintroReduced = $('reintro-reduced').val();
}
