var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var app = express();
var UserInformation = require('./models/user');
// JWT config
var jwtSecret = 'gauravumn$5117';
const appID = ['5d9b6028','97891f13','0c5441e2','26ef40c6','64e55958'];
const appKey = ['701b6f3bbb36e4f938b70fbbd7ad13ff','51ded3cd6d0d2c7c6a01077dcd8f9cd3','2298c0264b21b8342857f481d0dfa575','f6c022890fc0c415e1805e255574601d','f7620e78560a911005d41e7ec24e8419'];
var currentRunningIndex=0;

var dbName = '5117umn';
mongoose.Promise = global.Promise;
var connectionString = 'mongodb://gaurav:gaurav@ds053080.mlab.com:53080/' + dbName;
mongoose.connect(connectionString);

var port = process.env.PORT || 3000;

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(port);

console.log("Server started.");

app.get('/getKey', function (req, res) {
    var idApp = appID[currentRunningIndex];
    var keyApp = appKey[currentRunningIndex];
    if(currentRunningIndex==4)
        currentRunningIndex = 0;
    else
        currentRunningIndex=currentRunningIndex+1;

    return res.send({appIdValue: idApp, appKeyValue:keyApp});
});

app.get('/login/:email/:password', function (req, res) {
 if(req.params.email=='item')
    return res.send({message: 'Invalid username or password'});
 UserInformation.findOne({email:req.params.email},function(err, results) {
   if (err) {
    return res.send({message: 'Invalid username or password'});
  }
  if(results && results.password==req.params.password) {
      var tokenUser = {"email":req.params.email,"password":req.params.password};
	    var token = jwt.sign(tokenUser, jwtSecret, {expiresIn : 60*60*24});
      return res.send({message: 'success', jwttoken: token});
    } else {
      return res.send({message: 'Invalid username or password'});
    }
  });
});

app.get('/allergy/:email', function (req, res) {
 if(req.params.email=='item')
    return res.send({message: 'Invalid username or password'});
 UserInformation.findOne({email:req.params.email},function(err, results) {
   if (err) {
    return res.send({message: 'Invalid username or password'});
  }
  if(results) {
      return res.send({message: 'success', allergy: results.allergy, firstName: results.firstname});
    } else {
      return res.send({message: 'Invalid username or password'});
    }
  });
});


app.get('/itemHistory/:email', function (req, res) {
 if(req.params.email=='item')
    return res.send({message: 'Invalid username or password'});
    UserInformation.findOne({email:'item'},function(err, itemResults) {
      if (err) {
       return res.send({message: 'Invalid username or password'});
     }
     UserInformation.findOne({email:req.params.email},function(err, results) {
       if (err) {
        return res.send({message: 'Invalid username or password'});
      }
      if(results) {
          // write logic of rating here
          var map = {};
          var dict = []; // create an empty array
          for(var i=0;i<itemResults.items.length;i++)
          {
                var itemRating = itemResults.items[i].people == 0 ? itemResults.items[i].rating : itemResults.items[i].rating/itemResults.items[i].people;
                dict.push({key:itemResults.items[i].itemId,value: Math.round(itemRating * 100) / 100});
                map[itemResults.items[i].itemId] = Math.round(itemRating * 100) / 100;
          }
          for(var i=0;i<results.itemHistory.length;i++)
          {
              console.log(results.itemHistory[i].itemId);
              /*if(dict['results.itemHistory[i].itemId'])
              {
                var tempRating = dict[results.itemHistory[i].itemId];
                console.log(tempRating);
                console.log(results.itemHistory[i].itemId);
                results.itemHistory[i].globalRating = dict[results.itemHistory[i].itemId];
              }
              else{
                console.log(dict);
              }*/
              if(map[results.itemHistory[i].itemId])
              {
                  results.itemHistory[i].globalRating = map[results.itemHistory[i].itemId];
              }
          }
          return res.send({message: 'success', itemHistory: results.itemHistory});
        } else {
          return res.send({message: 'Invalid username or password'});
        }
      });
    });
});


