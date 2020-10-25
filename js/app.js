function createCard (d) {
  const month = d.getMonth() + 1;
  const idDate = month.toString() + d.getDate().toString() + d.getFullYear().toString();
  const displayDate = month +'-'+ d.getDate()+'-'+ d.getFullYear();
  const section = document.createElement('section');
  section.setAttribute('class', 'container');
  section.innerHTML = `
  <div class="card goal" id="${idDate}G">
  <div class="cardcard">
    <div class="date">
      <h4 id="${idDate}gdate">${displayDate}</h4>
    </div>
    <div class="main">
      <form onsubmit="return false">
        <label>
          <input id="${idDate}gnew" type="text" name="input" placeholder=" Set goals">
        </label>
      </form>
      <ol id="${idDate}glist"></ol>
    </div>
    <footer>
      <i class="fas fa-redo" id="${idDate}gReset" title="Reset card"></i>
      <i class="fas fa-plus" title="Create card for tomorrow"></i>
    </footer>
  </div>
</div>
<div class="card achi"  id="${idDate}A">
  <div class="cardcard">
    <div class="date">
      <h4 id="${idDate}adate">${displayDate}</h4>
    </div>
    <div class="main">
      <form onsubmit="return false">
        <label>
          <input id="${idDate}anew" type="text" name="input" placeholder=" Record achievements">
        </label>
      </form>
      <ol id="${idDate}alist"></ol>
    </div>
  </div>
</div>
  `;
  document.body.append(section);
  checkGoals(idDate);
  checkAchievements(idDate);
  prepareDotDisplay();
}

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
  createCard(d);
  // let month = d.getMonth() + 1;
  // idDateG = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'G';
  // idDateGS = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'GS';
  // idDateA = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'A';
  // let newDate = month +'-'+ d.getDate()+'-'+ d.getFullYear();
  // const goalDate = document.getElementById('gdate');
  // const achiDate = document.getElementById('adate');
  // goalDate.innerHTML = newDate;
  // const goalCard = goalDate.closest('.card');
  // // goalCard.addEventListener('scroll', throttle(activateDot));
  // goalCard.setAttribute('id', idDateG)
  // achiDate.innerHTML = newDate;
  // const achiCard = achiDate.closest('.card');
  // achiCard.setAttribute('id', idDateA);
  // checkGoals();
  // checkAchievements();
  // prepareDotDisplay();
};

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
  // Setup input field
  document.getElementById(dGnew).addEventListener('change', function(e) {
    performActionG(idDate, objG, objGState, dGnew, dGlist)});
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

// function checkGoals(){
//   if(localStorage.getItem(idDateG)){
//     objG = JSON.parse(localStorage.getItem(idDateG));
//     objGState = JSON.parse(localStorage.getItem(idDateGS));
//     for (const goal of Object.values(objG)) {
//       const liSet = document.createElement('li');
//       liSet.textContent = goal;
//       if (objGState[goal]) {
//         liSet.classList.toggle('crossOut');
//       }
//       liSet.addEventListener('mousedown',(e) => {
//         if (e.detail> 1) {
//           e.preventDefault();
//         };
//       });
//       liSet.addEventListener('dblclick',(e) => {
//         console.log('dblclick is working!');
//         e.target.classList.toggle('crossOut');
//         objGState[goal] = !objGState[goal];
//         localStorage.setItem(idDateGS,JSON.stringify(objGState));
//       });
//       glist.appendChild(liSet);
//     };
//   };
// };

// function checkAchievements(){
//   if(localStorage.getItem(idDateA)){
//     objA = JSON.parse(localStorage.getItem(idDateA));
//     for (const achievment of Object.values(objA)) {
//       const achiSet = document.createElement('li');
//       achiSet.textContent = achievment;
//       alist.appendChild(achiSet);
//     };
//   };
// };

