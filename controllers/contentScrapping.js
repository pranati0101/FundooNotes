/**
 * Module dependencies.
 */
 var urlMetadata=require('url-metadata')

 module.exports=function(text){

   return new Promise(function(resolve,reject){

     if(text!=null)
     {
       if(!/^(?:f|ht)tps?\:\/\//.test(text)){
         purl="http://"+text;
         console.log(purl);
       }
       else purl=text;

       urlMetadata(purl).then(function(metadata) {
         var values={
           title:metadata.title,
           baseurl:metadata.source,
           description:metadata.description,
           image:metadata.image
         }
         resolve(values)
       },function(error){
         reject(error);
       })
     }
     else{
       resolve(null);
     }
   })
 }
