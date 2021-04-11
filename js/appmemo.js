function createCard (idDate, callback = () => {}) {
  // const month = d.getMonth() + 1;
  // const idDate = month.toString() + d.getDate().toString() + d.getFullYear().toString();
  // const displayDate = month +'-'+ d.getDate()+'-'+ d.getFullYear();
  const sectionOutter = document.createElement('section');
  sectionOutter.setAttribute('class', 'outter');
  sectionOutter.setAttribute('id', idDate + 'out');
  const section = document.createElement('div');
  section.setAttribute('class', 'container');
  section.setAttribute('id', idDate + 'sec');
  section.innerHTML = `
  <div class="card">
    <div class="cardcard goal">
      <div class="date">
        <h4 id="${idDate}gdate" title="Show all">${idDate}</h4>
      </div>
      <div class="main">
        <form onsubmit="return false">
          <label>
            <input id="${idDate}gnew" type="text" name="input" placeholder=" Goals">
          </label>
        </form>
        <ol id="${idDate}glist"></ol>
      </div>
      <footer>
        <i class="fas fasd fa-undo grey" id="${idDate}gUndo" title="Undo"></i>
        <i class="fas fasd fa-chevron-right grey" id="${idDate}gFlip"></i>
        <i class="fas fasr fa-plus grey" id="${idDate}gAdd"></i>
      </footer>
    </div>
    <div class="cardcard achi">
      <div class="date">
        <h4 id="${idDate}adate">${idDate}</h4>
      </div>
      <div class="main">
        <form onsubmit="return false">
          <label>
            <input id="${idDate}anew" type="text" name="input" placeholder=" Achievements">
          </label>
        </form>
        <ol id="${idDate}alist"></ol>
      </div>
      <footer>
      <i class="fas fasd fa-undo grey" id="${idDate}aUndo" title="Undo"></i>
      <i class="fas fasd fa-chevron-left grey" id="${idDate}aFlip"></i>
      <i class="fas fasd fa-plus empty"></i>
    </footer>
    </div>
  </div>
  `;
  sectionOutter.appendChild(section);
  // document.getElementById('snapcontainer').appendChild(sectionOutter);
  const scriptTag = document.getElementsByTagName('script')[0];
  document.body.insertBefore(sectionOutter, scriptTag);
  // Flip front to back event listner
  document.getElementById(idDate + 'gFlip').addEventListener('click', (e) => {
    document.getElementById(idDate + 'sec').classList.toggle('flip');
  });
  // Flip back to front event listner
  document.getElementById(idDate + 'aFlip').addEventListener('click', (e) => {
    document.getElementById(idDate + 'sec').classList.toggle('flip');
  });
  // Single out function
  document.getElementById(idDate + 'gdate').addEventListener('click', (e) => {
    const cardClicked = document.getElementById(idDate + 'out');
    cardClicked.classList.toggle('invisible');
    let sections = document.querySelectorAll('section');
    sections = Array.from(sections);
    sections.forEach(function(sec) {
      sec.classList.toggle('invisible');
    })
    const dateClicked = document.getElementById(idDate + 'gdate');
    const cardTitle = dateClicked.getAttribute("title");
    console.log(cardTitle.length);
    if (cardTitle.length == 10) {
      dateClicked.setAttribute("title", "Show all");
    } else {
      dateClicked.setAttribute("title", "Single out");
    }
  });
  checkGoals(idDate);
  checkAchievements(idDate);
  callback();
};

