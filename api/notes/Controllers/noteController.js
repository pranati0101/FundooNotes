/**
 * declaring modules
 */
var validator = require('node-validator')
var NoteServices = require('../Services/noteServices').NoteServices;
var noteServices = new NoteServices();
noteServices.init()
var checkUrl = validator.isString({
  regex: /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
})
var checkEmail = validator.isString({
  regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
})
/**
 *creating a new note
 */
exports.createCard = function(req, res) {
  if (validator.isString(req.body.title) && validator.isString(req.body.text) &&
    validator.isObject(req.user._id)) {
    noteServices.createCard(req.body, req.user._id, function(err, card) {
      if (err) console.error();
      else {
        res.redirect('/profile')
      }
    })
  }
}
/**
 * updating existing note
 */
exports.updateCard = function(req, res) {
  if ((validator.isObject(req.body)) && (validator.isString(req.query.cardId))) {
    noteServices.updateCard(req.body, req.query.cardId, function(err, card) {
      if (err) console.error();
      else {
        res.redirect('/profile')
      }
    })
  }
}
/**
 * adding image to note
 */
exports.addImage = function(req, res) {
  if (validator.isObject(req)) {
    noteServices.addImage(req, res, function(err) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * removing url
 */
exports.removeURL = function(req, res) {
  validator.run(checkUrl, req.query.url, function(errCount, err) {
    if (errCount == 0) {
      noteServices.removeURL(req.query.cardId, req.query.url, function(err) {
        if (err) console.log(err);
        else {
          res.redirect('/profile')
        }
      })
    }
  })
}
/**
 * deleting note from db
 */
exports.deleteCard = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.deleteCard(req.query.cardId, function(err, card) {
      if (err) console.error();
      else res.redirect('/profile');
    })
  }
}
/**
 * changing color of note
 */
exports.changeColor = function(req, res) {
  if (validator.isString(req.query.cardId) && validator.isString(req.query.color)) {
    noteServices.changeColor(req.query.cardId, req.query.color, function(err, resp) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * showing archive folder
 */
exports.showArchive = function(req, res) {
  if (validator.isString(req.user.userId)) {
    noteServices.getArchived(req.user.userId, function(err, archiveList) {
      if (err) console.log(err);
      else {
        res.render('archive.pug', {
          archived: archiveList,
          user: req.user
        })
      }
    })
  }
}
/**
 * showing reminder folder
 */
exports.showReminder = function(req, res) {
  if (validator.isString(req.user.userId)) {
    noteServices.getReminder(req.user.userId, function(err, reminderList) {
      if (err) console.log(err);
      else {
        res.render('reminder.pug', {
          reminderList: reminderList,
          user: req.user
        })
      }
    })
  }
}
/**
 * send note to archive
 */
exports.moveToArchive = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.moveToArchive(req.query.cardId, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * unarchive notes
 */
exports.unarchive = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.unarchive(req.query.cardId, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/showArchive')
    })
  }
}
/**
 *pin and unpin notes
 */
exports.pin = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.pinned(req.query.cardId, function(err, response) {
      if (err) console.log(err);
      else if (response == 'done') res.redirect('/profile');
      else res.send('404')
    })
  }
}
/**
 *add collaborators
 */
exports.addPerson = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    validator.run(checkEmail, req.body.personEmail, function(errCount, err) {
      noteServices.addPerson(req.query.cardId, req.body.personEmail, function(err, result) {
        if (err) console.log(err);
        res.redirect('/profile')
      })
    })
  }
}
/**
 *remove user from a shared note
 */
exports.removeMyself = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    validator.run(checkEmail, req.user.local.email, function(errCount, err) {
      noteServices.removeCollaborator(req.query.cardId, req.user.local.email, function(err, result) {
        if (err) console.log(err);
        else res.redirect('/profile')
      })
    })
  }
}
/**
 * remove a collaborator from shared note
 */
exports.removeCollaborator = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    validator.run(checkEmail, req.query.email, function(errCount, err) {
      noteServices.removeCollaborator(req.query.cardId, req.query.mail, function(err, result) {
        if (err) console.log(err);
        res.redirect('/profile')
      })
    })
  }
}
/**
 * cards in trash are fetched and sent to front end
 */
exports.showTrash = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    validator.run(checkEmail, req.user.local.email, function(errCount, err) {
      noteServices.showTrash(req.user.userId, req.user.local.email, function(err, trashList) {
        if (err) console.log(err);
        else {
          res.render('trash.pug', {
            trash: trashList,
            user: req.user
          })
        }
      })
    })
  }
}
/**
 * cards in trash are fetched and sent to front end
 */
exports.moveToTrash = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.moveToTrash(req.query.cardId, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * cards in trash are fetched and sent to front end
 */
exports.restoreCard = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.restoreCard(req.query.cardId, function(err, card) {
      if (err) console.log(err);
      else {
        res.redirect('/showTrash');
      }
    })
  }
}
/**
 * setting reminders
 */
exports.setReminder = function(req, res) {
  if (validator.isString(req.body.date) && validator.isString(req.body.month) &&
    validator.isString(req.body.year) && validator.isString(req.body.hours) &&
    validator.isString(req.body.minutes) && validator.isString(req.body.seconds)) {
    noteServices.setReminder(req.body, function(err, response) {
      if (err) console.log(err);
      res.send('200')
      // else res.redirect('/profile')
    })
  }
}
/**
 * resetting reminders
 */
exports.resetReminder = function(req, res) {
  if (validator.isString(req.body.date) && validator.isString(req.body.month) &&
    validator.isString(req.body.year) && validator.isString(req.body.hours) &&
    validator.isString(req.body.minutes) && validator.isString(req.body.seconds)) {
    noteServices.resetReminder(req.body, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * cancel reminders
 */
exports.cancelReminder = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.cancelReminder(req.query.cardId, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
/**
 * return searched values using elastic search
 */
exports.search = function(req, res) {
  if (validator.isString(req.query.term) && validator.isString(req.user.userId)) {
    noteServices.search(req.body.text, req.user.userId, function(err, response) {
      if (err) console.log(err);
      res.render('search.pug', {
        user: req.user,
        data: response
      })
    })
  }
}
/**
 * autocomplete api using elastic search
 */
exports.autocomplete = function(req, res) {
  if (validator.isString(req.query.term) && validator.isString(req.user.userId)) {
    noteServices.autocomplete(req.query.term, req.user.userId, function(results) {
      res.send(results)
      console.log("results", results);
    })
  }
}
/**
 * get user information from user id
 */
exports.getUserInfo = function(req, res) {
  if (validator.isString(req.query.id)) {
    noteServices.getUserInfo(req.query.id, function(err, results) {
      if (err) console.log(err);
      res.send(results)
      console.log("results", results);
    })
  }
}
/**
 * add label
 */
exports.addLabel = function(req, res) {
  if (validator.isString(req.query.cardId)) {
    noteServices.addLabel(req.query.cardId, req.body.label, function(err, response) {
      if (err) console.log(err);
      else res.redirect('/profile')
    })
  }
}
