addLoadEvent(onStartUp);

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

function onStartUp(){
  const idToday = dateToID(new Date());
  prepCard(idToday);
};

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

function DraggedData (id, index) {
  this.id = id;
  this.indexKey = index;
  this.type = id.split('_')[1];
};

function dateToID (d) {
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
  const nextDId = dateToID(nextDate);
  return nextDId;
}

function getPreID(idDate) {
  let dataDate = idDate.split('-');
  let preDate = new Date(dataDate[0], dataDate[1] - 1, dataDate[2]);
  preDate = new Date(preDate.setDate(preDate.getDate() - 1));
  const preDId = dateToID(preDate);
  return preDId;
}

function setDisplayDate(idDate) {
  const dateBlanks = document.querySelectorAll('h4');
  for (const blank of dateBlanks) {
    blank.textContent = idDate;
  }
}

function prepCard(idDate) {
  prepCardContents(idDate, prepCardEventListeners);
};

function deleteCard(){
  const cardToClose = document.getElementById('out');
  cardToClose.classList.toggle('invisible');
}

function prepCardContents(idDate, callback = print) {
  setDisplayDate(idDate);
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
  callback();
}

function print(){
  console.log('not using callback');
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

  if (type == 'goals') {
    document.getElementById('glist').appendChild(liSet);
    document.getElementById('gnew').value = '';
  } else {
    document.getElementById('alist').appendChild(liSet);
    document.getElementById('anew').value = '';
  }
}

function prepCardEventListeners() {
  setFlipButtons();
  setInputField();
  setTrashZone();
  setDragSort();
  setLoadDayButtons();
}

function setLoadDayButtons() {
  document.getElementById('next').addEventListener('click', e => {
    const idDate = document.getElementById('gdate').textContent;
    const nextID = getNextDId(idDate);
    console.log('Next Day:' + nextID);
    clearContents();
    prepCardContents(nextID);
  })

  document.getElementById('previous').addEventListener('click', e => {
    const idDate = document.getElementById('gdate').textContent;
    const preID = getPreID(idDate);
    console.log('Previous Day:' + preID);
    clearContents();
    prepCardContents(preID);
  })
}

function clearContents(){
  let dateBlanks = document.querySelectorAll('h4');
  for (let blank of dateBlanks) {
    blank.textContent = '';
  };
  let lists = document.querySelectorAll('ol');
  console.log("dragcontainers :" + lists)
  for (let i=0; i<lists.length; i++) {
    while (lists[i].firstChild) {
      lists[i].removeChild(lists[i].firstChild);
    }
  }
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

function setDragSort() {
  let containers = document.querySelectorAll('.dragcontainer');
  for (let container of containers) {
    let dragEl, targetIndex;
  
    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'move';
      
      let target = e.target; // to be dragovered's event target
      // target.classList.toggle('red');
      if (target && target !== dragEl && target.nodeName == 'LI'){
        const mouseY = getMouseY(e);
        const targetY = getVerticalCenter(target);
        if (mouseY > targetY) {
          console.log('mouseY > targetY');
          container.insertBefore(dragEl, target.nextSibling);
          targetIndex = [...container.children].indexOf(e.target.nextSibling);
          console.log('targetIndex(nextSib): ' + targetIndex);
        } else {
          console.log('mouseY < targetY');
          container.insertBefore(dragEl, target);
          targetIndex = targetIndex - 1;
        }
      }
    }
    
    function onDrop(e) {
      e.preventDefault();
      const idDate = document.getElementById('gdate').textContent;
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const type = droppedData.type;
      let dragIndex = droppedData.indexKey;
      console.log('dragIndex = ' + dragIndex + ' & ' + 'targetIndex = ' + targetIndex);
      dc.dayCards[idDate][type].splice(targetIndex, 0, dc.dayCards[idDate][type].splice(dragIndex,1)[0]);
      dc.saveToLocalStorage();
    }

    function onDragEnd(e) {
      e.preventDefault();
  
      dragEl.classList.toggle('dragging');
      container.removeEventListener('dragover', onDragOver, false);
      container.removeEventListener('dragend', onDragEnd, false);
      container.removeEventListener('drop', onDrop, false);
    }
  
    container.addEventListener('dragstart', e => {
      dragEl = e.target; // dragstart's event target
      e.dataTransfer.effectAllowed = 'move';
      const dragIndex = [...container.children].indexOf(dragEl);
      console.log('dragEl index: ' + dragIndex);
      const draggedData = new DraggedData(dragEl.id, dragIndex);
      e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
      
      container.addEventListener('dragover', onDragOver, false);
      container.addEventListener('dragend', onDragEnd, false);
      container.addEventListener('drop', onDrop, false);
      // container.children.forEach(addEventListener('drop', onDrop, false));

      dragEl.classList.toggle('dragging');
      // setTime out makes hovered li seethrough, thus cannot be used
      // setTimeout(() => (e.target.classList.toggle('dragging')),0);
    }, false);
  }
}

function setTrashZone(){
  const trashZones = document.querySelectorAll('.trashbutton');
  for (const trashZone of trashZones) {
    trashZone.addEventListener('dragenter', e => {
      e.preventDefault();
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('dragover', e => {
      e.preventDefault();
    });
    trashZone.addEventListener('dragleave', e => {
      e.target.classList.toggle('hovered');
    });
    trashZone.addEventListener('drop', e => {
      e.preventDefault();
      const idDate = document.getElementById('gdate').textContent;
      console.log('trash drop e.target: ' + e.target.nodeName);
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const type = droppedData.type;
      dc.dayCards[idDate][type].splice(droppedData.indexKey, 1);
      dc.saveToLocalStorage();
      console.log('Deleted in LS: index ' + droppedData.indexKey);
      const droppedElement = document.getElementById(droppedData.id);
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

function setInputField() {
  const gInput = document.getElementById('gnew');
  document.getElementById('gnew').addEventListener('change', e => {
    inputHandler(gInput, true)});
  const aInput = document.getElementById('anew');
  document.getElementById('anew').addEventListener('change', e => {
    inputHandler(aInput, false)});
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
    
function inputHandler(input, isGoal) {
  const idDate = document.getElementById('gdate').textContent;
  if (isGoal) {
    let goals = dc.dayCards[idDate]['goals'];
    goals.push(new Entry(input.value));
    dc.saveToLocalStorage();
    renderEntry(idDate, goals.length - 1, 'goals');
  } else {
    let chores = dc.dayCards[idDate]['chores'];
    chores.push(new Entry(input.value));
    dc.saveToLocalStorage();
    renderEntry(idDate, chores.length - 1, 'chores');
  }
};

// When user click previous day button

// When user click next day button

// When user delete an entry (mobile)

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 

