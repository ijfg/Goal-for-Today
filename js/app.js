const glist = document.getElementById('glist');
let idDateG;

function setDate(){
  let d = new Date();
  let month = d.getMonth() + 1;
  idDateG = month.toString() + d.getDate().toString() + d.getFullYear().toString() + 'G';
  let newDate = month +'.'+ d.getDate()+'.'+ d.getFullYear();
  document.getElementById('gdate').innerHTML = newDate;
  checkGoals();
};

function checkGoals(){
  if(localStorage.getItem(idDateG)){
    obj = JSON.parse(localStorage.getItem(idDateG));
    for (const goal of Object.values(obj)) {
      const liSet = document.createElement('li');
      liSet.textContent = goal;
      glist.appendChild(liSet);
    };
  };
};

let obj = {};
let newGoal;
const field = document.getElementById('gnew');

document.getElementById('gnew').addEventListener('change', performAction);

function performAction(event) {
  newGoal = field.value;
  const key = Object.keys(obj).length + 1;
  obj[key] = newGoal;
  localStorage.setItem(idDateG,JSON.stringify(obj));
  const goalObj = JSON.parse(localStorage.getItem(idDateG));
  const liCurrent = document.createElement('li');
  liCurrent.textContent = goalObj[key];
  glist.appendChild(liCurrent);
  field.value = '';
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