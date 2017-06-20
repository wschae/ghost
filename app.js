var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var Docker = require('dockerode');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json    

app.get('/docker/run', function(req, res){    
    var docker = new Docker();
    docker.run('ghost', [], [process.stdout, process.stderr], {Tty: false, env: ['VIRTUAL_HOST=demo3.localhost']} , function(error, data, container){
        console.log(data.StatusCode);
    });
    res.send('hello docker');
});

app.post('/api/setup', function(req, res) {
    var data = req.body;
    console.log('name: ' + data.name);
    res.send({redirect: 'http://www.google.com/search?q='+data.name});
});

app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end )
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('Example app listening on port ' + port)
});