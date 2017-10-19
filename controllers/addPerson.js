/**
 * Module dependencies.
 */
module.exports=function(app,cardMethods){

/*-----logic for different api----*/

  app.post('/addPerson',function(req,res){
    console.log(req.body);
    cardMethods.addPerson(req.query.cardId,req.body.personEmail,function(err,result){
      console.log(result);
    })
  })
}
