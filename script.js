"use strict";

var yourTurn = true;
var array = [];  //main storage array for current board state
var yourToken = "";
var compToken = "";
var yourScore = 0;
var compScore = 0;
var youFirst = false;
var eightChecks = [
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [3, 4, 5],
  [0, 1, 2],
  [0, 3, 6],
  [6, 7, 8],
  [2, 5, 8]
];
var threeChecks = [3, -2, 2];
var positionSets = [
  [3, 3],
  [35, 3],
  [67, 3],
  [3, 35],
  [35, 35],
  [67, 35],
  [3, 67],
  [35, 67],
  [67, 67],
  [0, 0]
];

function resetArray() {
  array = [];
  for (var i = 0; i < 9; i++) {
    array.push(0);
  }
}

resetArray();

function choose(choice) {
  yourToken = choice;
  if (choice == "x") {compToken = "o";}
  else {compToken = "x";}
  slideRandomWithFade('x', 'out');
  slideRandomWithFade('o', 'out');
  slideRandomWithFade('or', 'out');
  setTimeout(function() {
    document.getElementById('gameBoard').classList.remove('hide');
    for (var i = 0; i < 9; i++) {
      slideRandomWithFade('b'+i, 'in');
    }
  }, 200)
}

function listener(self) {
  if (yourTurn == true) {
    var spot = (Number(String(self.id).slice(1)));
    if (array[spot] == 0) {
      yourTurn = false;
      var spotId = "c" + spot;
      placeToken(yourToken, spotId);
      setTimeout(checkGrid, 750);
    }
  }
}

function placeToken(token, Id) {
  var element = document.getElementById(Id);
  element.innerHTML = token;
  element.classList.add(token + "Color");
  setTimeout (function() {
    document.getElementById("b" + Id.slice(1)).classList.add(token + "Back");
  }, 300);
  slideRandomWithFade(Id, 'in');
  document.getElementById("f" + Id.slice(1)).classList.remove("clicky");
  var spot = (Number(Id.slice(1)));
  if (token == yourToken) {
    array[spot] = 1;
  } else {
    array[spot] = -1;
  }
}

function end(result) {
  setTimeout(function() {
    if (result == "win") {
      yourScore += 1;
    } else if (result == "lose") {
      compScore += 1;
    }
    slideRandomWithFade(result, 'in');
    slideRandomWithFade('score', 'out');
    for (var i = 0; i < 9; i++) {
      slideRandomWithFade('c'+i, 'out');
      slideRandomWithFade('b'+i, 'out');
    }
    document.getElementById("score").innerHTML = "you:" + yourScore + "<br>them:" + compScore
    resetArray();
    setTimeout(function() {
      for (var i = 0; i < 9; i++) {
        var spotId = "c" + i;
        var frontId = "f" + i;
        var backId = "b" + i;
        document.getElementById(frontId).classList.add("clicky");
        document.getElementById(backId).classList.remove("xBack","oBack","backlight");
        var element = document.getElementById(spotId);
        element.classList.remove("highlight","oColor","xColor")
        element.innerHTML = "";
        slideRandomWithFade('b'+i, 'in');
      }
      slideRandomWithFade(result, 'out');
      slideRandomWithFade('score', 'in');
      setTimeout(function() {if (youFirst == true) {
        youFirst = false;
        yourTurn = true;
      } else {
        youFirst = true;
        checkGrid();
      }},800);
    }, 1600);
  }, 800);
}

