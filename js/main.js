/*
* ADR Reporting
* Copyright (C) 2017 Divay Prakash
* GNU Affero General Public License 3.0 (https://github.com/divayprakash/adr/blob/master/LICENSE)
*/
$(document).ready(function(){
  $('.button-collapse').sideNav();
  var helpOpen = false;
  $('#help-fab').click(function(e) {
    if (helpOpen) {
      $('#help-tap-target').tapTarget('close');
      helpOpen = false;
    }
    else {
      $('#help-tap-target').tapTarget('open');
      helpOpen = true;
    }
  });
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
  setupTabs();
});

function setupTabs() {
  var tabUl = document.getElementById('tabs-list');
  var tabs = tabUl.getElementsByTagName('li');
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].classList.contains('disabled')) {
      tabs[i].classList.remove('lighten-4');
      tabs[i].classList.add('lighten-5');
    }
    else {
      tabs[i].classList.remove('lighten-5');
      tabs[i].classList.add('lighten-4');
    }
  }
}

function enableSpecFieldOnRadio(radioId, fieldSelector) {
  $('input[type=radio][name=' + radioId + ']').on('change', function() {
    switch($(this).val()) {
      case 'yes':
        $(fieldSelector).prop('disabled', false);
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
  formReset();
  $('#medication-add').modal('close');
  Materialize.toast('Medication added!', 4000, 'rounded');
  var divToAdd = "<div class='card blue lighten-4'><div class='card-content'><span class='card-title'>"+ name +"</span><p>"+ manufacturer + "<br>" + expiry + "</p></div><div class='card-action'><button class='waves-effect waves-light btn'><i class='material-icons right'>mode_edit</i>Edit</button><button class='waves-effect waves-light btn'><i class='material-icons right'>delete</i>Delete</button></div></div>";
  $('#insert').before(divToAdd);
}

function formReset(){
  $('#medication-form').each(function(){
      this.reset();
  });
  $('#medication-add').scrollTop(0);
}
