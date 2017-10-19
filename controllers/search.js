/**
 * Module dependencies.
 */
// var fs=require('fs')
var elasticsearch=require('elasticsearch');
var esClient=new elasticsearch.Client({
  host:'127.0.0.1:9200',
  log:'error'
});

module.exports = function(app,cardMethods) {

app.post("/search",function(req,res){
  console.log(req.body);
  var body = {
    size: 20,
    from: 0,
    query: {
      multi_match:{
          query:req.body.text,
          fields:['title','text', 'color', 'collaborator'],
          minimum_should_match: 1,
          fuzziness:3
      }
    }
  };
  var index=0;
  var data=[];
  esClient.search({
    index:req.user.userId,
    body:body
  },function(err,results){
      if(err) console.log(err);
      console.log(results.hits.hits);
      if(results.hits.total>0){
          // results.hits.hits.forEach(function(hit){
          for(i in results.hits.hits){
          console.log(++index,results.hits.hits[i]._source);
          data.push(results.hits.hits[i]._source)
          // cardMethods.getCardById(results.hits.hits[i]._source.cardId).then(function(card){
          //     data.push(card);
          //     }).catch(function(error){
          //     console.trace("first catch",error);
          //     });
        }
        console.log("data-->",data);
        res.render('search.pug',{user:req.user,data:data})
        // console.log(index,data);
      }
      // else   res.render('search.pug',{user:req.user,data:[]})
  });

})

}