app.post('/signup', function (req, res) {
    // This is for dummy username which we will be using for item UpVotes and DownVotes
  if(req.body.email && req.body.email.trim()=='item')
       return res.send({message: 'Username already exists!!'});

  if((req.body.email && req.body.email.trim()) && (req.body.password && req.body.password.trim()) && (req.body.firstname && req.body.firstname.trim()) && (req.body.lastname && req.body.lastname.trim()))
  {
    var objectUser = {"email":req.body.email,"password":req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname};
    var result = new UserInformation(objectUser);
   UserInformation.findOne({email:req.body.email},function(err, results) {
     if (err) {
       return res.send(err);
     }
     if(results) {
       return res.send({message: 'Username already exists!!'});
     } else {
          result.save(function(err) {
            if (err)
            {
              return res.send({message: 'Invalid Email or password'});
            }
            return res.send({message: 'success'});
          });
    }
  });
    } else {
        return res.send({message: 'Invalid Fields ( fields cannot be empty!!)'});
    }
});


app.put('/allergy', function (req, res) {
    if((req.body.email && req.body.email.trim()) && (req.body.allergyName && req.body.allergyName.trim()) && (req.body.ingredient && req.body.ingredient.trim())) {
         var objectUser = {"allergyName":req.body.allergyName.trim(),"ingredient":req.body.ingredient.trim()};
         UserInformation.update({email:req.body.email,"allergy.allergyName":req.body.allergyName},{ "$set": {"allergy.$": objectUser } }, function(err, response) {
           if (err) {
             return res.send({message: 'error'});
           }
           else {
              if(response.nModified==0 && response.n==0)
              {
                      UserInformation.update({email:req.body.email},{ $addToSet: {'allergy': objectUser } }, function(err, results) {
                       if (err) {
                         return res.send({message: 'error'});
                       }
                       else {
                          return res.send({message : 'success'});
                      }
                    });
              }
              else
                  return res.send({message : 'success'});
          }
        });
        }
        else
        {
              return res.send({message: 'Fields Cannot be Empty'});
        }
});

app.put('/itemHistory', function (req, res) {
      if(req.body.email && req.body.email=='item')
          return res.send({message: 'Invalid Email'});
      if((req.body.email && req.body.email.trim()) && (req.body.itemId && req.body.itemId.trim()) && (req.body.itemName && req.body.itemName.trim()) && (req.body.itemBrand && req.body.itemBrand.trim()))
      {
          UserInformation.findOne({$and:[{email:req.body.email,"itemHistory.itemId":req.body.itemId}]},function(err, results1) {
           if (err) {
            return res.send({message: 'Invalid username or password'});
          }
          if(results1==null) {
             var objectUser = {"itemId":req.body.itemId.trim(),"ingredient":req.body.ingredient.trim(),"itemBrand":req.body.itemBrand.trim(),"itemName":req.body.itemName.trim(),"rating":0,"globalRating":0};
             UserInformation.update({email:req.body.email,"itemHistory.itemId":req.body.itemId},{ "$set": {"itemHistory.$": objectUser } }, function(err, response) {
               if (err) {
                 return res.send({message: 'error'});
               }
               else
               {
                  if(response.nModified==0 && response.n==0)
                  {
                          UserInformation.update({email:req.body.email},{ $addToSet: {'itemHistory': objectUser } }, function(err, results) {
                             if (err) {
                               return res.send({message: 'error'});
                             }
                             else {
                                return res.send({message : 'success'});
                            }
                          });
                  }
                  else
                      return res.send({message : 'success'});
                }
            });
            }
            else{
              return res.send({message:'success',moreDetail:'Item was already there'});
            }
            });
        }
        else
        {
                  return res.send({message: 'Fields Cannot be Empty'});
        }

});

/*app.put('/upvotes', function (req, res) {
  if((req.body.itemName && req.body.itemName.trim())&& (req.body.itemId && req.body.itemId.trim()) && (req.body.itemBarCode && req.body.itemBarCode.trim())) {
       var objectUser = {"itemName":req.body.itemName.trim(),"itemBarCode":req.body.itemBarCode.trim(),"itemId":req.body.itemId,"upvotes":1};
       UserInformation.update({email:'item',"items.itemName":req.body.itemName},{ "$inc": {"items.$.upvotes": 1 } }, function(err, response) {
         if (err) {
           return res.send({message: 'error'});
         }
         else {
            if(response.nModified==0 && response.n==0)
            {
                    UserInformation.update({email:'item'},{ $addToSet: {'items': objectUser } }, function(err, results) {
                     if (err) {
                       return res.send({message: 'error'});
                     }
                     else {
                        return res.send({message : 'success'});
                    }
                  });
            }
            else
                return res.send({message : 'success'});
        }
      });
      }
      else
      {
            return res.send({message: 'Item cannot be empty'});
      }
}); */

