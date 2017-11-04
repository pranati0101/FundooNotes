module.exports=function(app,express,validator){
  /**
   * declaring modules
   */
var noteroute=express.Router();
var NoteController=require('../Controllers/noteController')
/**
 * redirecting different routes to required modules
 */
 noteroute.post('/createCard',NoteController.createCard)
 noteroute.post('/updateCard',NoteController.updateCard)
 noteroute.get('/deleteCard',NoteController.deleteCard)
 noteroute.post('/addImage',NoteController.addImage)
 noteroute.get('/removeURL',NoteController.removeURL)
 noteroute.get('/changeColor',NoteController.changeColor)
 noteroute.get('/showArchive',NoteController.showArchive)
 noteroute.get('/moveToArchive',NoteController.moveToArchive)
 noteroute.get('/unarchive',NoteController.unarchive)
 noteroute.get('/showReminder',NoteController.showReminder)
 noteroute.get('/pin',NoteController.pin)
 noteroute.post('/addPerson',NoteController.addPerson)
 noteroute.get('/removeMyself',NoteController.removeMyself)
 noteroute.get('/removeCollaborator',NoteController.removeCollaborator)
 noteroute.get('/showTrash',NoteController.showTrash)
 noteroute.get('/moveToTrash',NoteController.moveToTrash)
 noteroute.get('/restoreCard',NoteController.restoreCard)
 noteroute.post('/setReminder',NoteController.setReminder)
 noteroute.post('/resetReminder',NoteController.resetReminder)
 noteroute.get('/cancelReminder',NoteController.cancelReminder)
 noteroute.post('/search',NoteController.search)
 noteroute.get('/autocomplete',NoteController.autocomplete)
 noteroute.get('/getUserInfo',NoteController.getUserInfo)
 noteroute.post('/addLabel',NoteController.addLabel)
 return noteroute;
}
