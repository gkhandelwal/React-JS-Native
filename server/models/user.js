var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var itemSchema = new Schema({
    itemName: String,
    itemId: String,
    itemBarCode: String,
    rating: Number,
    people: Number
},{ _id : false });

var itemHistory = new Schema({
    itemName: String,
    itemId: String,
    ingredient: String,
    itemBrand: String,
    rating: Number,
    globalRating:Number,
    people: Number
},{ _id : false });

var allergySchema = new Schema({
    allergyName: String,
    ingredient: String
},{ _id : false });

var userSchema = new Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  allergy: [allergySchema],
  items: [itemSchema],
  itemHistory: [itemHistory]
});

module.exports = mongoose.model('users', userSchema);
