var request = require('request');
var cheerio = require('cheerio');

request('https://www.nitjsr.ac.in', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    // $('span.comhead').each(function(i, element){
      // var a = $(this).prev();
      // var rank = a.parent().parent().text();
      var title = $('title');
      var favicon=$('favicon.ico')
      // var url = a.attr('href');
      // var subtext = a.parent().parent().next().children('.subtext').children();
      // var points = $(subtext).eq(0).text();
      // var username = $(subtext).eq(1).text();
      // var comments = $(subtext).eq(2).text();
      // // Our parsed meta data object
      // var metadata = {
      //   rank: parseInt(rank),
      //   title: title,
      //   url: url,
      //   points: parseInt(points),
      //   username: username,
      //   comments: parseInt(comments)
      // };
      console.log(typeof(title));
      console.log(title.text());
      console.log((favicon));
    // });
  }
});