function performActionG(idDate, objG, objGState) {
  // Get newly input goal value
  let newGoal = document.getElementById(idDate + 'gnew').value;
  // Identify ordered list number
  const key = Object.keys(objG).length + 1;
  // Save goal with number into js object
  objG[key] = newGoal;
  // Set crossout state into js object
  objGState[newGoal] = false;
  // Sync local storage with updated objects
  localStorage.setItem(idDate + 'G', JSON.stringify(objG));
  localStorage.setItem(idDate + 'GS', JSON.stringify(objGState));
  // Update to DOM from data in local storage
  const goalObj = JSON.parse(localStorage.getItem(idDate + 'G'));
  const liCurrent = document.createElement('li');
  liCurrent.textContent = goalObj[key];
  // Prevent double-clicking word selection
  liCurrent.addEventListener('mousedown',(e) => {
    if (e.detail> 1) {
      e.preventDefault();
    };
  });
  // Double click to crossout item
  liCurrent.addEventListener('dblclick', (e) => {
    console.log('dblclick is working!');
    e.target.classList.toggle('crossOut');
    // Add crossout state to local storage
    objGState[goalObj[key]] = !objGState[goalObj[key]];
    localStorage.setItem(idDate + 'GS',JSON.stringify(objGState));
  });
  // Append the new item to the list
  document.getElementById(idDate + 'glist').appendChild(liCurrent);
  // Clear input field
  document.getElementById(idDate + 'gnew').value = '';
  // Prevent the default refresh action of input form
  event.preventDefault();
};

// Show today's card
function onStartUp(){
  let d = new Date();
  console.log(d);
  const idDate = turnToId(d);
  const tdCard = document.getElementById(idDate + 'out');
  console.log("tdCard: " + !tdCard);
  if (!tdCard) {
    console.log("Today's card doesn't exist yet!");
    createCard(idDate);
  }
  hideOldCards(idDate);
};

function hideOldCards(idDate) {
  const todayC = document.getElementById(idDate + 'out');
  todayC.classList.toggle('invisible');
  let sections = document.querySelectorAll('section');
  sections = Array.from(sections);
  sections.forEach(function(sec) {
    sec.classList.toggle('invisible');
  })
}

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

// Tutorial of using local storage: https://developer.mozilla.org/en-US/docs/Web
// /API/Web_Storage_API/Using_the_Web_Storage_API
function checkGoals(idDate){
  let objG = {};
  let objGState = {};
  if(localStorage.getItem(idDate + 'G')){
    objG = JSON.parse(localStorage.getItem(idDate + 'G'));
    console.log(objG);
    objGState = JSON.parse(localStorage.getItem(idDate + 'GS'));
    for (const goal of Object.values(objG)) {
      const liSet = document.createElement('li');
      liSet.textContent = goal;
      if (objGState[goal]) {
        liSet.classList.toggle('crossOut');
      }
      liSet.addEventListener('mousedown',(e) => {
        if (e.detail> 1) {
          e.preventDefault();
        };
      });
      liSet.addEventListener('dblclick',(e) => {
        console.log('dblclick is working!');
        e.target.classList.toggle('crossOut');
        objGState[goal] = !objGState[goal];
        localStorage.setItem(idDate + 'GS',JSON.stringify(objGState));
      });
      document.getElementById(idDate + 'glist').appendChild(liSet);
    };
  };
  // Setup undo button
  document.getElementById(idDate + 'gUndo').addEventListener('click', (e) => {
    console.log("Undo click is working!");
    // Update js object
    const lastKey = Object.keys(objG).length;
    const lastValue = objG[lastKey];
    console.log("Object.keys(objG): " + Object.keys(objG));
    console.log("Object.values(objG): " + Object.values(objG));
    console.log("objGState: " + objGState);
    console.log("lastKey: " + lastKey);
    console.log("lastValue: " + lastValue);
    console.log("objGState[lastValue]: " + objGState[lastValue]);
    console.log("objG[lastKey]: " + objG[lastKey]);
    delete objGState[lastValue]; // deleted by key, not index
    delete objG[lastKey];
    // Sync js object with local localStorage
    localStorage.setItem(idDate + 'G',JSON.stringify(objG));
    localStorage.setItem(idDate + 'GS',JSON.stringify(objGState));
    // Update DOM
    const olList = document.getElementById(idDate + 'glist');
    olList.removeChild(olList.lastElementChild);
  });
  // // Setup goal reset button
  // document.getElementById(idDate + 'gReset').addEventListener('click', (e) => {
  //   console.log("Reset click is working!");
  //   objG = {};
  //   objGState = {};
  //   document.getElementById(idDate + 'glist').innerHTML = "";
  //   localStorage.setItem(idDate + 'G',JSON.stringify(objG));
  //   localStorage.setItem(idDate + 'GS',JSON.stringify(objGState));
  // });
  // // Setup add card button for today's card
  // const today = new Date();
  // const todayID = turnToId(today)
  // const tmrwID = getNextDId(idDate);
  // console.log('tmrwID: ' + tmrwID);
  // const tmrwEl = document.getElementById(tmrwID + 'out');
  // console.log('tmrwEl: ' + tmrwEl);
  // if (idDate === todayID && !tmrwEl) {
  //   document.getElementById(idDate + 'gAdd').classList.toggle('fasd');
  //   document.getElementById(idDate + 'gAdd').classList.toggle('fasr');
  //   // document.getElementById(idDate + 'gAdd').setAttribute('title', 'Create card for tomorrow')
  //   document.getElementById(idDate + 'gAdd').addEventListener('click', (e) => {
  //     addNextDayCard(idDate)}, {once: true});
  // }
  // Setup input field
  document.getElementById(idDate + 'gnew').addEventListener('change', (e) => {
    performActionG(idDate, objG, objGState)});
};

