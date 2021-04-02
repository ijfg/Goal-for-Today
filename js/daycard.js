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
        renderEntry(idDate, i);
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

function renderEntry(idDate, i) {
  let entry = dc.dayCards[idDate][i];
  // const liContainer = document.createElement('li')
  const liSet = document.createElement('li');
  liSet.setAttribute('draggable', 'true');
  liSet.setAttribute('id', `${idDate}-${i}`);
  // Load content
  liSet.textContent = entry['text'];
  // Mark state
  if (entry.isDone) {
    liSet.classList.toggle('crossOut');
  };
  // Prevent default action
  addEntryMousedownListener(liSet);
  addEntryDoubleClickListener(liSet, entry);
  addDragDropListener(liSet, i);

  // If it's a goal, display on goal side
  if (entry.isGoal) {
    document.getElementById('glist').appendChild(liSet);
    document.getElementById('gnew').value = '';
  } else {
    // If not, display on achievement side
    document.getElementById('alist').appendChild(liSet);
    document.getElementById('anew').value = '';
  }
}

function prepCardEventListeners(idDate) {
  setFlipButtons();
  setInputField(idDate);
  setTrashZone(idDate);
  // When click previous/next day button
}

// function dragOver(e) {
//   e.preventDefault();
//   console.log('::: dragover :::');
//   e.target.classList.toggle('hovered');
// };

function setTrashZone(idDate){
  const trashZones = document.querySelectorAll('.trashbutton');
  for (const trashZone of trashZones) {
    trashZone.addEventListener('dragenter', e => {
      e.preventDefault();
      console.log('::: dragenter :::');
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('dragover', e => {
      e.preventDefault();
      console.log('::: dragover :::');
    });
    trashZone.addEventListener('dragleave', e => {
      console.log('::: dragleave :::');
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('drop', e => {
      e.preventDefault();
      console.log('::: drop :::');
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log(droppedData.indexKey);
      console.log('::: Before delete: ' + dc.dayCards[idDate]);
      dc.dayCards[idDate].splice(droppedData.indexKey, 1);
      console.log('::: After delete: ' + dc.dayCards[idDate]);
      dc.saveToLocalStorage();
      const droppedElement = document.getElementById(droppedData.id);
      console.log(droppedElement);
      droppedElement.classList.toggle('invisible');
      e.target.classList.toggle('hovered');
    });
  }
}

function setFlipButtons() {
  // Flip front to back event listner
  document.getElementById('gFlip').addEventListener('click', e => {
    document.getElementById('sec').classList.toggle('flip');
  });
  // Flip back to front event listner
  document.getElementById('aFlip').addEventListener('click', e => {
    document.getElementById('sec').classList.toggle('flip');
  });
}

function setInputField(idDate) {
  const gInput = document.getElementById('gnew');
  document.getElementById('gnew').addEventListener('change', e => {
    inputHandler(gInput, idDate, true)});
  const aInput = document.getElementById('anew');
  document.getElementById('anew').addEventListener('change', e => {
    inputHandler(aInput, idDate, false)});
}

function DraggedData (id, indexKey) {
  this.id = id;
  this.indexKey = indexKey;
};

function addDragDropListener(entryElement, index){
  // entryElement.addEventListener('dragstar', e => dragStart(e,index));
  entryElement.addEventListener('dragstart', (e) => {
    console.log('::: dragstart :::');
    const draggedData = new DraggedData(entryElement.id, index);
    e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
    // setTimeout(() => (e.target.classList.toggle('invisible')),300);
  });
}

// function dragStart(e, index){
//   console.log('::: dragstart :::');
//   e.dataTransfer.setData('text/plain', index);
//   setTimeout( e => (e.target.classList.toggle('invisible')),300);
// }

function addEntryDoubleClickListener(entryElement, entry) {
  entryElement.addEventListener('dblclick',e => {
    e.target.classList.toggle('crossOut');
    entry.isDone = !entry.isDone;
    dc.saveToLocalStorage();
  });
}

function addEntryMousedownListener(entryElement) {
  entryElement.addEventListener('mousedown',e => {
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
  // let entryElement = createEntryElement(entry);
  // let entryElement = createEntryElement(idDate);
  let index = dc.dayCards[idDate].length - 1;
  renderEntry(idDate, index);
  
  // // 3. bind events listeners
  // addEntryMousedownListener(entryElement);
  // addEntryDoubleClickListener(entryElement, entry);
  // addDragDropListener(entryElement);
};

function throttle(action) {
  let isRunning = false;
  return () => {
    if (isRunning) return;
    isRunning = true;
    window.requestAnimationFrame(action);
      isRunning = false;
    };
  };

addLoadEvent(onStartUp);

// When user click previous day button

// When user click next day button

// When user delete an entry

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 

