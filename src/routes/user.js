// Route separations for User related routes

module.exports = function(app, api, db){

  // Login a user
  api.post('/login', (req, res) => {
    let params = [
      { title: 'username', required: true, type: 'string' },
      { title: 'password', required: true, type: 'string'}
    ];
    let requestData = req.body;
    requestData['time'] = Date.now();
    requestData['ip'] = req.ip;

    let result = app.checkParams(requestData, params);
    if(result[0]!=false){
      //Login script to log the attempt and also return token on success.
      res.send(result);
    }
    else{
      res.send(result);
    }
  });

  // Get All Users
  api.get('/users/list', (req, res) => {
    db.client.collection('users').find().toArray()
      .then(results => {
        res.send([true,results]);
      })
      .catch(error => {
        res.send([false,error]);
      })
  });

  //Count Users
  api.get('/users/count', (req, res) => {
    db.client.collection('users').countDocuments()
      .then(results => {
        res.send([true,results]);
      })
      .catch(error => {
        res.send([false,error]);
      })
  });

  // Delete a user by userid
  api.get('/user/:userid/removebyid', (req, res) => {
    db.client.collection('users').deleteOne({_id: new mongo.ObjectId(req.params.userid)})
      .then(results => {
        res.send([true,results]);
      })
      .catch(error => {
        res.send([false,error]);
      })
  });

  // Delete a user by username
  api.get('/user/:username/remove', (req, res) => {
    db.client.collection('users').deleteOne({username: req.params.username})
      .then(results => {
        res.send([true,results]);
      })
      .catch(error => {
        res.send([false,error]);
      })
  });

  // Create New User
  api.post('/user/create', (req, res) => {
    app.log(req.body);
    let params = [
      { title: 'givenName', required: true, type: 'string' },
      { title: 'familyName', required: true, type: 'string'},
      { title: 'username', required: true, type: 'string'},
      { title: 'email', required: true, type: 'string'},
      { title: 'age', required: true, type: 'number'}
    ];

    let result = app.checkParams(req.body, params);
    if(result[0]!=false){
      result[1].created, result[1].lastUpdated = Date.now();
      result[1].active = true;
      db.users.insertOne(result[1])
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

  // Get all Articles by User
  api.get('/user/:username/articles', (req, res) => {
    db.collection('articles').find({"username":req.params.username}).toArray()
      .then(results => {
        res.send([true,results]);
      })
      .catch(error => {
        res.send([false,error]);
      })
  });

}
