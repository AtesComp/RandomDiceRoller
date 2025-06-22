var RandomArray = new Uint32Array(1);

function getRandom(min, max) {
  window.crypto.getRandomValues(RandomArray);
  var RandomNumber = RandomArray[0] % (max-min+1) + min;
  return RandomNumber;
}

function printRoll() {
  var pStr = document.getElementById('dieCntSave');
  //pStr.innerHTML = 'You rolled ' + document.getElementById('dieCntSave').value + ' dice.';
  console.log('You rolled ' + document.getElementById('dieCntSave').value + ' dice.')
}

function getDiceRoll() {
  var myCnt = parseInt( document.getElementById('dieCnt').value.trim() );
  var mySides = parseInt( document.getElementById('dieSide').value.trim() );
  var myRollResult = document.getElementById('dieRollResult');
  const dieFaces = [6,8,12,20];
  var colors = ["Blue","Green","Purple","Red","White","Yellow", "Sequence", "OffWhite"];
  if (myCnt < 1 || mySides < 1) {
    myRollResult.innerHTML = '<p>No dice! Check count and sides!</p>';
//    document.getElementById('dieCnt').value = '';
//    document.getElementById('dieCntSave').value = 0;
//    document.getElementById('dieSide').value = '';
//    printRoll();
    return;
  }

  var myResult = '<h1>';
  var myVal = 0;
  for (i=0; i<myCnt; i++) {
    var myDie = getRandom(1, mySides);
    var myColor = 4; // White
    if (mySides == 6) {
      myColor = document.getElementById('dieColor').value.trim();
      if (myColor == 6) {
        myColor = i % 6;
      }
    }

    var mySided = pad(mySides, 2);

    if ( dieFaces.indexOf(mySides) > -1 ) {
      myResult += '<img src="images/D' + mySided + '_' + colors[myColor] + '_' + myDie + '.png" alt="' + myDie + '" />';
    }
    else if (mySides < 20) {
      myResult += '<img src="images/DTRI_Paper_' + myDie + '.png" alt="' + myDie + '" />';
    }
    else {
      myResult += '' + myDie + ' ';
    }
    myVal += myDie;
  }
  myResult += '</h1>';
  myRollResult.innerHTML = myResult;
  myTotal = '<b>Total: ' + myVal + '</b>';
  document.getElementById('dieTotal').innerHTML = myTotal;
  document.getElementById('dieCnt').value = myCnt;
  document.getElementById('dieCntSave').value = myCnt;
  document.getElementById('dieSide').value = mySides;

  var bCollect = document.getElementById('collectRoll').value.trim();
  if (bCollect == 'true') {
    document.getElementById('reportRolls').innerHTML += '<b>' + myVal + '</b><br />';
  }
//  printRoll();
}

function getTimestamp() {
  document.getElementById('timestamp').innerHTML = (new Date()).toISOString();
}

function setCollect() {
  var bCollect = document.getElementById('collectRoll').value.trim();
  if (bCollect == 'true') {
      document.getElementById('collectRoll').value = 'false';
      document.getElementById('reportRolls').innerHTML = '';
  }
  else {
      document.getElementById('collectRoll').value = 'true';
  }
}

function getRoll() {
  getDiceRoll();
  getTimestamp();
}

function pad(num, size) {
    if (num >= (10 * size)) {
        return num.toString()
    }
    var nlen = num.toString().length;
    if (nlen > size)
        nlen = size;
    var s = '0'.repeat(size - nlen) + num;
    return s.substr(s.length - size);
}
