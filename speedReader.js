var MILLISECONDS_PER_MINUTE = 60000;
var displayWordsAtInterval;
var currentTextIndex = 0;
var text;
var pointerPos;
var wordsArePlaying;

var w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  viewWidth = w.innerWidth || e.clientWidth || g.clientWidth,
  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
console.log(viewWidth);

window.onload = function () {

  init();
  showWatch();

  var displayPos = document.getElementById('display-wrapper').offsetLeft;
  pointerPos = document.getElementsByClassName('pointer-top')[0].offsetLeft + displayPos;
  console.log('pointerPos: ', pointerPos);

  // Listen for new files.
  document.getElementById('file-input').addEventListener(
    'change', readMultipleFiles, false);
  document.getElementById('text-display').addEventListener(
    'click', togglePlayPause, false);
  document.getElementById('escape-fullScreen-button').addEventListener(
    'click', exitFullScreen, false);
  window.addEventListener("keydown", checkKeyPressed, false);
};

window.onresize = function(event) {
  w = window;
  d = document;
  e = d.documentElement;
  g = d.getElementsByTagName('body')[0];
  viewWidth = w.innerWidth || e.clientWidth || g.clientWidth;
  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  console.log(viewWidth);
  var displayPos = document.getElementById('display-wrapper').offsetLeft;
   pointerPos = document.getElementsByClassName('pointer-top')[0].offsetLeft + displayPos;
  // console.log('pointerPos: ', pointerPos);
};

// Initialize control buttons.
function init() {
  var textDisplay = document.getElementById('text-display');
  document.getElementById('text-input').innerHTML = 'Enter text here.';
  document.getElementById("pause-read").onclick = function() {
    clearInterval(displayWordsAtInterval);
    stopWatch();
    wordsArePlaying = false;
  };
  document.getElementById("restart-read").onclick = function() {
    currentTextIndex = 0;
    textDisplay.innerHTML = '&nbsp;';
    resetWatch();
    if (wordsArePlaying) {
      startWatch();
    }
  };
  document.getElementById("stop-read").onclick = function() {
    currentTextIndex = 0;
    clearInterval(displayWordsAtInterval);
    textDisplay.innerHTML = '&nbsp;';
    document.getElementById('display-wrapper').style.display = "none";
    document.getElementById('text-input-box').style.display = "block";
    resetWatch();
    exitFullScreen();
    document.getElementById('enter-fullScreen-button').style.display = "none";

    var controlButtons = document.getElementsByClassName('control-buttons');
    for (var i = 0; i < controlButtons.length; i++) {
      controlButtons[i].style.display = 'block';
    }
  };


  // Toggle hidden settings tab.
  var settings_button = document.getElementById('settings');

  settings_button.onclick = function() {
    var div = document.getElementById('settings-tab');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
        settingsTabOpen = false;
    } else {
      div.style.display = 'block';
      settingsTabOpen = true;
    }
  };
}

// Toggle play and pause with spacebar. "Enter" key will stop playback.
function checkKeyPressed(e) {
  if (document.getElementById('text-input-box').style.display === "none") {
    if (e.keyCode === 32) {
      togglePlayPause();
    } else if (e.keyCode === 13) {
      document.getElementById("stop-read").click();
    } else if (e.keyCode === 27) {
      console.log('exit');
      exitFullScreen();
      exitFullScreen();
    }
  }
}

// Gets all letters after '.' to check the kind of filetype.
function getFileExtension(filename) {
  return filename.split('.').pop();
}

