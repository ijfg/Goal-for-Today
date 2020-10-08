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
  document.getElementById('gdate').innerHTML = newDate;
  document.getElementById('adate').innerHTML = newDate;
  checkGoals();
  checkAchievements();
};

function checkGoals(){
  if(localStorage.getItem(idDateG)){
    objG = JSON.parse(localStorage.getItem(idDateG));
    for (const goal of Object.values(objG)) {
      const liSet = document.createElement('li');
      liSet.textContent = goal;
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

addLoadEvent(setDate);