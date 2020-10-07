const list = document.getElementById('glist');
let idDate;

function setDate(){
  let d = new Date();
  let month = d.getMonth() + 1;
  idDate = month.toString() + d.getDate().toString() + d.getFullYear().toString();
  let newDate = month +'.'+ d.getDate()+'.'+ d.getFullYear();
  document.getElementById('date').innerHTML = newDate;
  checkGoals();
};

function checkGoals(){
  if(localStorage.getItem(idDate)){
    obj = JSON.parse(localStorage.getItem(idDate));
    // i = obj.length;
    for (const goal of Object.values(obj)) {
      const liSet = document.createElement('li');
      liSet.textContent = goal;
      list.appendChild(liSet);
    };
  };
};

let obj = {};
let newGoal;
const field = document.getElementById('new');
// let i = 0;

document.getElementById('form').addEventListener('submit', performAction);

function performAction(event) {
  newGoal = field.value;
  const key = Object.keys(obj).length + 1;
  obj[key] = newGoal;
  localStorage.setItem(idDate,JSON.stringify(obj));
  const goalObj = JSON.parse(localStorage.getItem(idDate));
  const liCurrent = document.createElement('li');
  liCurrent.textContent = goalObj[key];
  list.appendChild(liCurrent);
  // i += 1;
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