//Depricated
/*app.put('/ratings', function (req, res) {
  if((req.body.itemName && req.body.itemName.trim())&& (req.body.itemId && req.body.itemId.trim()) && (req.body.rating && req.body.rating.trim())) {
       var objectUser = {"itemName":req.body.itemName.trim(),"rating":parseInt(req.body.rating.trim()),"itemId":req.body.itemId,"people":1};
       UserInformation.update({email:'item',"items.itemId":req.body.itemId},{ "$inc": {"items.$.rating": parseInt(req.body.rating.trim()), "items.$.people": 1} }, function(err, response) {
         if (err) {
           return res.send({message: 'error'});
         }
         else {
            if(response.nModified==0 && response.n==0)
            {
                    UserInformation.update({email:'item'},{ $addToSet: {'items': objectUser } }, function(err, results) {
                     if (err) {
                       return res.send({message: 'error'});
                     }
                     else {
                        return res.send({message : 'success'});
                    }
                  });
            }
            else
                return res.send({message : 'success'});
        }
      });
      }
      else
      {
            return res.send({message: 'Item cannot be empty'});
      }
});
*/

app.put('/ratings', function (req, res) {
  if((req.body.itemId && req.body.itemId.trim()) && (req.body.rating && req.body.rating.trim())) {
       var objectUser = {"rating":parseInt(req.body.rating.trim()),"itemId":req.body.itemId,"people":1};
       UserInformation.update({email:req.body.email,"itemHistory.itemId":req.body.itemId},{ "$set": {"itemHistory.$.rating": parseInt(req.body.rating.trim())} }, function(err, response1) {
         if (err) {
           return res.send({message: 'error'});
         }
         else {
             UserInformation.update({email:'item',"items.itemId":req.body.itemId},{ "$inc": {"items.$.rating": parseInt(req.body.rating.trim()), "items.$.people": 1} }, function(err, response) {
               if (err) {
                 return res.send({message: 'error'});
               }
               else {
                  if(response.nModified==0 && response.n==0)
                  {
                          UserInformation.update({email:'item'},{ $addToSet: {'items': objectUser } }, function(err, results) {
                           if (err) {
                             return res.send({message: 'error'});
                           }
                           else {
                              return res.send({message : 'success'});
                          }
                        });
                  }
                  else
                      return res.send({message : 'success'});
              }
            });
        }
       });
      }
      else
      {
            return res.send({message: 'Item cannot be empty'});
      }
});
/*app.put('/downvotes', function (req, res) {
    if((req.body.itemName && req.body.itemName.trim()) && (req.body.itemId && req.body.itemId.trim()) && (req.body.itemBarCode && req.body.itemBarCode.trim())) {
        var objectUser = {"itemName":req.body.itemName.trim(),"itemBarCode":req.body.itemBarCode.trim(),"itemId": req.body.itemId, "downvotes":1};
         UserInformation.update({email:'item',"items.itemName":req.body.itemName},{ "$inc": {"items.$.downvotes": 1 } }, function(err, response) {
           if (err) {
             return res.send({message: 'error'});
           }
           else {
              if(response.nModified==0 && response.n==0)
              {
                      UserInformation.update({email:'item'},{ $addToSet: {'items': objectUser } }, function(err, results) {
                       if (err) {
                         return res.send({message: 'error'});
                       }
                       else {
                          return res.send({message : 'success'});
                      }
                    });
              }
              else
                  return res.send({message : 'success'});
          }
        });
        }
        else
        {
              return res.send({message: 'Item cannot be empty'});
        }
});
*/
app.delete('/allergy', function (req, res) {
    if((req.body.allergyName && req.body.allergyName.trim()) && (req.body.email && req.body.email.trim())) {
         UserInformation.update({email:req.body.email},{ $pull: {'allergy': {'allergyName':req.body.allergyName}}}, { multi: true }, function(err, results) {
           if (err) {
             return res.send({message: 'error'});
           }
           else {
              return res.send({message : 'success'});
          }
        });
        }
        else
        {
              return res.send({message: 'Fields Cannot be Empty'});
        }
});
