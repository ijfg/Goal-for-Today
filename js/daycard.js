function Entry (text, isGoal) {
  this.text = text;
  this.isGoal = isGoal;
  this.isDone = false;
}

function DayCards() {
  this.dayCards = JSON.parse(localStorage.getItem('daycards'));
  this.saveToLocalStorage = function() {
    localStorage.setItem('daycards', JSON.stringify(this.dayCards));
  }
}
let dc = new DayCards();

function addLoadEvent(func){
  const oldonload = window.onload;
  if (typeof window.onload != "function") {
    window.onload = func;
  } else {
    window.onload = () => {
      oldonload();
      func();
    };
  };
};

function turnToId (d) {
  let month = d.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let date = d.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  const idDate = d.getFullYear().toString() + "-" + month.toString() + "-" +  date.toString();
  return idDate;
}

function getNextDId(idDate) {
  let dataDate = idDate.split('-');
  let nextDate = new Date(dataDate[0], dataDate[1] - 1, dataDate[2]);
  nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
  const nextDId = turnToId(nextDate);
  return nextDId;
}

function onStartUp(){
  // Create today's day ID
  let d = new Date();
  const idToday = turnToId(d);
  // Display date on DOM card
  const dateBlanks = document.querySelectorAll('h4');
  // On both goal and achievement sides
  for (const blank of dateBlanks) {
    blank.textContent = idToday;
  }
  // Load previous entries
  prepCard(idToday);
};


// dc.dayCards[date][i].remove();
// dc.saveToLocalStorage();
// updateView();

// item from i to j
// item = dc.dayCards[date][i].remove
// dc.dayCards[date][j].add(item)

function prepCard(idDate) {
  prepCardContents(idDate, prepCardEventListeners);
};

function prepCardContents(idDate, afterLoad) {
  if (dc.dayCards) {
    if (dc.dayCards[idDate]) {
      for (let i = 0; i < dc.dayCards[idDate].length; i++) {
        renderEntry(dc.dayCards[idDate][i]);
      }
    } else {
      // If the day's card doesn't exist
      initCard(idDate);
    }
  } else {
    // If no cards exist
    initCards();
    initCard(idDate);
  }

  afterLoad(idDate);
}

function initCards() {
  dc.dayCards = {};
  dc.saveToLocalStorage();
}

function initCard(idDate) {
  dc.dayCards[idDate] = [];
  dc.saveToLocalStorage();
}

function renderEntry(entry) {
  const liSet = document.createElement('li');
  // Load content
  liSet.textContent = entry['text'];
  // Mark state
  if (entry.isDone) {
    liSet.classList.toggle('crossOut');
  };
  // Prevent default action
  addEntryMousedownListener(liSet);
  addEntryDoubleClickListener(liSet, entry);

  // If it's a goal, display on goal side
  if (entry.isGoal) {
    document.getElementById('glist').appendChild(liSet);
  } else {
    // If not, display on achievement side
    document.getElementById('alist').appendChild(liSet);
  }
}

function prepCardEventListeners(idDate) {
  // Flip front to back event listner
  document.getElementById('gFlip').addEventListener('click', (e) => {
    document.getElementById('sec').classList.toggle('flip');
  });
  // Flip back to front event listner
  document.getElementById('aFlip').addEventListener('click', (e) => {
    document.getElementById('sec').classList.toggle('flip');
  });
  // When click previous day button
  
  // When click next day button
  
  // Setup input field
  const gInput = document.getElementById('gnew');
  document.getElementById('gnew').addEventListener('change', (e) => {
    inputHandler(gInput, idDate, true)});
  const aInput = document.getElementById('anew');
  document.getElementById('anew').addEventListener('change', (e) => {
    inputHandler(aInput, idDate, false)});
}

function addEntryDoubleClickListener(entryElement, entry) {
  entryElement.addEventListener('dblclick',(e) => {
    e.target.classList.toggle('crossOut');
    entry.isDone = !entry.isDone;
    dc.saveToLocalStorage();
  });
}

function addEntryMousedownListener(entryElement) {
  entryElement.addEventListener('mousedown',(e) => {
    if (e.detail> 1) {
      e.preventDefault();
    };
  });
}
    
function inputHandler(input, idDate, isGoal) {
  // 1. update data
  if (!dc.dayCards[idDate]) {
    dc.dayCards[idDate] = [];
  };

  dc.dayCards[idDate].push(new Entry(input.value, isGoal));
  dc.saveToLocalStorage();
  
  // 2. update view
  let entriesLength = dc.dayCards[idDate].length;
  let entry = dc.dayCards[idDate][entriesLength - 1];
  let entryElement = createEntryElement(entry);

  // 3. bind events listeners
  addEntryMousedownListener(entryElement);
  addEntryDoubleClickListener(entryElement, entry);
};

function createEntryElement(entry) {
  const entryElement = document.createElement('li');
  entryElement.textContent = entry['text'];
  
  if (entry.isGoal) {
    document.getElementById('glist').appendChild(entryElement);
    document.getElementById('gnew').value = '';
  } else {
    document.getElementById('alist').appendChild(entryElement);
    document.getElementById('anew').value = '';
  }
  
  return entryElement;
}

addLoadEvent(onStartUp);

// When user click previous day button

// When user click next day button

// When user delete an entry

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 