// Reads in file from file-input then sets Global text variable with file contents.
function readMultipleFiles(evt) {
    //Retrieve all the files from the FileList object
    var files = evt.target.files;

    if (files) {
      for (var i = 0, f; f = files[i]; i++) {

        var fileExtension = getFileExtension(f.name);
        // console.log(fileExtension);

        if (fileExtension === 'txt') {
          var r = new FileReader();
          r.onload = (function (f) {
            return function (e) {
              var contents = e.target.result;
              text = contents;
              // document.getElementById('text-input').innerHTML = text;
            };
          })(f);
          r.readAsText(f);
        }
        else {
          alert("This file type is not currently supported.");
          document.getElementById('file-input').value = '';
        }
      }
    } else {
        alert("Failed to load file");
    }
}

// Determines value of text variable by finding which radio button is checked.
function getRadioValue(evt) {
  var elements = document.getElementsByName('group1');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      if (elements[i].value === 'file-input') {
        return text;
      } else {
        return document.getElementById('text-input').value;
      }
    }
  }
}

// Finds the center letter of a word and changes that letter's color to blue.
function changeCenterLetterColor(word) {
  if (word) {
    var splitWord = word.split('');
    // var splitWord = word.split(new RegExp('[\S+\.,-\/#!$%\^&\*;:{}=\-_`~()]', 'g'));​​​​​​​​​​​​​​​​​
    var wordLength = splitWord.length - 1;
    if (splitWord[wordLength].match(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      wordLength -= 1;
    }
    var centerLetter;
    if (wordLength > 0) {
      // if ((wordLength % 2 || wordLength % 3 === 0) && wordLength > 2) {
      //   centerLetter = Math.floor(wordLength / 2);
      // } else {
      //   centerLetter = Math.floor(wordLength / 2);
      // }
      centerLetter = 1;
    }
    else {
      centerLetter = 0;
    }
    splitWord[centerLetter] = '<font class="centerLetter" color="blue">' + splitWord[centerLetter] + '</font>';
    var c = document.getElementsByClassName('centerLetter')[0];
    if (c) {
      // console.log(c.offsetLeft);
    }
    var newWord = splitWord.join('');
    if (newWord.length === 1) {
      newWord = '<font class="readWords">' + '&nbsp;' + newWord + '</font>';
    }
    else {
      newWord = '<font class="readWords">' + newWord + '</font>';
    }
    // console.log(newWord);
    return newWord;
  } else {
    return '';
  }
}

// Turn on FullScreen mode. Hide control buttons.
function displayAtFullScreen() {
  var displayWrapper = document.getElementById('display-wrapper');
  var content = document.getElementById('content');
  if (content.requestFullscreen) {
    content.requestFullscreen();
  } else if (content.msRequestFullscreen) {
    content.msRequestFullscreen();
  } else if (content.mozRequestFullScreen) {
    content.mozRequestFullScreen();
    displayWrapper.style.marginLeft = "31%";
    displayWrapper.style.marginTop = "21%";
  } else if (content.webkitRequestFullscreen) {
    content.webkitRequestFullscreen();
    displayWrapper.style.marginLeft = "-10%";
    displayWrapper.style.marginTop = "4%";
    content.style.marginTop = "-1%";
  }

  // var displayWrapper = document.getElementById('display-wrapper');

  content.style.zoom = 2.0;
  content.style.MozTransform = 'scale(3.3)';
  content.style.WebkitTransform = 'scale(1.9)';

  // content.style.backgroundColor = 'white';

  // content.style.marginRight = "60%";
  // content.style.marginTop = "70%";

  var textDisplay = document.getElementById('text-display');
  textDisplay.style.fontSize = '40px';

  var controlButtons = document.getElementsByClassName('control-buttons');
  for (var i = 0; i < controlButtons.length; i++) {
    controlButtons[i].style.display = 'none';
  }
  document.getElementById('escape-fullScreen-button').style.display = "block";
  document.getElementById('enter-fullScreen-button').style.display = "none";

}

// Leave FullScreen mode and show control buttons.
function exitFullScreen() {
  if (document.cancelFullScreen) {
      document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
  }

  var displayWrapper = document.getElementById('display-wrapper');
  displayWrapper.style.marginLeft = "17.5%";
  displayWrapper.style.marginTop = "10%";

  var textDisplay = document.getElementById('text-display');
  var fontSizeSelect = document.getElementById('font-size');
  var fontSize = fontSizeSelect.options[fontSizeSelect.selectedIndex].value;
  textDisplay.style.fontSize = fontSize + 'px';
  setTextPadding(fontSize);

  var content = document.getElementById('content');
  content.style.zoom = 1;
  content.style.MozTransform = 'scale(1)';
  content.style.WebkitTransform = 'scale(1)';
  content.style.marginTop = "2%";

  var controlButtons = document.getElementsByClassName('control-buttons');
  for (var i = 0; i < controlButtons.length; i++) {
    controlButtons[i].style.display = 'block';
  }

  document.getElementById('escape-fullScreen-button').style.display = 'none';
  document.getElementById('enter-fullScreen-button').style.display = "block";
}

// Switch between play and pause mode.
function togglePlayPause() {
  if (!wordsArePlaying) {
    document.getElementsByClassName('play-button')[0].click();
  } else {
    document.getElementById('pause-read').click();
    wordsArePlaying = false;
  }
}


function setTextPadding(fontSize) {
  var textDisplay = document.getElementById('text-display');
  if (fontSize === '20') {
    textDisplay.style.paddingLeft = "32%";
  } else if (fontSize === '30') {
    textDisplay.style.paddingLeft = "30%";
  } else if (fontSize === '40') {
    textDisplay.style.paddingLeft = "28%";
  } else if (fontSize === '50') {
    textDisplay.style.paddingLeft = "26%";
  } else if (fontSize === '60') {
    textDisplay.style.paddingLeft = "24%";
  } else if (fontSize === '70') {
    textDisplay.style.paddingLeft = "22%";
  } else if (fontSize === '80') {
    textDisplay.style.paddingLeft = "20%";
  }
}

// Hides text-input-box then prints text to screen at the speed determined by
// words-per-minute setting.
function displayTextAtSpeed() {

  wordsArePlaying = true;
  var textDisplay = document.getElementById('text-display');
  var fontSizeSelect = document.getElementById('font-size');
  var fontSize = fontSizeSelect.options[fontSizeSelect.selectedIndex].value;
  var wordCounter = document.getElementsByClassName('word-counter')[0];
  var wordTimer = document.getElementsByClassName('word-timer')[0];

  document.getElementById('text-input-box').style.display = "none";
  document.getElementById('display-wrapper').style.display = "block";
  document.getElementById('enter-fullScreen-button').style.display = "block";
  document.getElementById('settings-tab').style.display = "none";

  // document.getElementById('enter-fullScreen-button').style.marginTop = "35.5%";
  var toggleFullScreen = document.getElementById('full-screen-switch');

  if (toggleFullScreen.checked) {
    displayAtFullScreen();
    fontSize = '40';
  }

  textDisplay.style.fontSize = fontSize + 'px';

  var speed = MILLISECONDS_PER_MINUTE / document.getElementById('wpm').value;
  var text = getRadioValue();
  var splitText;
  var words = [];
  var word;

  if (text !== undefined) {
    splitText = text.replace(/\s+/g, ' ');
    splitText = splitText.split(' ');
    words = splitText;
  }

  // When word is only one letter, index is 0 or reset index.
  if (currentTextIndex === words.length) {
    console.log('one word/letter: ', currentTextIndex, words);
    currentTextIndex = 0;
  }

  clearInterval(displayWordsAtInterval);

  // Position blue letter to be in between arrows.
  setTextPadding(fontSize);


  // Display first word with no delay before it.
  if (words.length > 0) {
    word = changeCenterLetterColor(words[currentTextIndex++]);
    // console.log(word);
    if (word !== undefined && word !== '') {
      startWatch();
      console.log(word);
      textDisplay.innerHTML = word;
      wordCounter.innerHTML = "Words Read: " + currentTextIndex;
    }
  }

  console.log(words);

  // Display rest of text
  displayWordsAtInterval = setInterval(function() {
    whiteSpacePattern = new RegExp('\\s');
    if (words[currentTextIndex] !== undefined) {
      // console.log(whiteSpacePattern.test(words[currentTextIndex + 1]));
      console.log(words[currentTextIndex] === '');
      console.log(words[currentTextIndex].length);
      if (words[currentTextIndex].length === 1) {
        word = changeCenterLetterColor(words[currentTextIndex++]);
        textDisplay.innerHTML = ' ' + word;
        wordCounter.innerHTML = "Words Read: " + currentTextIndex;
      }
      if (words[currentTextIndex] === '') {
        currentTextIndex++;
        textDisplay.innerHTML = '&nbsp;';
        console.log('its a space dummy');
      }
      // Get the word and increment currentTextIndex to move to the next word.
      word = changeCenterLetterColor(words[currentTextIndex++]);
      textDisplay.innerHTML = word;
      wordCounter.innerHTML = "Words Read: " + currentTextIndex;
      // if (currentTextIndex === words.length) {
      //   if (words[currentTextIndex] === ' ') {
      //     textDisplay.innerHTML = '&nbsp;';
      //   }
      // }
    } else {
        stopWatch();
        textDisplay.innerHTML = '&nbsp;';
        clearInterval(displayWordsAtInterval);
        wordsArePlaying = false;
    }
  }, speed);
  return displayWordsAtInterval;
}

/*****************************************************************
 *                    Code for the stopwatch                     *
 *     Courtesy of https://gist.github.com/electricg/4372563     *
 *****************************************************************/

// To start the stopwatch:
// obj.start();
//
// To get the duration in milliseconds without pausing / resuming:
// var x = obj.time();
//
// To pause the stopwatch:
// var x = obj.stop(); // Result is duration in milliseconds
//
// To resume a paused stopwatch
// var x = obj.start(); // Result is duration in milliseconds
//
// To reset a paused stopwatch
// obj.stop();
//

var clsStopwatch = function() {
  // Private vars
  var startWatchAt = 0;  // Time of last start / resume. (0 if not running)
  var lapTime = 0;  // Time on the clock when last stopped in milliseconds

  var now = function() {
    return (new Date()).getTime();
  };

  // Public methods
  // Start or resume
  this.startWatch = function() {
    startWatchAt = startWatchAt ? startWatchAt : now();
  };

  // Stop or pause
  this.stopWatch = function() {
    // If running, update elapsed time otherwise keep it
    lapTime = startWatchAt ? lapTime + now() - startWatchAt : lapTime;
    startWatchAt = 0; // Paused
  };

  // Reset
  this.resetWatch = function() {
    lapTime = startWatchAt = 0;
  };

  // Duration
  this.time = function() {
    return lapTime + (startWatchAt ? now() - startWatchAt : 0);
  };
};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
  var s = "0000" + num;
  return s.substr(s.length - size);
}

function formatTime(time) {
  var h = m = s = ms = 0;
  var newTime = '';

  h = Math.floor( time / (60 * 60 * 1000) );
  time = time % (60 * 60 * 1000);
  m = Math.floor( time / (60 * 1000) );
  time = time % (60 * 1000);
  s = Math.floor( time / 1000 );
  ms = time % 1000;

  newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
  return newTime;
}

function showWatch() {
  $time = document.getElementsByClassName('word-timer')[0];
  updateWatch();
}

function updateWatch() {
  $time.innerHTML = formatTime(x.time());
}

function startWatch() {
  clocktimer = setInterval("updateWatch()", 1);
  x.startWatch();
}

function stopWatch() {
  x.stopWatch();
  clearInterval(clocktimer);
}

function resetWatch() {
  stopWatch();
  x.resetWatch();
  updateWatch();
}
