function setDate(){
  let d = new Date();
  let month = d.getMonth() + 1;
  let newDate = month +'.'+ d.getDate()+'.'+ d.getFullYear();
  document.getElementById('date').innerHTML = newDate;
  console.log(newDate);
}

document.getElementById('form').addEventListener('submit', performAction);

function performAction(event) {
  console.log(event);
  document.getElementById('one').textContent = `${event.timeStamp}`;
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