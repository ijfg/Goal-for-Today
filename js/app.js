const glist = document.getElementById('glist');
const alist = document.getElementById('alist');
let idDateG;
let idDateA

function setDate(){
  let d = new Date();
  let month = d.getMonth() + 1;
  idDateG = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'G';
  idDateA = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'A';
  let newDate = month +'.'+ d.getDate()+'.'+ d.getFullYear();
  const goalDate = document.getElementById('gdate');
  const achiDate = document.getElementById('adate');
  goalDate.innerHTML = newDate;
  const goalCard = goalDate.closest('.card');
  // goalCard.addEventListener('scroll', throttle(activateDot));
  goalCard.setAttribute('id', idDateG)
  achiDate.innerHTML = newDate;
  const achiCard = achiDate.closest('.card');
  achiCard.setAttribute('id', idDateA);
  checkGoals();
  checkAchievements();
  prepareDotDisplay();
};

function checkGoals(){
  if(localStorage.getItem(idDateG)){
    objG = JSON.parse(localStorage.getItem(idDateG));
    for (const goal of Object.values(objG)) {
      const liSet = document.createElement('li');
      liSet.textContent = goal;
      liSet.addEventListener('mousedown',(e) => {
        if (e.detail> 1) {
          e.preventDefault();
        };
      });
      liSet.addEventListener('dblclick',(e) => {
        console.log('dblclick is working!');
        e.target.classList.toggle('crossOut');
      });
      glist.appendChild(liSet);
    };
  };
};

function checkAchievements(){
  if(localStorage.getItem(idDateA)){
    objA = JSON.parse(localStorage.getItem(idDateA));
    for (const achievment of Object.values(objA)) {
      const achiSet = document.createElement('li');
      achiSet.textContent = achievment;
      alist.appendChild(achiSet);
    };
  };
};

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


let objG = {};
let objA = {};
let newGoal;
let newAchi;
const fieldG = document.getElementById('gnew');
const fieldA = document.getElementById('anew');

document.getElementById('gnew').addEventListener('change', performActionG);
document.getElementById('anew').addEventListener('change', performActionA);

function performActionG(event) {
  newGoal = fieldG.value;
  const key = Object.keys(objG).length + 1;
  objG[key] = newGoal;
  localStorage.setItem(idDateG,JSON.stringify(objG));
  const goalObj = JSON.parse(localStorage.getItem(idDateG));
  const liCurrent = document.createElement('li');
  liCurrent.textContent = goalObj[key];
  liCurrent.addEventListener('mousedown',(e) => {
    if (e.detail> 1) {
      e.preventDefault();
    };
  });
  liCurrent.addEventListener('dblclick', (e) => {
    console.log('dblclick is working!');
    e.target.classList.toggle('crossOut');
  });
  glist.appendChild(liCurrent);
  fieldG.value = '';
  event.preventDefault();
};

function performActionA(event) {
  newAchi = fieldA.value;
  const key = Object.keys(objA).length + 1;
  objA[key] = newAchi;
  localStorage.setItem(idDateA,JSON.stringify(objA));
  const achiObj = JSON.parse(localStorage.getItem(idDateA));
  const achiCurrent = document.createElement('li');
  achiCurrent.textContent = achiObj[key];
  alist.appendChild(achiCurrent);
  fieldA.value = '';
  event.preventDefault();
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

addLoadEvent(setDate);
addLoadEvent(activateDot);
window.addEventListener('scroll', throttle(activateDot));