function getNextDId(idDate) {
  let dataDate = idDate.split('-');
  let nextDate = new Date(dataDate[0], dataDate[1] - 1, dataDate[2]);
  nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
  const nextDId = turnToId(nextDate);
  return nextDId;
}
  
function addNextDayCard(idDate) {
  setDocHeight(); // both mobile safari and chrome ok, but with a mild 
  // throttle(setDocHeight); // mobile chrome: no / safari: ok
  console.log("Add click is working!");
  document.getElementById(idDate + 'gAdd').classList.toggle('fasd');
  document.getElementById(idDate + 'gAdd').classList.toggle('fasr');
  // Setting up date object for tomorrow
  // let dataDate = idDate.split('-');
  // let nextDate = new Date(dataDate[0], dataDate[1] - 1, dataDate[2]);
  // nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
  // Create id from object
  // const nextDId = turnToId(nextDate);
  // Use id to create card
  const nDId = getNextDId(idDate);
  createCard(nDId, setAddButton);
  // // Scroll to the newly created cards
  // const m = nextDate.getMonth() + 1;
  // const idD = m.toString() + nextDate.getDate().toString() + nextDate.getFullYear().toString();
  // const scrollEle = document.getElementById(idD + 'out');
  // // scrollEle.scrollIntoView({behavior: "smooth"});
  // const scrollDis = document.getElementById(idD + 'out').getBoundingClientRect().top;
  // console.log("Distance to viewport top: " + scrollDis);
  // scrollToSection(scrollEle, scrollDis);
  // document.getElementById(idDate + 'gAdd').classList.toggle('fasd');
  // document.getElementById(idDate + 'gAdd').classList.toggle('fasr');
  // document.getElementById(dGAdd).removeEventListener('click', (e) => {
  //   addNextDayCard(dGAdd)});
  // console.log("addNextDayCard listner removed");
};

