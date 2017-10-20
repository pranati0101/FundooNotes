/**
 * Module dependencies.
 */
// var fs=require('fs')
var elasticsearch=require('./elasticSearch');

module.exports = function(app,cardMethods) {

app.post("/search",function(req,res){
  console.log(req.body);
  var index=0;
  var data=[];
  elasticsearch.search(req.body.text,req.user.userId,function(err,results){
      if(err) console.log(err);
      if(results==null || results.hits==null || results.hits.total==0) {
        res.render('search.pug',{user:req.user,data:data})
      }
      else{
        for(i=0;i<results.hits.total;i++){
        console.log(++index,results.hits.hits[i]._source);
        data.push(results.hits.hits[i]._source)
      }
      console.log("data-->",data);
      res.render('search.pug',{user:req.user,data:data})
      }
  });
})

app.get("/autocomplete",function(req,res){
  console.log("auto-->",req.query.term);
  elasticsearch.autocomplete(req.query.term,req.user.userId,function(results){
    res.send(results)
    console.log("results",results);
  })
})
}
