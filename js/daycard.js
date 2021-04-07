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
  liSet.setAttribute('id', `${idDate}_${type}_${i}`);
  liSet.textContent = entry['text'];
  if (entry.isDone) {
    liSet.classList.toggle('crossOut');
  };
  addEntryMousedownListener(liSet);
  addEntryDoubleClickListener(liSet, entry);
  // addDragDropListener(liSet, i, type);

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
  setDragSort(idDate, 'glist');
  // When click previous/next day button
}

function getMouseY(evt) {
  const targetRect = evt.target.getBoundingClientRect();
  const offset = evt.pageY - targetRect.top;
  return offset;
}

function getVerticalCenter(el) {
  const rect = el.getBoundingClientRect();
  return (rect.bottom - rect.top) /2;
}

function setDragSort(idDate) {
  let containers = document.querySelectorAll('.dragcontainer');
  for (let container of containers) {
    let dragEl;
  
    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'move';
      
      let target = e.target; // to be dragovered's event target
      // console.log('dragover e.target: ' + e.target.textContent);
      if (target && target !== dragEl && target.nodeName == 'LI'){
        const mouseY = getMouseY(e);
        const targetY = getVerticalCenter(target);
        if (mouseY > targetY) {
          container.insertBefore(dragEl, target.nextSibling);
          // console.log('insert before target.nextSibling: ' + target.nextSibling);
        } else {
          container.insertBefore(dragEl, target);
          // console.log('insert before target: ' + target);
        }
      }
    }
  
    function onDragEnd(e) {
      e.preventDefault();
      // console.log('dragend e.target: ' + e.target.textContent);
  
      dragEl.classList.toggle('dragging');
      container.removeEventListener('dragover', onDragOver, false);
      container.removeEventListener('dragend', onDragEnd, false);
    }
  
    container.addEventListener('dragstart', e => {
      dragEl = e.target; // dragstart's event target
      e.dataTransfer.effectAllowed = 'move';
      const draggedData = new DraggedData(dragEl.id);
      e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
      
      container.addEventListener('dragover', onDragOver, false);
      container.addEventListener('dragend', onDragEnd, false);
      
      dragEl.classList.toggle('dragging');
      // setTime out makes hovered li seethrough, thus cannot be used
      // setTimeout(() => (e.target.classList.toggle('dragging')),0);
    }, false);
  }
}

// function dragOver (e) {
//   e.preventDefault();
//   const afterElement = getDragAfterElement(container, e.clientY);
//   const dragging = document.querySelector('.dragging');
//   if (afterElement == null) {
//     container.appendChild(dragging);
//   } else {
//     container.insertBefore(dragging, afterElement);
//   }
// }

// function getDragAfterElement(container, mouseY) {
//   const draggables = [...container.querySelectorAll('.draggable')];

//   // child is each element in draggables
//   // closest 
//   return draggables.reduce((closest, child) => {
//     const liBox = child.getBoundingClientRect();
//     const offset = mouseY - liBox.top - liBox.height / 2;
//     if (offset < 0 && offset > closest.offset){
//       return {offset: offset, element: child}
//     } else {
//       return closest
//     }
//   }, {offset: Number.NEGATIVE_INFINITY}).element
// }

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
      console.log('trash drop e.target: ' + e.target.nodeName);
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const type = droppedData.type;
      // console.log('::: Before delete: ' + dc.dayCards[idDate][type]);
      dc.dayCards[idDate][type].splice(droppedData.indexKey, 1);
      // console.log('::: After delete: ' + dc.dayCards[idDate]);
      dc.saveToLocalStorage();
      console.log('Deleted in LS: index ' + droppedData.indexKey);
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

function DraggedData (id) {
  const t = id.split('_')[1];
  const i = id.split('_')[2];
  this.id = id;
  this.indexKey = i;
  this.type = t;
};

// function addDragDropListener(entryElement, index, type){
//   entryElement.addEventListener('dragstart', e => {

//     entryElement.classList.toggle('dragging');
//     e.dataTransfer.effectAllowed = 'move';
//     const draggedData = new DraggedData(entryElement.id, index, type);
//     e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
//     setTimeout(() => (e.target.classList.toggle('invisible')),0);

//     entryElement.addEventListener('dragend', () => {
//       entryElement.classList.toggle('dragging');
//     })

//   }, false);
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