function checkAchievements(idDate){
  let objA = {};
  let objAState = {}; // For adding stars state
  if(localStorage.getItem(idDate + 'A')){
    objA = JSON.parse(localStorage.getItem(idDate + 'A'));
    objAState = JSON.parse(localStorage.getItem(idDate + 'AS'));
    for (const achievement of Object.values(objA)) {
      let achiSet = document.createElement('li');
      achiSet.textContent = achievement;
      if (objAState[achievement]) {
        achiSet.innerHTML += "  &#128077;";
      };
      // Prevent double-clicking word selection
      achiSet.addEventListener('mousedown',(e) => {
        if (e.detail> 1) {
          e.preventDefault();
        };
      });
    // Double click to thumbs up item
    achiSet.addEventListener('dblclick', (e) => {
      console.log('achi dblclick is working!');
      let achiSText = e.target.innerHTML;
      console.log(achiSText);
      console.log(achiSText.length);
      const twoSpace = '  ';
      const thumbsup = "  &#128077;";
      console.log(achiSText.includes(twoSpace));
      if (achiSText.includes(twoSpace)) {
        e.target.innerHTML = e.target.innerHTML.slice(0, -4);
        // e.target.innerHTML = e.target.innerHTML - thumbsup;
      } else {
        e.target.innerHTML += thumbsup;
      }
      // Add thumbs up state to local storage
      objAState[achievement] = !objAState[achievement];
      localStorage.setItem(idDate + 'AS',JSON.stringify(objAState));
    });
      document.getElementById(idDate + 'alist').appendChild(achiSet);
    };
  };
  // Setup undo button
  document.getElementById(idDate + 'aUndo').addEventListener('click', (e) => {
    console.log("Undo click is working!");
    // Update js object
    const lastKey = Object.keys(objA).length;
    const lastValue = objA[lastKey];
    console.log("Object.keys(objA): " + Object.keys(objA));
    console.log("Object.values(objA): " + Object.values(objA));
    console.log("objAState: " + objAState);
    console.log("lastKey: " + lastKey);
    console.log("lastValue: " + lastValue);
    console.log("objAState[lastValue]: " + objAState[lastValue]);
    console.log("obA[lastKey]: " + objA[lastKey]);
    delete objAState[lastValue]; // deleted by key, not index
    delete objA[lastKey];
    // Sync js object with local localStorage
    localStorage.setItem(idDate + 'A',JSON.stringify(objA));
    localStorage.setItem(idDate + 'AS',JSON.stringify(objAState));
    // Update DOM
    const olList = document.getElementById(idDate + 'alist');
    olList.removeChild(olList.lastElementChild);
  });
  document.getElementById(idDate + 'anew').addEventListener('change', function(e) {
    performActionA(idDate, objA, objAState)});
};

function performActionA(idDate, objA, objAState) {
  // Get newly input achievement value
  let newAchi = document.getElementById(idDate + 'anew').value;
  // Identify ordered list number
  const key = Object.keys(objA).length + 1;
  // Save goal with number into js object
  objA[key] = newAchi;
  // Set thumbs up state into js object
  objAState[newAchi] = false;
  // Sync local storage with updated objects
  localStorage.setItem(idDate + 'A',JSON.stringify(objA));
  localStorage.setItem(idDate + 'AS', JSON.stringify(objAState));
  // Update to DOM from data in local storage
  const achiObj = JSON.parse(localStorage.getItem(idDate + 'A'));
  const achiCurrent = document.createElement('li');
  achiCurrent.textContent = achiObj[key];
  // Prevent double-clicking word selection
  achiCurrent.addEventListener('mousedown',(e) => {
    if (e.detail> 1) {
      e.preventDefault();
    };
  });
  // Double click to thumbs up item
  achiCurrent.addEventListener('dblclick', (e) => {
    console.log('achi dblclick is working!');
    let achiCText = e.target.innerHTML;
    const twoSpace = '  ';
    const thumbsup = "  &#128077;";
      if (achiCText.includes(twoSpace)) {
        e.target.innerHTML = e.target.innerHTML.slice(0, -4);
      } else {
        e.target.innerHTML += thumbsup;
      }
    // Add thumbs up state to local storage
    objAState[achiObj[key]] = !objAState[achiObj[key]];
    localStorage.setItem(idDate + 'AS',JSON.stringify(objAState));
  });
  document.getElementById(idDate + 'alist').appendChild(achiCurrent);
  document.getElementById(idDate + 'anew').value = '';
  event.preventDefault();
};

// function prepareDotDisplay(idDate) {
//   const ulHolder = document.createElement('div');
//   ulHolder.classList.add('dotsUlHolder');
//   ulHolder.setAttribute('id', idDate + 'dot');
//   const ulDot = document.createElement('ul');
//   ulDot.setAttribute('id', 'dotsHorizontal');
//   let cardsHorizontal = document.querySelectorAll('.card');
//   cardsHorizontal = Array.from(cardsHorizontal);
//   for(const card of cardsHorizontal) {
//     const idValue = card.getAttribute('id');
//     const newDot = document.createElement('li');
//     newDot.setAttribute('class', idValue );
//     newDot.textContent = '.';
//     ulDot.appendChild(newDot);
//   };
//   ulHolder.appendChild(ulDot);
//   document.getElementById(idDate + 'G').appendChild(ulHolder);
//   window.addEventListener('scroll', throttle(function(e){
//     console.log("pageYOffset is working!");
//     let y = window.pageYOffset;
//     console.log(y);
//     document.getElementById(idDate + 'dot').style.top = -y + 720 + "px";
//     console.log(ulHolder.style.top);
//     console.log(document.getElementById(idDate + 'dot').style.top);
//   }))
//   // document.body.appendChild(ulHolder);
//   // const cardLoc = document.getElementById('cardMargin');
//   // cardLoc.appendChild(ulHolder);
// };

