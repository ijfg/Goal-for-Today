function Entry (text) {
  this.text = text;
  this.isDone = false;
}

function DayCard () {
  this.goals = [];
  this.chores = [];
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
  let d = new Date();
  const idToday = turnToId(d);
  const dateBlanks = document.querySelectorAll('h4');
  for (const blank of dateBlanks) {
    blank.textContent = idToday;
  }
  prepCard(idToday);
};

function prepCard(idDate) {
  prepCardContents(idDate, prepCardEventListeners);
};

function prepCardContents(idDate, afterLoad) {
  if (!dc.dayCards) {
    initCards();
    initCard(idDate);
  } else if (!dc.dayCards[idDate]) {
    initCard(idDate);
  } else {
    for (let i = 0; i < dc.dayCards[idDate]['goals'].length; i++) {
      renderEntry(idDate, i, 'goals');
    }
    for (let j = 0; j < dc.dayCards[idDate]['chores'].length; j++) {
      renderEntry(idDate, j, 'chores');
    }
  }

  // if (dc.dayCards) {
  //   if (dc.dayCards[idDate]['goals'] || dc.dayCards[idDate]['chores']) {
  //     for (let i = 0; i < dc.dayCards[idDate]['goals'].length; i++) {
  //       renderEntry(idDate, i, 'goals');
  //     }
  //     for (let j = 0; j < dc.dayCards[idDate]['chores'].length; j++) {
  //       renderEntry(idDate, j, 'chores');
  //     }
  //   } else {
  //     // If the day's card doesn't exist
  //     initCard(idDate);
  //   }
  // } else {
  //   // If no cards exist
  //   initCards();
  //   initCard(idDate);
  // }

  afterLoad(idDate);
}

function initCards() {
  dc.dayCards = {};
  dc.saveToLocalStorage();
}

function initCard(idDate) {
  dc.dayCards[idDate] = new DayCard();
  dc.saveToLocalStorage();
}

function renderEntry(idDate, i, type) {
  let entry = dc.dayCards[idDate][type][i];
  const liSet = document.createElement('li');
  liSet.setAttribute('draggable', 'true');
  liSet.setAttribute('class', 'draggable');
  liSet.setAttribute('id', `${idDate}${type}${i}`);
  liSet.textContent = entry['text'];
  if (entry.isDone) {
    liSet.classList.toggle('crossOut');
  };
  addEntryMousedownListener(liSet);
  addEntryDoubleClickListener(liSet, entry);
  addDragDropListener(liSet, i, type);

  if (type == 'goals') {
    document.getElementById('glist').appendChild(liSet);
    document.getElementById('gnew').value = '';
  } else {
    document.getElementById('alist').appendChild(liSet);
    document.getElementById('anew').value = '';
  }
}

function prepCardEventListeners(idDate) {
  setFlipButtons();
  setInputField(idDate);
  setTrashZone(idDate);
  setDragZone(idDate);
  // When click previous/next day button
}

let container = document.getElementById('glist');
function setDragZone(idDate) {
  // const containers = document.querySelectorAll('.dragcontainer');
  // containers.forEach( container => {
  //   container.addEventListener('dragover', e => {
  //     e.preventDefault();
  //     // console.log('::: sorting--dragover :::');
  //     const afterElement = getDragAfterElement(container, e.clientY);
  //     const dragging = document.querySelector('.dragging');
  //     if (afterElement == null) {
  //       container.appendChild(dragging);
  //     } else {
  //       container.insertBefore(dragging, afterElement)
  //     }
  //   })
  // })
  container.addEventListener('dragover', dragOver, false);
}

function dragOver (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientY);
  const dragging = document.querySelector('.dragging');
  if (afterElement == null) {
    container.appendChild(dragging);
  } else {
    container.insertBefore(dragging, afterElement);
  }
}

// function throttle(action) {
//   let isRunning = false;
//   return () => {
//     if (isRunning) return;
//     isRunning = true;
//     window.requestAnimationFrame(action);
//       isRunning = false;
//     };
//   };

function getDragAfterElement(container, mouseY) {
  const draggables = [...container.querySelectorAll('.draggable')];

  // child is each element iin draggables
  // closest 
  return draggables.reduce((closest, child) => {
    const liBox = child.getBoundingClientRect();
    const offset = mouseY - liBox.top - liBox.height / 2;
    if (offset < 0 && offset > closest.offset){
      return {offset: offset, element: child}
    } else {
      return closest
    }
  }, {offset: Number.NEGATIVE_INFINITY}).element
}

function setTrashZone(idDate){
  const trashZones = document.querySelectorAll('.trashbutton');
  for (const trashZone of trashZones) {
    trashZone.addEventListener('dragenter', e => {
      e.preventDefault();
      // console.log('::: dragenter :::');
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('dragover', e => {
      e.preventDefault();
      // console.log('::: dragover :::');
    });
    trashZone.addEventListener('dragleave', e => {
      // console.log('::: dragleave :::');
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('drop', e => {
      e.preventDefault();
      // console.log('::: drop :::');
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log(droppedData.indexKey);
      const type = droppedData.type;
      // console.log('::: Before delete: ' + dc.dayCards[idDate][type]);
      dc.dayCards[idDate][type].splice(droppedData.indexKey, 1);
      // console.log('::: After delete: ' + dc.dayCards[idDate]);
      dc.saveToLocalStorage();
      const droppedElement = document.getElementById(droppedData.id);
      // console.log(droppedElement);
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

function DraggedData (id, indexKey, type) {
  this.id = id;
  this.indexKey = indexKey;
  this.type = type;
};

function addDragDropListener(entryElement, index, type){
  entryElement.addEventListener('dragstart', e => {
    // console.log('::: dragstart :::');
    entryElement.classList.toggle('dragging');
    const draggedData = new DraggedData(entryElement.id, index, type);
    e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
    // setTimeout(() => (e.target.classList.toggle('invisible')),300);
  });
  entryElement.addEventListener('dragend', () => {
    entryElement.classList.toggle('dragging');
  })
}

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
  if (isGoal) {
    let goals = dc.dayCards[idDate]['goals'];
    goals.push(new Entry(input.value));
    dc.saveToLocalStorage();
    // console.log('goals.length ' + goals.length);
    renderEntry(idDate, goals.length - 1, 'goals');
  } else {
    let chores = dc.dayCards[idDate]['chores'];
    chores.push(new Entry(input.value));
    dc.saveToLocalStorage();
    renderEntry(idDate, chores.length - 1, 'chores');
  }
};

addLoadEvent(onStartUp);

// When user click previous day button

// When user click next day button

// When user delete an entry (mobile)

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 

