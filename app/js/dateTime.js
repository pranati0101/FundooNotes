//initializing date and time picker
    $(document).ready(function(){
  //       $('#timepicker').datetimepicker();
  //       $.fn.datetimepicker.defaults={
  //           pickDate: true, // disables the date picker
  //           pickTime: false, // disables de time picker
  //           // pick12HourFormat: true, // enables the 12-hour format time picker
  //           // pickSeconds: true, // disables seconds in the time picker
  //           startDate: -Infinity, // set a minimum date
  //           endDate: Infinity, // set a maximum date
  //           format: 'DD/MM/YYYY',
  //           locale: 'en'
  // }
  $('.timepicker').timepicker();
  $('.datepicker').datepicker();
  //       $('#timepicker').datetimepicker({
  //           pickDate: false, // disables the date picker
  //           pickTime: true, // disables the time picker
  //           pick12HourFormat: false, // enables the 12-hour format time picker
  //           pickSeconds: true, // disables seconds in the time picker
  //           startDate: -Infinity, // set a minimum date
  //           endDate: Infinity, // set a maximum date
  //           format: 'hh:mm:ss',
  //           locale: 'en'
  // });
  $('[data-toggle="popover"]').popover({
    html:true
  });
})
