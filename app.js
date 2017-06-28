var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var Docker = require('dockerode');
var fs     = require('fs');

var port = process.env.PORT || 8080;
var host = 'ghost1stack.edc83907.svc.dockerapp.io'; //"localhost";

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json    

app.post('/api/setup', function(req, res) {
    var data = req.body;
    console.log('name: ' + data.name);
        
    var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    var stats  = fs.statSync(socket);

    if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
    }    
    var docker = new Docker({socketPath: socket});
    docker.run('ghost', [], [process.stdout, process.stderr], {Tty: false, env: ['VIRTUAL_HOST='+data.name+'.'+host]} , function(error, data, container){
        console.log(error);
        res.send('Error');
    });

    // need to wait?
    console.log("redorected to " + data.name+'.'+host+'/');
    res.send({redirect: 'http://'+data.name+'.'+host+'/'});
});

app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end )
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('Example app listening on port ' + port)
});