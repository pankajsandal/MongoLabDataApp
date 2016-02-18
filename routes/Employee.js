var mongo = require("mongodb").MongoClient;
var connString = require("../routes/ConnectionFile").connectionString;
var express = require('express');
var employeeRouter = express.Router();
var bodyParser = require('body-parser');


employeeRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

employeeRouter.get('/',function(req,res)
{ 
   mongo.connect(connString,function(dbErr,db) {
       if(dbErr)
       {
           res.send('connection error with db : '+dbErr);
       }
       else
       {
           db.collection("Users").find().toArray(function (tbErr,data) {
           if(tbErr)   
           {
                res.send('Can not connect to table Employee : '+tbErr);
           }
           else
           {
              data.forEach(function(element) {
              res.send(element);  
           }, this);    
          }          
        });
       }
   });
});
      

employeeRouter.get('/:name',function(req,res)
{      
   var datacome = req.param("name");
   
   mongo.connect(connString,function(dbErr,db) {
       if(dbErr)
       {
           res.send('Connection Error with DB : '+dbErr);
       }
       else
       {
           db.collection("Users").findOne({"name":datacome},function(tbErr,data)
            {
            if(tbErr)
            {
                res.send("cannot connect to single call : "+tbErr);
            }
            else
            {
                res.send(data);
            }  
        });
        
        }
    });
});
  
    
    

employeeRouter.post('/Insert/:name/:Dept/:Role',function(req,res)
{
    var name = req.params.name;
    var Dept = req.params.Dept;
    var role = req.params.Role;
    
    mongo.connect(connString,function(dbErr,db){
       if(dbErr)
       {
           res.send('Connection failed : '+dbErr);
       } 
       else
       {
           db.collection("Users").insert({"name":name,"Dept":Dept,"Role":role},function(err,result)
         {
        if(err)
        {
           res.send("error while inserting : "+err);
        }
        else
        {
            res.send("insert successful : "+result);            
        }        
    });
        
        }
    });
}); 

employeeRouter.put('/Update/:name/:Dept?/:Role?', function(req,res) {
    var name = req.param("name");
    var Dept = req.param("Dept");
    var role = req.param("Role");
    
    mongo.connect(connString,function (dbErr,db) {
        if(dbErr)
        {
             res.send('Connection failed : '+dbErr);
        }
        else
        {
            db.collection("Users").update({"name":name},{$set: {"Dept":Dept,"Role":role}},function(err,result)
        {
        if(err)
        {
            res.send("error while updating : "+err);
        } 
         else
         {
             res.send("update successful : "+result);
         }
     });
        
        }
    });
});
    
exports.default = employeeRouter;

