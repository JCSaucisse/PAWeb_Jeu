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
const gridInit = [
        [ 1, 1, 1, 1, 1,-1,-1,-1,-1],
        [ 1, 1, 1, 1, 1 ,1,-1,-1,-1],
        [ 2, 2, 1, 1, 1, 2, 2,-1,-1],
        [ 2, 2, 2, 2, 2, 2, 2, 2,-1],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [-1, 2, 2, 2, 2, 2, 2, 2, 2],
        [-1,-1, 2, 2, 0, 0, 0, 2, 2],
        [-1,-1,-1, 0, 0, 0, 0, 0, 0],
        [-1,-1,-1,-1, 0, 0, 0, 0, 0]];

let playerSockets = [];

//  -1 attente de deux ready; 0 : tour des noirs; 1 blancs
let phase = -1;

let grid;

function init(){
    console.log('init');
    phase = 0;
    grid = gridInit;

    // deux, un chaque couleur, le noir commence son tour
    playerSockets[0].emit('init', 0);
    playerSockets[1].emit('init', 1);
}

function play(hexagonIntFromAndToList){
    console.log('play ', hexagonIntFromAndToList);
    if(isMovePossible()){
        // modif grille locale

        // verif victoire

        phase = 1-phase;
        playerSockets[phase].emit('opponentPlay', hexagonIntFromAndToList); // a l'autre, c'est a lui de jouer
    }
}

function isMovePossible(){
    return true;
}



var io = require('socket.io')(httpServer);
io.on('connection', function (socket) {
    console.log('connection', socket.id);
    socket.emit('statut','connecté');



    socket.on('ready', function (ready) {
        console.log('ready ', socket.id, ready);
        if(phase != -1)
            return;

        if(ready){
            playerSockets.push(socket);

            if(playerSockets.length == 2){ // verif tjrs present?
                init();
            }
        }
        else{
            playerSockets.splice(playerSockets.indexOf(socket),1);
        }
    });

    socket.on('play', function (hexagonIntFromAndToList) {
        console.log('play ', socket.id, 'phase :', phase);
        if(phase != 0 && phase != 1)
            return;
        if(socket.id != playerSockets[phase].id) // verif c'est bien a lui de jouer
            return;

        play(hexagonIntFromAndToList);
    });
});