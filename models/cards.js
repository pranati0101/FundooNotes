/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
/**
 * Schema definitions.
 */

var cardSchema = mongoose.Schema({
cardId:{
  type:Object
},
userId:{
  type:Object,
  required:true
},
title:{
  type:String,
  required:true
},
text:{
  type:String,
},
color:{
  type:String,
  default:"white"
},
pinned:{
  type:Boolean,
  default:false
},
archived:{
  type:Boolean,
  default:false
},
trash:{
  type:Date,
  default:null
},
createdOn:{
  type:Date,
  default:Date.now()
},
lastModified:{
  type:Date,
  default:null
},
reminder:{
  date:{
    type:Number,
    default:null
  },
  month:{
    type:Number,
    default:null
  },
  year:{
    type:Number,
    default:null
  },
   hours:{
    type:Number,
    default:null
  },
  minutes:{
    type:Number,
    default:null
  },
  seconds:{
    type:Number,
    default:null
  }
},
collaborator:{
  type:String
}
});

// create the model for users and expose it to our app
exports.Card = mongoose.model('Card', cardSchema,'cards');
