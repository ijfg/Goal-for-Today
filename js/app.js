function createCard (idDate) {
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
        <h4 id="${idDate}gdate">${idDate}</h4>
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
        <i class="fas fasd fa-redo" id="${idDate}gReset" title="Reset card"></i>
        <i class="fas fasd fa-chevron-right" id="${idDate}gFlip"></i>
        <i class="fas fasd fa-plus" id="${idDate}gAdd" title="Create card for tomorrow"></i>
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
      <i class="fas fasd fa-chevron-left" id="${idDate}aFlip"></i>
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
  checkGoals(idDate);
  checkAchievements(idDate);
};

function performActionG(idDate, objG, objGState, dGnew, dGlist) {
  // Get newly input goal value
  let newGoal = document.getElementById(dGnew).value;
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
  document.getElementById(dGlist).appendChild(liCurrent);
  // Clear input field
  document.getElementById(dGnew).value = '';
  // Prevent the default refresh action of input form
  event.preventDefault();
};

function OnStartUp(){
  let d = new Date();
  console.log(d);
  // let month = d.getMonth() + 1;
  // if (month < 10) {
  //   month = '0' + month;
  // }
  // let date = d.getDate();
  // if (date < 10) {
  //   date = '0' + date;
  // }
  // // const idDate = month.toString() + date.toString() + d.getFullYear().toString();
  // const idDate = d.getFullYear().toString() + "-" + month.toString() + "-" +  date.toString();
  const idDate = turnToId(d);
  createCard(idDate);
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

// Tutorial of using local storage: https://developer.mozilla.org/en-US/docs/Web
// /API/Web_Storage_API/Using_the_Web_Storage_API
function checkGoals(idDate){
  let objG = {};
  let objGState = {};
  const dGlist = idDate + 'glist';
  const dGnew = idDate + 'gnew';
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
      document.getElementById(dGlist).appendChild(liSet);
    };
  };
  // Setup goal reset button
  const dGReset = idDate + 'gReset';
  document.getElementById(dGReset).addEventListener('click', (e) => {
    console.log("Reset click is working!");
    objG = {};
    objGState = {};
    document.getElementById(dGlist).innerHTML = "";
    localStorage.setItem(idDate + 'G',JSON.stringify(objG));
    localStorage.setItem(idDate + 'GS',JSON.stringify(objGState));
  });
  // Setup add card button
  document.getElementById(idDate + 'gAdd').addEventListener('click', (e) => {
    addCard(idDate)}, {once: true});
  // Setup input field
  document.getElementById(dGnew).addEventListener('change', (e) => {
    performActionG(idDate, objG, objGState, dGnew, dGlist)});
};
  
function addCard(idDate) {
  setDocHeight(); // both mobile safari and chrome ok, but with a mild 
  // throttle(setDocHeight); // mobile chrome: no / safari: ok
  console.log("Add click is working!");
  // Setting up date object for tomorrow
  let dataDate = idDate.split('-');
  let nextDate = new Date(dataDate[0], dataDate[1] - 1, dataDate[2]);
  nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
  // Create id from object
  const nextDId = turnToId(nextDate);
  // Use id to create card
  createCard(nextDId);
  // // Scroll to the newly created cards
  // const m = nextDate.getMonth() + 1;
  // const idD = m.toString() + nextDate.getDate().toString() + nextDate.getFullYear().toString();
  // const scrollEle = document.getElementById(idD + 'out');
  // // scrollEle.scrollIntoView({behavior: "smooth"});
  // const scrollDis = document.getElementById(idD + 'out').getBoundingClientRect().top;
  // console.log("Distance to viewport top: " + scrollDis);
  // scrollToSection(scrollEle, scrollDis);
  document.getElementById(idDate + 'gAdd').classList.toggle('fasd');
  document.getElementById(idDate + 'gAdd').classList.toggle('fasr');
  // document.getElementById(dGAdd).removeEventListener('click', (e) => {
  //   addCard(dGAdd)});
  // console.log("addcard listner removed");
};

function checkAchievements(idDate){
  let objA = {};
  let objAState = {}; // For adding stars state
  const dAlist = idDate + 'alist';
  const dAnew = idDate + 'anew';
  if(localStorage.getItem(idDate + 'A')){
    objA = JSON.parse(localStorage.getItem(idDate + 'A'));
    for (const achievment of Object.values(objA)) {
      const achiSet = document.createElement('li');
      achiSet.textContent = achievment;
      document.getElementById(idDate + 'alist').appendChild(achiSet);
    };
  };
  document.getElementById(dAnew).addEventListener('change', function(e) {
    performActionA(idDate, objA, objAState, dAnew, dAlist)});
};


function performActionA(idDate, objA, objAState, dAnew, dAlist) {
  // Get newly input achievement value
  let newAchi = document.getElementById(dAnew).value;
  const key = Object.keys(objA).length + 1;
  objA[key] = newAchi;
  localStorage.setItem(idDate + 'A',JSON.stringify(objA));
  const achiObj = JSON.parse(localStorage.getItem(idDate + 'A'));
  const achiCurrent = document.createElement('li');
  achiCurrent.textContent = achiObj[key];
  document.getElementById(dAlist).appendChild(achiCurrent);
  document.getElementById(dAnew).value = '';
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

function listOldCards() {
  const keys = Object.keys(localStorage);
  const values = Object.values(localStorage);
  // console.log(keys);
  // console.log(values);
  for (let key of keys) {
    if (key.indexOf('G') !== -1) {
      if (key.indexOf('S') == -1) {
        key = key.replace('G', '');
        console.log(key);
      }
    }
  }
}

// window.addEventListener('resize', throttle(setDocHeight));
// window.addEventListener('orientationchange',throttle(setDocHeight));
addLoadEvent(OnStartUp);
addLoadEvent(setDocHeight);
addLoadEvent(listOldCards);
