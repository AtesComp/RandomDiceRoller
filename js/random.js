var g_arrRandom = new Uint32Array(1);
var g_iCollectionRow = 0;
var g_strTimestamp = 0;
var g_arrSortAscend = [ false, false, false ];
const g_carrDieFaces = [6, 8, 12, 20];
const g_carrDieColors = ["Blue","Green","Purple","Red","White","Yellow", "Sequence", "OffWhite"];

function getRandom(iMin, iMax) {
  window.crypto.getRandomValues(g_arrRandom);
  let iRandomNumber = g_arrRandom[0] % (iMax - iMin + 1) + iMin;
  return iRandomNumber;
}

function getDiceRoll() {
  var myCount = parseInt( document.getElementById('dieCount').value.trim() );
  var mySides = parseInt( document.getElementById('dieSide').value.trim() );
  var myRollImage = document.getElementById('dieRollImage');
  myRollImage.innerHTML = '';
  if (myCount < 1 || mySides < 1) {
    myRollImage.innerHTML = '<h2><b>No dice! Check count and sides are greater than 0!</b></h2>';
    return;
  }

  let myResultHTML = '<h1>'; // ...start result text
  let myResultVal = 0;
  let myBaseColor = document.getElementById('dieColor').value.trim();
  let myColor = myBaseColor;
  // Only White exists for non 6 sided-die types...
  if (mySides !== 6) myColor = g_carrDieColors.indexOf("White");

  for (i = 0; i < myCount; i++) {
    // On 6 sided-die with sequence coloring...
    if (mySides === 6 && myBaseColor == 6) myColor = i % 6; // ...cycle the first 6 colors

    let myDieRoll = getRandom(1, mySides);
    if ( g_carrDieFaces.indexOf(mySides) > -1 ) { // ...use a well-known die image...
      let mySided = pad(mySides, 2);
      myResultHTML += '<img src="images/D' + mySided + '_' + g_carrDieColors[myColor] + '_' + myDieRoll + '.png" alt="' + myDieRoll + '" />';
    }
    else if (mySides < 20) { // ...use a basic triangular die image...
      myResultHTML += '<img src="images/DTRI_Paper_' + myDieRoll + '.png" alt="' + myDieRoll + '" />';
    }
    else { // ...no die image--just display the value...
      myResultHTML += '' + myDieRoll + ' ';
    }
    myResultVal += myDieRoll;
  } // ...end loop

  myResultHTML += '</h1>'; // ...end result text
  myRollImage.innerHTML = myResultHTML;
  myTotal = '<b>' + myResultVal + '</b>';
  document.getElementById('dieTotal').innerHTML = myTotal;
  document.getElementById('dieCount').value = myCount;
  document.getElementById('dieSide').value = mySides;

  var bCollect = document.getElementById('collectRoll').value.trim();
  if (bCollect == 'true') {
    document.getElementById('reportRollsBody').innerHTML +=
      '<tr id="roll' + g_iCollectionRow + '">' +
        '<td><input type="checkbox" name="cbox' + g_iCollectionRow + '"/></td>' +
        '<td>' + myResultVal + '</td>' +
        '<td>' + g_strTimestamp + '</td>' +
        '<td>' +
          '<button onclick="removeRow(\'roll' + g_iCollectionRow + '\')" ' +
                  'type="button" ' +
          '>&#10060;</button>' +
        '</td>' +
      '</tr>';
    g_iCollectionRow += 1;
  }
}

function getTimestamp() {
  g_strTimestamp = (new Date()).toISOString();
}

function setTimestamp(valTime) {
  document.getElementById('timestamp').innerHTML = g_strTimestamp;
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
      g_iCollectionRow = 0;
      document.getElementById('reportRolls').innerHTML = '';
  }
  else { // ...changing to true...
      document.getElementById('collectRoll').value = 'true';
      g_iCollectionRow = 0;
      document.getElementById('reportRolls').innerHTML =
        '<thead>' +
          '<th><button type="button" onclick="sortTable(0)">Mark</button></th>' +
          '<th><button type="button" onclick="sortTable(1)">Roll</button></th>' +
          '<th><button type="button" onclick="sortTable(2)">Time</button></th>' +
          '<th></th>' +
        '</thead>' +
        '<tbody id="reportRollsBody"></tbody>';
  }
}

function sortTable(iCol) {
    let table = document.getElementById('reportRolls');
    let tableBody = document.getElementById('reportRollsBody');
    // Get the rows, removing the table header....
    let rows = Array.from(table.rows).slice(1);
    g_arrSortAscend[iCol] = ! g_arrSortAscend[iCol]; // ...flip Ascending / Descending

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

        return g_arrSortAscend[iCol] ? iComp : -iComp;
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
