var RandomArray = new Uint32Array(1);
var CollectionRow = 0;
var Timestamp = 0;

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

  var myResult = '<h1>'; // ...start result text
  var myVal = 0;
  var myBaseColor = document.getElementById('dieColor').value.trim();
  for (i=0; i<myCnt; i++) {
    var myColor = myBaseColor;
    var myDie = getRandom(1, mySides);
    if (mySides == 6) {
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
  } // ...end loop
  myResult += '</h1>'; // ...end result text
  myRollResult.innerHTML = myResult;
  myTotal = '<b>Total: ' + myVal + '</b>';
  document.getElementById('dieTotal').innerHTML = myTotal;
  document.getElementById('dieCnt').value = myCnt;
  document.getElementById('dieCntSave').value = myCnt;
  document.getElementById('dieSide').value = mySides;

  var bCollect = document.getElementById('collectRoll').value.trim();
  if (bCollect == 'true') {
    document.getElementById('reportRolls').innerHTML +=
      '<tr>' +
        '<td><input type="checkbox" name="roll' + CollectionRow + '" value="rollSel' + CollectionRow + '"/></td>' +
        '<td>' + myVal + '</td>' +
        '<td>' + Timestamp + '</td>' +
      '</tr>';
    CollectionRow += 1;
  }
//  printRoll();
}

function getTimestamp() {
  Timestamp = (new Date()).toISOString();
}

function setTimestamp(valTime) {
  document.getElementById('timestamp').innerHTML = Timestamp;
}

function setCollect() {
  var bCollect = document.getElementById('collectRoll').value.trim();
  if (bCollect == 'true') { // ...changing to false...
      document.getElementById('collectRoll').value = 'false';
      CollectionRow = 0;
      document.getElementById('reportRolls').innerHTML = '';
  }
  else { // ...changing to true...
      document.getElementById('collectRoll').value = 'true';
      CollectionRow = 0;
      document.getElementById('reportRolls').innerHTML =
        '<tr><th>Mark</th><th>Roll</th><th>Time</th></tr>';
  }
}

function getRoll() {
  getTimestamp();
  getDiceRoll();
  setTimestamp();
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

getTimestamp();
