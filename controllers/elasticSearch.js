/**
 * Module dependencies.
 */
var fs = require('fs')
var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
/*
* function to check whether index exists or not
*/
indexExists=function(indexName) {
    // return esClient.indices.exists({index:indexName});
    return new Promise(function(resolve,reject){
      esClient.indices.exists({
        index:indexName
      },function(err,exists){
        if(err) console.log(err);
        if(exists)   resolve(true);
        else reject(false);
      });
    });
}
/*
* function to create index
*/
createIndex=function(indexName,typeName){
  return new Promise(function(resolve,reject){
    if(typeName=="cards"){
      esClient.indices.create({
        index:indexName,
        type:typeName,
        id:1,
        body:{
          "settings": {
            "analysis": {
              "analyzer": {
                "indexing_analyzer": {
                  "tokenizer": "whitespace",
                  "filter": ["lowercase", "edge_ngram_filter"]
                },
                "search_analyze": {
                  "tokenizer": "whitespace",
                  "filter": "lowercase"
                }
              },
              "filter": {
                "edge_ngram_filter": {
                  "type": "edge_ngram",
                  "min_gram": 1,
                  "max_gram": 10
                }
              }
            }
          }
        },
    "mappings": {
       "cards": {
         "properties": {
           "title": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           },
           "text": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           },
           "color": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           },
           "collaborator": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           },
           "image": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           }
         }
       }
     }
      },function(err,resp){
        if(err){
          console.log(err);
        }

          console.log(resp);
          resolve("success");

        reject(err);
      });
    }
    else{
      esClient.indices.create({
        index:indexName,
        type:typeName,
        id:1,
        body:{
          "settings": {
            "analysis": {
              "analyzer": {
                "indexing_analyzer": {
                  "tokenizer": "whitespace",
                  "filter": ["lowercase", "edge_ngram_filter"]
                },
                "search_analyze": {
                  "tokenizer": "whitespace",
                  "filter": "lowercase"
                }
              },
              "filter": {
                "edge_ngram_filter": {
                  "type": "edge_ngram",
                  "min_gram": 1,
                  "max_gram": 10
                }
              }
            }
          }
        },
    "mappings": {
       "mails": {
         "properties": {
           "mailIds": {
             "type": "string",
             "fields": {
               "autocomplete": {
                 "type": "string",
                 "index_analyzer": "autocomplete"
               }
             }
           }
         }
       }
     }
      },function(err,resp){
        if(err){
          console.log(err);
        }

          console.log(resp);
          resolve("success");

        reject(err);
      });
    }
  });
}
/*
* function to initialize index
*/
initIndex=function(indexName,typeName,cards,emailids) {
return new Promise(function(resolve, reject) {
    console.log("creating index");
    if(typeName=="cards"){
      createIndex(indexName,typeName).then(function(res){
        for(i=0;i<cards.length;i++){
          values={
            title:cards[i].title,
            text:cards[i].text,
            color:cards[i].color,
            collaborator:cards[i].collaborator,
            cardId:cards[i].cardId,
            pinned:cards[i].pinned,
            image:cards[i].image
          }
            console.log("adding doc");
            esClient.index({
                index: indexName,
                type: typeName,
                body:values
            })
            resolve("success");

  }
  }).catch(function(e){
    reject(e);
  });
    }
else{
  createIndex(indexName,typeName).then(function(res){
    for(i=0;i<emailids.length;i++){
        console.log("adding doc");
        esClient.index({
            index: indexName,
            type: typeName,
            body:emailids[i]
        })
        resolve("success");

}
}).catch(function(e){
reject(e);
});
}
});
}


exports.initElasticSearchIndex=function(indexName,typeName,cards,emailids){
  // console.log("exists...",esClient.exists({index:indexName}));
  indexExists(indexName).then(function(){
    esClient.indices.delete({index:indexName}).then(function(){
      initIndex(indexName,typeName,cards,emailids).then(console.log("index created")).catch(console.trace);
    }).catch(console.trace);
  }).catch(function(e){
    console.log(e);
    initIndex(indexName,typeName,cards,emailids).then(console.log).catch(console.trace);
  })
}

exports.autocomplete=function (text,indexName,typeName,callback) {
console.log("es func");
console.log(typeof(indexName));
    esClient.search({
        index: indexName,
        type: typeName,
        body: {
          query: {
            multi_match:{
                query:text,
                fields:['title','text','color','collaborator'],
                minimum_should_match: 1,
                fuzziness:2
            }
          }
        }
    }).then(function (res) {
        var results = res.hits.hits.map(function(hit){
          // console.log(hit);
          // console.log("hit source : "+JSON.stringify(hit._source));
            return hit._source.title;
        });
      callback(results);
    }).catch(function (err) {
        console.log(err);
      });
}
/*
* function to search
*/
exports.search=function(text,userId,callback){

var body = {
size: 5,
from: 0,
query: {
  multi_match:{
      query:text,
      fields:['title','text', 'color', 'collaborator'],
      minimum_should_match: 1,
      fuzziness:2
  }
},
suggest: {
text: text,
simple_phrase: {
    phrase: {
        field: "text",
        size: 1,
        real_word_error_likelihood: 1,
        max_errors: 0.5,
        gram_size: 1,
        direct_generator: [{
            field: "text",
            suggest_mode: "always",
            min_word_length: 1
        }],
        "highlight": {
            "pre_tag": "<b><em>",
            "post_tag": "</em></b>"
        }
    }
}
}
};
esClient.search({
  index:userId,
  body:body
},function(err,results){
    if(err) callback(err,null);
    else callback(null,results)
    console.log(results);
})
}


//
// /*
// * function to check whether index exists or not
// */
// exports.initElasticSearchIndex=function(userId,cards){
//
//   indexExists(userId, function(status) {
//     if (status) {
//       console.log("deleting old index");
//       esClient.indices.delete({
//         index: userId
//       })
//       console.log("creating new index");
//       esClient.indices.create({
//         index: userId
//       })
//       for (i in cards){
//         values={
//           title:cards[i].title,
//           text:cards[i].text,
//           color:cards[i].color,
//           collaborator:cards[i].collaborator,
//           cardId:cards[i].cardId,
//           pinned:cards[i].pinned,
//           image:cards[i].image
//         }
//         addDocument(userId,values)
//       }
//     }
//     else{
//       console.log("creating new index");
//       esClient.indices.create({
//         index: userId
//       },function(err){
//         if(err) console.log(err);
//         for (i in cards){
//           values={
//             title:cards[i].title,
//             text:cards[i].text,
//             color:cards[i].color,
//             collaborator:cards[i].collaborator,
//             cardId:cards[i].cardId,
//             pinned:cards[i].pinned,
//             image:cards[i].image
//           }
//           addDocument(userId,values)
//         }
//       })
//     }
//   })
// }
// /*
// * function to check whether index exists or not
// */
// function indexExists(indexName, callback) {
//   esClient.indices.exists({
//     index: indexName
//   }, function(err, res) {
//     if (err) console.log("error--", err);
//     console.log("status--", res);
//     callback(res);
//   });
// }
// /*
// * function to add new entry in index to make it available for search
// */
// function addDocument(indexName, document) {
//    esClient.index({
//     index: indexName,
//     type: "info",
//     body: document,
//     refresh:true
//   },function(err,res){
//     if(err) console.log(err);
//     console.log(res);
//   });
// }
