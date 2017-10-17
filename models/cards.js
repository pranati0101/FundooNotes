/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
/**
 * Schema definitions.
 */

var cardSchema = mongoose.Schema({
cardId:{
  type:String
},
userId:{
  type:String,
  required:true
},
title:{
  type:String,
  required:true
},
text:{
  type:String,
},
image:{
  data: Buffer,
  contentType: String,
  default:null
},
image:{
  type:String,
  default:null
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
    default:-1
  },
  month:{
    type:Number,
    default:-1
  },
  year:{
    type:Number,
    default:-1
  },
   hours:{
    type:Number,
    default:-1
  },
  minutes:{
    type:Number,
    default:-1
  },
  seconds:{
    type:Number,
    default:-1
  },
  status:{
    type:Boolean,
    default:false
  }
},
collaborator:{
  type:String,
  default:'none'
}
});

// create the model for users and expose it to our app
exports.Card = mongoose.model('Card', cardSchema,'cards');
