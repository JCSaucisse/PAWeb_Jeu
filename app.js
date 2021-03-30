var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const httpServer = require("http").createServer(app);

httpServer.listen(8080);






// Gestion du jeu
const playerNames = ['noirs', 'blancs'];

let playingPlayer; // joueur en train de jouer

let playerSockets = [];

//  -1 attente de deux ready; 0 : tour des noirs; 1 blancs
let phase = -1;

function init(){
    console.log('init');
    phase = 0; // les noirs commencent

    rand = Math.random()<0.5?0:1;
    playingPlayer = rand; // la personne jouant les noirs est choisie aleatoirement

    // deux, un chaque couleur, le noir commence a jouer
    playerSockets[playingPlayer].emit('init', 0);
    playerSockets[1-playingPlayer].emit('init', 1);
}

function play(hexagonIntFromAndToList){
    console.log('play ', hexagonIntFromAndToList);
    phase = 1-phase;
    playingPlayer = 1-playingPlayer;
    playerSockets[playingPlayer].emit('opponentPlay', hexagonIntFromAndToList); // a l'autre, c'est a lui de jouer
}



var io = require('socket.io')(httpServer);
io.on('connection', function (socket) {
    console.log('connection', socket.id);
    socket.emit('clear','');


    socket.on('ready', function (ready) {
        if(phase != -1 && ready)
            return;

        if(!ready && phase != -1){
            for(let i = 0; i < playerSockets.length; i++){
                playerSockets[i].emit('clear','');
                phase = -1;
            }
            socket.emit('clear','');
            playerSockets = [];
        }
        if(ready){
            playerSockets.push(socket);
            if(playerSockets.length == 2){
                // verif tjrs present
                if(playerSockets[0].connected && playerSockets[1].connected){
                    init();
                }
            }
        }
        else if(playerSockets.includes(socket)){
            playerSockets.splice(playerSockets.indexOf(socket),1);
        }
        console.log('ready ', socket.id, ready, playerSockets.length);
    });

    socket.on('play', function (hexagonIntFromAndToList) {
        console.log('play ', socket.id, 'phase :', phase);
        if(phase != 0 && phase != 1)
            return;
        if(socket.id != playerSockets[playingPlayer].id) // verif : c'est bien a lui de jouer
            return;

        play(hexagonIntFromAndToList);
    });

    socket.on('end', function (won) {
        console.log('end ', socket.id, "won : ", won);
        if(phase != 0 && phase != 1)
            return;

        // on envoie a celui qui pas envoye la requete (celui qui a joue a envoye un play donc ca inverse)
        playerSockets[playingPlayer].emit('end', 1-won);
    });
});