function checkGrid() {
  var eightSums = [];
  for (var i = 0; i < 8; i++) {
    var sum = (array[eightChecks[i][0]] + array[eightChecks[i][1]] + array[eightChecks[i][2]]);
    eightSums.push(sum);
  }
  var avail = [];
  for (var i = 0; i < 9; i++) {
    if (array[i] == 0) {
      avail.push(i);
    }
  }
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 8; j++) {
      if (threeChecks[i] == eightSums[j]) {
        if (i == 0) { // concede defeat, declare WIN
          takeAction("win", eightChecks[j])
          return;
        } else if (i == 1) { //  move to win, declare LOSER
          takeAction("lose", eightChecks[j]);
          return;
        } else if (i == 2) { //  move to block
          takeAction("block", eightChecks[j]);
          return;
        }
      }
    }
  }
  if (avail.length == 0) { //no empty spots, cats game
    end("cats");
    return;
  }
  if (avail.length == 9) { //empty board
    var spot = 0;
  } else if (avail.length == 7) {
      if ((array[1] == 1) || (array[5] == 1)) {
        var spot = 6;
      } else if ((array[3] == 1) || (array[7] == 1)|| (array[8] == 1)) {
        var spot = 2;
      } else {
        var spot = 8;
      }
  } else if (avail.length == 5) {
    if ((array[1] == 1) && (array[8] == 1)) {var spot = 6;}
    else if ((array[1] == 1) && (array[3] == 1)) {var spot = 8;}
  }
  else {
    var spot = String(avail[(Math.floor((Math.random() * avail.length)))]);
  }
  var spotId = "c" + spot;
  placeToken(compToken, spotId)
  if (avail.length == 1) { //last spot taken, cats game
    end("cats");
    return;
  }
  yourTurn = true;
  ////////////////////

  function takeAction(action, arr) {
    for (var i = 0; i < 3; i++) {
      if (action != "block") {
        document.getElementById("c" + arr[i]).classList.add("highlight");
        document.getElementById("b" + arr[i]).classList.add("backlight");
      }
      if (array[arr[i]] == 0) {
        var spotId = "c" + arr[i];
        placeToken(compToken, spotId)
        yourTurn = true;
      }
    }
    if (action != "block") {
      end(action);
    } else if (avail.length == 1) { //last spot taken, cats game
      end("cats");
      return;
    }
  }
}

function slideRandomWithFade(id, direction) {
  var elem = document.getElementById(id);
  var duration = .3;
  var angle = (Math.random() * 360);
  var xCord = (.7*window.innerWidth)*(Math.cos(angle));
  var yCord = (.5*window.innerHeight)*(Math.sin(angle));
  var x0, y0, xf, yf, alpha0, alphaF, jitCount;
  if (direction == "in") {
    elem.classList.remove('hide');
    x0 = xCord;
    y0 = yCord;
    xf = yf = 0;
    alpha0 = 0;
    alphaF = 1;
    jitCount = 3;
  } else if (direction == "out") {
    xf = xCord;
    yf = yCord;
    x0 = y0 = 0;
    alpha0 = 1;
    alphaF = 0;
    jitCount = 0;
  }
  var actualX = x0 + Number(window.getComputedStyle(elem).getPropertyValue("left").slice(0,-2));
  var actualY = y0 + Number(window.getComputedStyle(elem).getPropertyValue("top").slice(0,-2));
  var currentX = actualX;
  var currentY = actualY;
  var fps = 120;
  var totalFrames = duration*fps;
  var velX = (xf - x0)/(totalFrames);
  var velY = (yf - y0)/(totalFrames);
  var rate = (alphaF - alpha0)/totalFrames;
  var currentOpacity = alpha0;
  totalFrames += jitCount;
  elem.style.left = (currentX) + "px";
  elem.style.top = (currentY) + "px";
  elem.style.opacity = currentOpacity;
  (function animate() {
    var loop = setInterval(frame, 1000/fps);
    var currentFrame = 0;
    function frame() {
      currentFrame++;
      currentX += velX;
      currentY += velY;
      elem.style.left = currentX + "px";
      elem.style.top = currentY + "px";
      currentOpacity += rate;
      elem.style.opacity = currentOpacity;
      if (currentFrame == totalFrames) {
        clearInterval(loop);
        if (jitCount != 0) {
          jitCount--;
          velX = -velX;
          velY = -velY;
          currentFrame = 0;
          totalFrames = ((jitCount*2) + 1);
          animate();
        } else {
          if ((id == 'win') || (id == 'lose') || (id == 'cats')) {
            console.log('tits');
            elem.style.top = "45vh";
            elem.style.left = "0%"
          } else {
            if (id == 'score') {
            var spot = 9;
          } else {
            var spot = Number(id.slice(1));
          }
            if (isNaN(spot) == false) {
              elem.style.left = positionSets[spot][0]+'%';
              elem.style.top = positionSets[spot][1]+'%';
            }
          }
          if (direction == "out") {
            elem.classList.add('hide');
            elem.style.opacity = 1
          }
        }
      }
    }
  })();
}
