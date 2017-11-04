/**
 * declaring modules
 */
var schedule = require('node-schedule');
const notifier = require('node-notifier')
var cardMethods = require('../Models/noteModel.js')
/**
 * function to set reminder using scheduler and notifier
 * @param  {String}   data    contains date and time
 */
exports.setReminder = function(data) {
  //converting in date dataType
  var date = new Date(2017, 9, 16, 12, 19, 00);
  var reminderJob = new schedule.scheduleJob(data.cardId, date, function() {
    task(data.cardId, data.title)
  })
}

/**
 * function to reschedule reminder using scheduler and notifier
 * @param  {string}   data    contains date and time
 */
exports.resetReminder = function(data) {
  var date = new Date(parseInt(data.year), (data.month), (data.date), (data.hours), (data.minutes), (data.seconds));
  schedule.rescheduleJob(data.cardId, date);
}

/**
 * function to cancel reminder using scheduler and notifier
 * @param  {[type]}   data    contains date and time
 */
exports.cancelReminder = function(data, callback) {
  schedule.cancelJob(data.cardId);
}

//task to be executed
function task(cardId, title) {
  notifier.notify({
    title: 'Reminder',
    message: title,
    wait: true // Wait with callback, until user action is taken against notification
  })
  var value = {
    date: -1,
    month: -1,
    year: -1,
    hours: -1,
    minutes: -1,
    seconds: -1
  }
  cardMethods.setReminder(value, cardId, function(err, res) {
    if (err) console.log(err);
    else console.log("done");
  })
}
