// BennyMakes Express Server

const express = require('express');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const api = express();
const port = 3000;

const settings = {
  version: "1.0.0",
  logging: "console"
};

let app = {
  settings: settings
};

app.log = function (data, type = 'system') {

    /* ------------------------

     Log types can be
        - system = A system message for the developers
        - event = An event e.g. user actions
        - security = A user accessed the system or an access attempt occured
        - error = A issue that needs to be isolated

    -------------------------- */

    switch(app.settings.logging){

      case "console":
        console.log(data);
        break;

      case "file":
        // Log to a file
        // Still to build this
        break;

      case "database":
        // Log to a Database
        // Still to build this
        break;

      case "database":
        // Log to a Database
        // Still to build this
        break;
    }
}

// Return the Version of the API
app.getVersion = function(){
  return 'v'+app.settings.version;
}

// A function to check all route parameters are valid
app.checkParams = function(data, requiredParams){
  for(var i=0; i<requiredParams.length; i++){
    //Iterate through the parameters and if a parameter is required check data has the parameter
    if(requiredParams[i].required==true){
      if(!data.hasOwnProperty(requiredParams[i].title)){
        return [false, "Not all required properties sent. ("+requiredParams[i].title+")"];
      }
      else{
        // Check data is not empty then if parameter requires a strict type and finally if data mathes that type
        if(data[requiredParams[i].title]!=null&&data[requiredParams[i].title]!=""){
          if(requiredParams[i].hasOwnProperty('type')){
            if(typeof data[requiredParams[i].title]!==requiredParams[i].type){
              return [false, "Incorrect property data type. ("+requiredParams[i].title+")"];
            }
          }
        }
        else{
          return [false, "Property sent without value. ("+requiredParams[i].title+")("+data[requiredParams[i].title]+")"];
        }
      }
    }
  }
  // Data passes requirements.
  return [true, data];
}


// App Settings
api.use(express.json()) // for parsing application/json
api.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



// Database Settings
const dbUser = "application_user";
const dbPass = "V4wtW9p4PR5cNDug";
const dbName = "benny-makes-blog";
// MongoDB Connection String
const connectionString = "mongodb+srv://"+dbUser+":"+dbPass+"@clusterzero.pkoch.mongodb.net/"+dbName+"?retryWrites=true&w=majority";


// Connect to the Mongo Database
  MongoClient.connect(connectionString, {useUnifiedTopology: true })
    .then((client) => {
      console.log('Connected to Database');
      // Application Code
      let db = {
        client: client.db(dbName),
      }

      db['users'] = db.client.collection('users');
      db['articles'] = db.client.collection('articles');
      db['tags'] = db.client.collection('tags');


    // Application Middleware
    api.use((req, res, next) => {
        console.log(req.method+' @ Route: '+req.path);
        next();
    });


    // Route Specific Middleware



    // Routes
    api.get('/', (req,res) => {
      res.send('BennyMakes API');
    });

    api.get('/version', (req,res) => {
      res.send(getVersion());
    });


    // User Routes
    require('./routes/user')(app, api, db);



    // Article Routes
    //Count all articles
    api.get('/articles/count', (req, res) => {
      db.client.collection('articles').countDocuments()
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });

    // Get All Articles
    api.get('/articles', (req, res) => {
      db.client.collection('articles').find().toArray()
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });

    // Create New Article
    api.post('/article', (req, res) => {
      app.log(req.body);
      let params = [
        { title: 'title', required: true, type: 'string' },
        { title: 'creator', required: true, type: 'string'},
        { title: 'content', required: true, type: 'string'},
        { title: 'published', required: true, type: 'boolean'}
      ];

      let result = app.checkParams(req.body, params);
      if(result[0]!=false){

        // Assign timestamps to the article
        let timestamp = Date.now();
        result[1].created, result[1].lastUpdated = timestamp;

        db.articles.insertOne(result[1])
          .then(result => {
            app.log(result);
            res.send([true,result]);
          })
          .catch(error => {
            app.log(error);
            res.send([false, error]);
          })
      }
      else{
        res.send(result);
      }
    });

    // Delete an article by id
    api.get('/article/:id', (req, res) => {
      db.client.collection('articles').deleteOne({_id: new mongo.ObjectId(req.params.id)})
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });


    // Tag Routes
    //Count all tags
    api.get('/tags/count', (req, res) => {
      db.client.collection('tags').countDocuments()
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });

    // Get All Tags
    api.get('/tags', (req, res) => {
      db.client.collection('tags').find().toArray()
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });

    // Create New Tag
    api.post('/tag', (req, res) => {
      app.log(req.body);
      let params = [
        { title: 'title', required: true, type: 'string' }
      ];

      let result = app.checkParams(req.body, params);
      if(result[0]!=false){

        // Assign timestamps to the article
        let timestamp = Date.now();
        result[1].created, result[1].lastUpdated = timestamp;

        db.tags.insertOne(result[1])
          .then(result => {
            app.log(result);
            res.send([true,result]);
          })
          .catch(error => {
            app.log(error);
            res.send([false, error]);
          })
      }
      else{
        res.send(result);
      }
    });

    // Delete an Tag by id
    api.get('/tag/:id/removebyid', (req, res) => {
      db.client.collection('tags').deleteOne({_id: new mongo.ObjectId(req.params.id)})
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });

    // Delete an Tag by title
    api.get('/tag/:title/remove', (req, res) => {
      db.client.collection('tags').deleteOne({title: req.params.title})
        .then(results => {
          res.send([true,results]);
        })
        .catch(error => {
          res.send([false,error]);
        })
    });


    // Initialization
    api.listen(port, () => {
      console.log("%cBennyMakes API started and listening on "+port, {"color":"#1eaf23", "fontSize":"12pt", "fontWeight":"bold"});
    });




}).catch((err) => {
  console.log('Failed to connect to Database');
  console.log(err);
}); //End of application code
