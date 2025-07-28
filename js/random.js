var RandomArray = new Uint32Array(1);
var CollectionRow = 0;
var Timestamp = 0;
var SortAscend = [ false, false, false ];

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
    document.getElementById('reportRollsBody').innerHTML +=
      '<tr id="roll' + CollectionRow + '">' +
        '<td><input type="checkbox" name="cbox' + CollectionRow + '"/></td>' +
        '<td>' + myVal + '</td>' +
        '<td>' + Timestamp + '</td>' +
        '<td>' +
          '<button onclick="removeRow(\'roll' + CollectionRow + '\')" ' +
                  'type="button" ' +
          '>&#10060;</button>' +
        '</td>' +
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

function removeRow(strRow) {
  let tableBody = document.getElementById('reportRollsBody');
  let tableRow = document.getElementById(strRow);
  tableBody.deleteRow(tableRow.rowIndex - 1); // ...subtract 1 due to header row
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
        '<thead>' +
          '<th><button type="button" onclick="sortTable(0)">Mark</button></th>' +
          '<th><button type="button" onclick="sortTable(1)">Roll</button></th>' +
          '<th><button type="button" onclick="sortTable(2)">Time</button></th>' +
          '<th>Remove</th>' +
        '</thead>' +
        '<tbody id="reportRollsBody"></tbody>';
  }
}

function sortTable(iCol) {
    let table = document.getElementById('reportRolls');
    let tableBody = document.getElementById('reportRollsBody');
    // Get the rows, removing the table header....
    let rows = Array.from(table.rows).slice(1);
    SortAscend[iCol] = ! SortAscend[iCol]; // ...flip Ascending / Descending

    // Sort the rows...
    let rowsSorted = rows.sort(
      (rowA, rowB) => {
        let cellA = rowA.cells[iCol];
        let cellB = rowB.cells[iCol];
        let iComp = 0; // ...default no sort

        // On Mark column, sort by checked boolean value...
        if (iCol === 0) {
          let bA = cellA.children[0].checked;
          let bB = cellB.children[0].checked;
          iComp = (bA && ! bB) ? -1 : (bA === bB) ? 0 : 1;
        }

        // On Roll column, sort by integer value...
        else if (iCol === 1) {
          let iA = parseInt(cellA.innerText);
          let iB = parseInt(cellB.innerText);
          iComp = (iA < iB) ? -1 : (iA === iB) ? 0 : 1;
        }

        // On Time column, sort by date integer value...
        else if (iCol === 2) {
          let iA = Date.parse(cellA.innerText);
          let iB = Date.parse(cellB.innerText);
          iComp = (iA < iB) ? -1 : (iA === iB) ? 0 : 1;
        }

        // Otherwise, try sort by string values...
        else iComp = cellA.innerText.localeCompare(cellB.innerText);

        return SortAscend[iCol] ? iComp : -iComp;
      }
    );

    // Update the table...
    tableBody.innerHTML = '';
    rowsSorted.forEach( row => tableBody.appendChild(row) );
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
    return s.substring(s.length - size);
}
