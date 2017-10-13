/*
* ADR Reporting
* Copyright (C) 2017 Divay Prakash
* GNU Affero General Public License 3.0 (https://github.com/adrrep/adr/blob/master/LICENSE)
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
  enableSpecFieldOnRadio('stop','#stop-reduced','yes');
  //enableSpecFieldOnRadio('reintro','#reintro-reduced');
  enableSpecFieldOnRadio2('serious','other','#serious-spec','death','#date-death','#date-death-label');
  enableSpecFieldOnRadio('outcome','#outcome-spec','other');
  setupTabs();
});

function enableSpecFieldOnRadio2(radioId, caseId1, fieldSelector1, caseId2, fieldSelector2, labelSelector) {
  $('input[type=radio][name=' + radioId + ']').on('change', function() {
    switch($(this).val()) {
      case caseId1:
        $(fieldSelector1).prop('disabled', false);
        $(fieldSelector2).val("");
        $(fieldSelector2).removeClass('valid');
        $(fieldSelector2).removeClass('invalid');
        $(fieldSelector2).prop('disabled', true);
        $(labelSelector).css('color', 'rgba(0, 0, 0, 0.26)');
        break;
      case caseId2:
        $(fieldSelector2).prop('disabled', false);
        $(labelSelector).css('color', '#000');
        $(fieldSelector1).val("");
        $(fieldSelector1).removeClass('valid');
        $(fieldSelector1).removeClass('invalid');
        $(fieldSelector1).prop('disabled', true);
        break;
      default:
        $(fieldSelector1).val("");
        $(fieldSelector1).removeClass('valid');
        $(fieldSelector1).removeClass('invalid');
        $(fieldSelector1).prop('disabled', true);
        $(fieldSelector2).val("");
        $(fieldSelector2).removeClass('valid');
        $(fieldSelector2).removeClass('invalid');
        $(fieldSelector2).prop('disabled', true);
        $(labelSelector).css('color', 'rgba(0, 0, 0, 0.26)');
        break;
    }
  });
}

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

function formSubmit(id) {
  switch(id) {
    case 'patient-submit':
      window.onbeforeunload = function (e) {
        return "Are you sure you want to leave? Any form input so far will be lost!";
      };
      if (processPatientData()) gotoNextTab('patient-tab', 'reaction-tab', 'reaction');
      break;
    case 'reaction-submit':
      if (processReactionData()) gotoNextTab('reaction-tab', 'medication-tab', 'medication');
      break;
    case 'medication-submit':
      if (processMedicationData()) gotoNextTab('medication-tab', 'outcome-tab', 'outcome');
      break;
    case 'outcome-submit':
      if (processOutcomeData()) gotoNextTab('outcome-tab', 'reporter-tab', 'reporter');
      break;
    case 'reporter-submit':
      if (processReporterData()) {
        document.getElementById('main-div').style.display = 'none';
        document.getElementById('success').style.display = 'block';
      }
      break;
  }
}

function processPatientData() {
  var flag = true;
  var initials = document.getElementById('initials').value;
  var age = document.getElementById('age').value;
  var gender = $("input[type='radio'][name='gender']:checked").val();
  var weight = document.getElementById('weight').value;
  if (initials == "") {
    makeToast('Initials is a required field!');
    flag = false;
  }
  else {
    initials = initials.toUpperCase();
  }
  if (age == "") {
    makeToast('Age is a required field!');
    flag = false;
  }
  if (gender == null) {
    makeToast('Gender is a required field!');
    flag = false;
  }
  if (weight <= 0) {
    makeToast('Weight is a required field!');
    flag = false;
  }
  if (flag == true) {
    setupRender();
    renderText(initials, 12, 66, 16, 1, 0);
    if (gender == 'male') renderBox(86.35, 58);
    else if (gender == 'female') renderBox(95.5, 58);
    renderText(age, 58, 66.5, 5, 1, 0);
    renderText(weight, 89, 69, 3, 1, 0);
  }
  return flag;
}

function processReactionData() {
  var flag = true;
  var chips = $('#reaction-description').material_chip('data');
  var startDate = $('#date-start').pickadate().pickadate('picker').get();
  var endDate = $('#date-end').pickadate().pickadate('picker').get();
  if (chips.length <= 0) {
    makeToast('Description is a required field!');
    flag = false;
  }
  else {
    var length = 0;
    for (var i = 0; i < chips.length; i++) {
      length = length + chips[i].tag.length;
    }
    if (length > 882) {
      makeToast('Description must be under 882 characters in length!');
      flag = false;
    }
  }
  if (startDate == "") {
    makeToast('Start date is a required field!');
    flag = false;
  }
  if (endDate == "") {
    makeToast('End date is a required field!');
    flag = false;
  }
  startDateCorrected = new Date(changeDateFormat(startDate)).getTime();
  endDateCorrected = new Date(changeDateFormat(endDate)).getTime();
  todaysDate = new Date(getTodaysDate()).getTime();
  if (startDateCorrected > todaysDate) {
    makeToast('Start date must be before or on the date today!');
    flag = false;
  }
  if (endDateCorrected > todaysDate) {
    makeToast('End date must be before or on the date today!');
    flag = false;
  }
  if (startDateCorrected > endDateCorrected) {
    makeToast('Start date must be before end date!');
    flag = false;
  }
  if (flag == true) {
    var description = "";
    for (var i = 0; i < chips.length - 1; i++) {
      description = description + chips[i].tag + ", ";
    }
    description = description + chips[i].tag;
    renderText(description, 12, 96, 42, 21, 3);
    renderText(startDate, 65, 83, 10, 1, 0);
    renderText(endDate, 65, 88, 10, 1, 0);
  }
  return flag;
}

function processMedicationData() {
  if (medicationCount > 0) return true;
  else {
    makeToast('Atleast 1 medication must be added!');
    return false;
  }
}

function processOutcomeData() {
  var flag = true;
  var concomitant = $('#concomitant').val();
  var test = $('#test').val();
  var history = $('#history').val();
  var serious = $("input[type='radio'][name='serious']:checked").val();
  if (serious == null) {
    makeToast('Seriousness of reaction is a required field!');
    flag = false;
  }
  var seriousSpec;
  if (serious == 'other') {
    seriousSpec = $('#serious-spec').val();
    if (seriousSpec == "") {
      makeToast('Specific other response is a required field!');
      flag = false;
    }
  }
  var seriousDateDeath;
  if (serious == 'death') {
    seriousDateDeath = $('#date-death').val();
    if (seriousDateDeath == "") {
      makeToast('Specific date of death is a required field!');
      flag = false;
    }
    else {
      seriousDateDeathCorrected = new Date(changeDateFormat(seriousDateDeath)).getTime();
      todaysDate = new Date(getTodaysDate()).getTime();
      if (seriousDateDeathCorrected > todaysDate) {
        makeToast('Date of death must be before or on the date today!');
        flag = false;
      }
    }
  }
  var outcome = $("input[type='radio'][name='outcome']:checked").val();
  if (outcome == null) {
    makeToast('Outcome of reaction is a required field!');
    flag = false;
  }
  var outcomeSpec;
  if (outcome == 'other') {
    outcomeSpec = $('#outcome-spec').val();
    if (outcomeSpec == "") {
      makeToast('Specific other response is a required field!');
      flag = false;
    }
  }
  if (flag == true) {
    renderText(concomitant, 12, 249.5, 42, 13, 3);
    renderText(test, 109, 58, 42, 7, 3);
    renderText(history, 109, 92.5, 42, 9, 3);
    switch (serious) {
      case 'death': renderBox(109.8, 124.3);
                    renderText(seriousDateDeath, 136, 126.5, 10, 1, 0);
                    break;
      case 'life': renderBox(109.8, 128.25);
                   break;
      case 'hospital': renderBox(109.8, 132.25);
                       break;
      case 'disability': renderBox(109.8, 139.75);
                         break;
      case 'congenital': renderBox(158.25, 124.3);
                         break;
      case 'intervention': renderBox(158.25, 128.25);
                           break;
      case 'other': renderBox(158.25, 139.75);
                    renderText(seriousSpec, 180.5, 141.25, 9, 1, 0);
                    break;
    }
    switch (outcome) {
      case 'fatal': renderBox(109.8, 149.5);
                    break;
      case 'recovering': renderBox(133.8, 149.5);
                         break;
      case 'unknown': renderBox(158.3, 149.5);
                      break;
      case 'continuing': renderBox(109.8, 153.35);
                         break;
      case 'recovered': renderBox(133.8, 153.35);
                        break;
      case 'other': renderBox(158.3, 153.35);
                    renderText(outcomeSpec, 180.5, 155.25, 9, 1, 0);
                    break;
    }
  }
  return flag;
}

function processReporterData() {
  var flag = true;
  var reporterName = $('#reporter-name').val();
  if (reporterName == "") {
    makeToast('Repoter name is a required field!');
    flag = false;
  }
  var address1 = $('#address1').val();
  if (address1 == "") {
    makeToast('Address line 1 is a required field!');
    flag = false;
  }
  var address2 = $('#address2').val();
  var pincode = $('#pincode').val();
  var pincodeRegex = /^[0-9]{6,6}$/;
  if (pincode == "") {
    makeToast('Pincode is a required field!');
    flag = false;
  }
  else if (!pincodeRegex.test(pincode)) {
    makeToast('Incorrect pincode');
    flag = false;
  }
  var email = $('#email').val();
  var emailRegex = /^([a-zA-Z0-9+_\-\.])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/;
  if (email == "") {
    makeToast('Email is a required field!');
    flag = false;
  }
  else if (!emailRegex.test(email)) {
    makeToast('Invalid email');
    flag = false;
  }
  var phone = $('#phone').val();
  var phoneRegex = /^[0-9-+]{8,15}$/;
  if (phone == "") {
    makeToast('Telephone number is a required field!');
    flag = false;
  }
  else if (!phoneRegex.test(phone)) {
    makeToast('Invalid telephone number');
    flag = false;
  }
  var speciality = $('#speciality').val();
  var occupation = $('#occupation').val();
  if (occupation == "") {
    makeToast('Occupation is a required field!');
    flag = false;
  }
  var dateReport = changeDateFormat(getTodaysDate());
  if (flag == true) {
    renderText(reporterName, 157, 246, 18, 1, 0);
    renderText(address1, 116, 250, 37, 1, 0);
    if (address2 != "") renderText(address2, 116, 254.5, 37, 1, 0);
    renderText(pincode, 132, 259, 6, 1, 0);
    renderText(email, 161.5, 257.5, 22, 2, 2, 8);
    renderText(phone, 160, 263.5, 15, 1, 0);
    if (speciality != "") renderText(speciality, 128, 268, 12, 2, 3.5);
    renderText(occupation, 109, 282, 20, 2, 3.5);
    renderText(dateReport, 164.5, 283.5, 10, 1, 0);
  }
  return flag;
}

function changeDateFormat(date) {
  s = date.split('/');
  if (s.length == 3) newDate = s[2] + "/" + s[1] + "/" + s[0];
  else newDate = "1970/01/01";
  return newDate;
}

function getTodaysDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  today = yyyy + '/' + mm + '/' + dd;
  return today;
}

function makeToast(msg) {
  Materialize.toast(msg, 4000, 'rounded');
}

function gotoNextTab(present, next, sel) {
  var presentTab = document.getElementById(present);
  var nextTab = document.getElementById(next);
  presentTab.classList.add('disabled');
  nextTab.classList.remove('disabled');
  setupTabs();
  $('ul.tabs').tabs('select_tab', sel);
  var x = $("header").position();
  window.scrollTo(x.left, x.top);
}

function enableSpecFieldOnRadio(radioId, fieldSelector, caseId) {
  $('input[type=radio][name=' + radioId + ']').on('change', function() {
    switch($(this).val()) {
      case caseId:
        $(fieldSelector).prop('disabled', false);
        break;
      default:
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
  var flag = true;
  var name = $('#medication-name').val();
  if (name == "") {
    makeToast('Medication name is a required field!');
    flag = false;
  }
  var manufacturer = $('#manufacturer').val();
  if (manufacturer == "") {
    makeToast('Manufacturer is a required field!');
    flag = false;
  }
  var batch = $('#batch').val();
  if (batch == "") {
    makeToast('Batch/lot number is a required field!');
    flag = false;
  }
  var expiry = $('#expiry').pickadate().pickadate('picker').get();
  var dose = $('#dose').val();
  if (dose == "") {
    makeToast('Dose is a required field!');
    flag = false;
  }
  var route = $("input[type='radio'][name='route']:checked").val();
  if (route == null) {
    makeToast('Route is a required field!');
    flag = false;
  }
  var frequency = $('#freq').val();
  if (frequency == null) {
    makeToast('Frequency is a required field!');
    flag = false;
  }
  var therapyStart = $('#therapy-start').pickadate().pickadate('picker').get();
  var therapyEnd = $('#therapy-end').pickadate().pickadate('picker').get();
  var therapyStartCorrected = new Date(changeDateFormat(therapyStart)).getTime();
  var therapyEndCorrected = new Date(changeDateFormat(therapyEnd)).getTime();
  var todaysDate = new Date(getTodaysDate()).getTime();
  if (therapyStart == "") {
    makeToast('Therapy start date is a required field!');
    flag = false;
  }
  if (therapyEnd == "") {
    makeToast('Therapy end date is a required field!');
    flag = false;
  }
  if (therapyStartCorrected > todaysDate) {
    makeToast('Therapy start date must be before or on the date today!');
    flag = false;
  }
  if (therapyEndCorrected > todaysDate) {
    makeToast('Therapy end date must be before or on the date today!');
    flag = false;
  }
  if (therapyStartCorrected > therapyEndCorrected) {
    makeToast('Therapy start date must be before therapy end date!');
    flag = false;
  }
  if (expiry != "") {
    var expiryCorrected = new Date(changeDateFormat(expiry)).getTime();
    if (therapyEndCorrected > expiryCorrected) {
      makeToast('Expiry must be after therapy end date!');
      flag = false;
    }
  }
  var duration;
  if (flag) duration = (therapyEndCorrected - therapyStartCorrected) / (1000 * 24 * 60 * 60);
  var reason = $('#reason').val();
  if (reason == "") {
    makeToast('Reason for use is a required field!');
    flag = false;
  }
  var stop = $("input[type='radio'][name='stop']:checked").val();
  if (stop == null) {
    makeToast('Reaction abated after drug stopped or dose reduced is a required field!');
    flag = false;
  }
  var stopReduced;
  if (stop == "yes") {
    stopReduced = $('#stop-reduced').val();
    if (stopReduced != "" && stopReduced > dose) {
      makeToast('Reduced dose must be less than original dose!');
      flag = false;
    }
  }
  //var reintro = $("input[type='radio'][name='reintro']:checked").val();
  //var reintroReduced = 0;
  //if (reintro == "yes")  reintroReduced = $('reintro-reduced').val();
  if (flag) {
    medicationCount = medicationCount + 1;
    switch (medicationCount) {
      case 1: renderText(name, 17, 181, 9, 2, 3);
              renderText(manufacturer, 39, 181, 6, 2, 3);
              renderText(batch, 54, 181, 6, 2, 3);
              if (expiry) renderText(expiry, 69, 181, 6, 2, 3);
              renderText(dose, 85, 181, 5, 1, 0);
              renderText('mg', 88, 184, 2, 1, 0);
              renderText(route, 97.25, 181, 5, 2, 3);
              renderText(frequency, 109.5, 181, 7, 2, 3);
              renderText(therapyStart, 129, 181, 6, 2, 3);
              renderText(therapyEnd, 149, 181, 6, 2, 3);
              renderText(reason, 167.5, 181, 15, 2, 3);
              switch (stop) {
                case 'yes': renderImage(tick, 'PNG', 31, 219.25, 4, 4);
                            if (stopReduced != "") renderText(stopReduced + ' mg', 91, 222.25, 8, 1, 0);
                            break;
                case 'no': renderImage(tick, 'PNG', 46, 219.25, 4, 4);
                           break;
                case 'unknown': renderImage(tick, 'PNG', 62, 219.25, 4, 4);
                                break;
                case 'na': renderImage(tick, 'PNG', 77, 219.25, 4, 4);
                           break;
              }
              break;
      case 2: renderText(name, 17, 190, 9, 2, 3);
              renderText(manufacturer, 39, 190, 6, 2, 3);
              renderText(batch, 54, 190, 6, 2, 3);
              if (expiry) renderText(expiry, 69, 190, 6, 2, 3);
              renderText(dose, 85, 190, 5, 1, 0);
              renderText('mg', 88, 193, 2, 1, 0);
              renderText(route, 97.25, 190, 5, 2, 3);
              renderText(frequency, 109.5, 190, 7, 2, 3);
              renderText(therapyStart, 129, 190, 6, 2, 3);
              renderText(therapyEnd, 149, 190, 6, 2, 3);
              renderText(reason, 167.5, 190, 15, 2, 3);
              switch (stop) {
                case 'yes': renderImage(tick, 'PNG', 31, 223.25, 4, 4);
                            if (stopReduced != "") renderText(stopReduced + ' mg', 91, 226.25, 8, 1, 0);
                            break;
                case 'no': renderImage(tick, 'PNG', 46, 223.25, 4, 4);
                           break;
                case 'unknown': renderImage(tick, 'PNG', 62, 223.25, 4, 4);
                                break;
                case 'na': renderImage(tick, 'PNG', 77, 223.25, 4, 4);
                           break;
              }
              break;
      case 3: renderText(name, 17, 198.5, 9, 2, 3);
              renderText(manufacturer, 39, 198.5, 6, 2, 3);
              renderText(batch, 54, 198.5, 6, 2, 3);
              if (expiry) renderText(expiry, 69, 198.5, 6, 2, 3);
              renderText(dose, 85, 198.5, 5, 1, 0);
              renderText('mg', 88, 201.5, 2, 1, 0);
              renderText(route, 97.25, 198.5, 5, 2, 3);
              renderText(frequency, 109.5, 198.5, 7, 2, 3);
              renderText(therapyStart, 129, 198.5, 6, 2, 3);
              renderText(therapyEnd, 149, 198.5, 6, 2, 3);
              renderText(reason, 167.5, 198.5, 15, 2, 3);
              switch (stop) {
                case 'yes': renderImage(tick, 'PNG', 31, 227.5, 4, 4);
                            if (stopReduced != "") renderText(stopReduced + ' mg', 91, 230.5, 8, 1, 0);
                            break;
                case 'no': renderImage(tick, 'PNG', 46, 227.5, 4, 4);
                           break;
                case 'unknown': renderImage(tick, 'PNG', 62, 227.5, 4, 4);
                                break;
                case 'na': renderImage(tick, 'PNG', 77, 227.5, 4, 4);
                           break;
              }
              break;
      case 4: renderText(name, 17, 206.75, 9, 2, 3);
              renderText(manufacturer, 39, 206.75, 6, 2, 3);
              renderText(batch, 54, 206.75, 6, 2, 3);
              if (expiry) renderText(expiry, 69, 206.75, 6, 2, 3);
              renderText(dose, 85, 206.75, 5, 1, 0);
              renderText('mg', 88, 209.75, 2, 1, 0);
              renderText(route, 97.25, 206.75, 5, 2, 3);
              renderText(frequency, 109.5, 206.75, 7, 2, 3);
              renderText(therapyStart, 129, 206.75, 6, 2, 3);
              renderText(therapyEnd, 149, 206.75, 6, 2, 3);
              renderText(reason, 167.5, 206.75, 15, 2, 3);
              switch (stop) {
                case 'yes': renderImage(tick, 'PNG', 31, 231.75, 4, 4);
                            if (stopReduced != "") renderText(stopReduced + ' mg', 91, 234.75, 8, 1, 0);
                            break;
                case 'no': renderImage(tick, 'PNG', 46, 231.75, 4, 4);
                           break;
                case 'unknown': renderImage(tick, 'PNG', 62, 231.75, 4, 4);
                                break;
                case 'na': renderImage(tick, 'PNG', 77, 231.75, 4, 4);
                           break;
              }
              break;
    }
    formReset();
    $('#medication-add').modal('close');
    makeToast('Medication added!', 4000, 'rounded');
    var divToAdd = "<div class='card blue lighten-4'><div class='card-content'><span class='card-title'>"+ name +"</span><p>"+ manufacturer + "</p></div></div>";
    $('#insert').before(divToAdd);
    if (medicationCount == 4) {
      makeToast("No more medications can be added!");
      document.getElementById('medication-add-button').disabled = true;
    }
  }
}

function formReset(){
  $('#medication-form').each(function(){
      this.reset();
  });
  $('#medication-add').scrollTop(0);
}

function chunkSubstr(str, size) {
  var numChunks = Math.ceil(str.length / size);
  var chunks = new Array(numChunks);
  for(var i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }
  return chunks;
}

var doc;
function setupRender() {
  doc = new jsPDF('p', 'mm', 'a4');
  renderImage(form, 'JPEG', 0, 0, 210, 297);
  doc.setFont("courier");
  doc.setFontSize(10);
}

function renderText(data, xCord, yCord, charLimit, lineLimit, lineSpacing, fontSize = 10) {
  var chunks = new Array();
  chunks = chunkSubstr(data, charLimit);
  if (fontSize != 10) doc.setFontSize(fontSize);
  for (var i = 0; i < chunks.length; i++) {
    doc.text(chunks[i], xCord, yCord + (i * lineSpacing));
  }
  if (fontSize != 10) doc.setFontSize(10);
}

function renderImage(img, format, xCord, yCord, xSize, ySize) {
  doc.addImage(img, format, xCord, yCord, xSize, ySize);
}

function renderLine(xStart, yStart, xEnd, yEnd) {
  doc.setDrawColor(255);
  doc.line(xStart, yStart, xEnd, yEnd);
}

function renderBox(xCord, yCord) {
  doc.rect(xCord, yCord, 2, 2, 'F');
}

function render() {
  doc.addPage('a4','p');
  renderImage(form2, 'JPEG', 0, 0, 210, 297);
  doc.save('final.pdf');
  window.onbeforeunload = null;
}