function prepareDotDisplay() {
  const ulHolder = document.createElement('div');
  ulHolder.setAttribute('id', 'dotsUlHolder');
  const ulDot = document.createElement('ul');
  ulDot.setAttribute('id', 'dotsHorizontal');
  let cardsHorizontal = document.querySelectorAll('.card');
  cardsHorizontal = Array.from(cardsHorizontal);
  for(const card of cardsHorizontal) {
    const idValue = card.getAttribute('id');
    const newDot = document.createElement('li');
    newDot.setAttribute('class', idValue );
    newDot.textContent = '.';
    ulDot.appendChild(newDot);
  };
  ulHolder.appendChild(ulDot);
  document.body.appendChild(ulHolder);
  // const cardLoc = document.getElementById('cardMargin');
  // cardLoc.appendChild(ulHolder);
};

function isInViewport(elem) {
  let elemCheck = elem.getBoundingClientRect();
  console.log(`${elemCheck.left} / ${window.innerWidth}`);
  return (elemCheck.left >= 0 && elemCheck.left < window.innerWidth);
};

function activateDot() {
  let cards = document.querySelectorAll('.card');
  cards = Array.from(cards);
  console.log(cards);
  for (const card of cards) {
    const cardKey = card.getAttribute('id');
    let dotRelated = document.querySelector(`li[class="${cardKey}"]`);
    if (isInViewport(card)) {
      dotRelated.style.color='#d63031';
    } else {
      dotRelated.style.color="grey";
    };
  };
};


// let objG = {};
// let objGState = {};
// let objA = {};
// let newGoal;
// let newAchi;
// const fieldG = document.getElementById('gnew');
// const fieldA = document.getElementById('anew');

// document.getElementById('gnew').addEventListener('change', performActionG);
// document.getElementById('anew').addEventListener('change', performActionA);

// function performActionG(event) {
//   newGoal = fieldG.value;
//   const key = Object.keys(objG).length + 1;
//   objG[key] = newGoal;
//   objGState[newGoal] = false;
//   // Save into local storage
//   localStorage.setItem(idDateG,JSON.stringify(objG));
//   localStorage.setItem(idDateGS,JSON.stringify(objGState));
//   // Update to DOM from data in local storage
//   const goalObj = JSON.parse(localStorage.getItem(idDateG));
//   const liCurrent = document.createElement('li');
//   liCurrent.textContent = goalObj[key];
//   // Prevent double-clicking word selection
//   liCurrent.addEventListener('mousedown',(e) => {
//     if (e.detail> 1) {
//       e.preventDefault();
//     };
//   });
//   // Double click to crossout item
//   liCurrent.addEventListener('dblclick', (e) => {
//     console.log('dblclick is working!');
//     e.target.classList.toggle('crossOut');
//     // Add crossout state to local storage
//     objGState[goalObj[key]] = !objGState[goalObj[key]];
//     localStorage.setItem(idDateGS,JSON.stringify(objGState));
//   });
//   glist.appendChild(liCurrent);
//   fieldG.value = '';
//   event.preventDefault();
// };

// function performActionA(event) {
//   newAchi = fieldA.value;
//   const key = Object.keys(objA).length + 1;
//   objA[key] = newAchi;
//   localStorage.setItem(idDateA,JSON.stringify(objA));
//   const achiObj = JSON.parse(localStorage.getItem(idDateA));
//   const achiCurrent = document.createElement('li');
//   achiCurrent.textContent = achiObj[key];
//   alist.appendChild(achiCurrent);
//   fieldA.value = '';
//   event.preventDefault();
// };

// document.getElementById('gReset').addEventListener('click', (e) => {
//   console.log("Reset click is working!");
//   objG = {};
//   objGState = {};
//   glist.innerHTML = "";
//   localStorage.setItem(idDateG,JSON.stringify(objG));
//   localStorage.setItem(idDateGS,JSON.stringify(objGState));
// });

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

addLoadEvent(OnStartUp);
addLoadEvent(activateDot);
window.addEventListener('scroll', throttle(activateDot));