// function isInViewport(elem) {
//   let elemCheck = elem.getBoundingClientRect();
//   console.log(`${elemCheck.left} / ${window.innerWidth}`);
//   return (elemCheck.left + window.innerWidth / 2 >= 0 && elemCheck.left + window.innerWidth / 2< window.innerWidth);
// };

function position() {
  // return el.scrollTop;
  return document.documentElement.scrollTop ||
  document.body.parentNode.scrollTop ||
  document.body.scrollTop;
};

function move(ele, amount) {
  document.documentElement.scrollTop = amount;
  document.body.parentNode.scrollTop = amount;
  document.body.scrollTop = amount;
};

Math.inOutQuintic = (t, b, c, d) => {
var ts = (t/=d)*t,
tc = ts*t;
return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

function scrollToSection(ele, distance) {
  console.log("scrollToSection functioin starts!")
  let beginPos = position();
  console.log("begining position: " + beginPos);
  let currentTime = 0;
  let increment = 20;
  let animateScroll = () => {
    currentTime += increment;
    let value = Math.inOutQuintic(currentTime, beginPos, distance, 600);
    // value = Math.round(value);
    move(ele, value);
    if (currentTime < 600) {
      window.requestAnimationFrame(animateScroll);
    };
  };
  animateScroll();
};

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

function throttle(action) {
  let isRunning = false;
  return () => {
    if (isRunning) return;
    isRunning = true;
    window.requestAnimationFrame(action);
      isRunning = false;
    };
  };

function setDocHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
}

function listAllCards(callback) {
  let keys = Object.keys(localStorage);
  keys.sort();
  console.log(keys);
  // const values = Object.values(localStorage);
  if (keys != 0) {
    console.log("Old cards exist!");
    for (let key of keys) {
      if (key.indexOf('G') !== -1 && key.indexOf('GS') == -1 && key.indexOf('AS') == -1) {
        key = key.replace('G', '');
        createCard(key);
      }
    }
  } else {
    console.log("There is no old card");
  }
  onStartUp();
  callback();
}

function setAddButton(){
  const cards = document.querySelectorAll('section')
  const lastCard = cards[cards.length - 1];
  let lastCardId = lastCard.getAttribute('id');
  lastCardId = lastCardId.replace('out', '');
  document.getElementById(lastCardId + 'gAdd').classList.toggle('fasd');
  document.getElementById(lastCardId + 'gAdd').classList.toggle('fasr');
  document.getElementById(lastCardId + 'gAdd').setAttribute('title', 'Create card for tomorrow')
  document.getElementById(lastCardId + 'gAdd').addEventListener('click', (e) => {
  addNextDayCard(lastCardId)}, {once: true});
}

// function updateKey() {
//   const keys = Object.keys(localStorage);
//   for (let key of keys) {
//     if (key.indexOf('GS') !== -1) {
//       if (key.length == 9) {
//         const newKey = key.slice(3,7) + '-' + key.slice(0,2) + '-0' + key.slice(2,3) + key.slice(7,9);
//         const keyValue = localStorage.getItem(key);
//         localStorage.setItem(newKey,keyValue)
//       } 
//   }
// }

// window.addEventListener('resize', throttle(setDocHeight));
// window.addEventListener('orientationchange',throttle(setDocHeight));
addLoadEvent(listAllCards(setAddButton));
// addLoadEvent(OnStartUp);
addLoadEvent(setDocHeight);
