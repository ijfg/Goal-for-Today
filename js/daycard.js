function DayCard () {
  this.id = 
  this.goals = [];

}

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

// On startup
function onStartUp(){
  // Create today's day ID
  let d = new Date();
  const idToday = turnToId(d);
  // Display date on DOM card
  const dateBlanks = document.querySelectorAll('h4');
  // On both goal and achievement sides
  for (const blank of dateBlanks) {
    blank.textContent = idToday;
  }
  // Load previous entries
  prepCard(idToday);
};

function prepCard(idDate) {
  // If previous entries exist
  if (localStorage.getItem('daycards')) {
    let dataLS = JSON.parse(localStorage.getItem('daycards'));
    let entries = dataLS[idDate];
    for (let i = 0; i < entries.length; i++) {
      const liSet = document.createElement('li');
      // Load content
      liSet.textContent = entry[i]['text'];
      // Mark state
      if (entry.isDone) {
        liSet.classList.toggle('crossOut');
      };
      // Prevent default action
      liSet.addEventListener('mousedown',(e) => {
        if (e.detail> 1) {
          e.preventDefault();
        };
      });
      // Activate doubleclick listener
      liSet.addEventListener('dblclick',(e) => {
        e.target.classList.toggle('crossOut');
        entry.isDone = !entry.isDone;
        localStorage.setItem('daycards', JSON.stringify(dataLS));
      });
      // If it's a goal, display on goal side
      if (entry.isGoal) {
        document.getElementById('glist').appendChild(liSet);
      } else {
        // If not, display on achievement side
        document.getElementById('alist').appendChild(liSet);
      }
    }
  };
  // Flip front to back event listner
  document.getElementById('gFlip').addEventListener('click', (e) => {
    document.getElementById('sec').classList.toggle('flip');
  });
  // Flip back to front event listner
  document.getElementById('aFlip').addEventListener('click', (e) => {
    document.getElementById('sec').classList.toggle('flip');
  });
  // When click previous day button
  
  // When click next day button

  // Setup input field
  document.getElementById('gnew').addEventListener('change', (e) => {
    inputHandler(idDate)});
}

function inputHandler(idDate) {

};

addLoadEvent(onStartUp);
  

// Check if there are any entries for today's card
// If yes, load and display on DOM
// If not, set up the blank card with all listeners

// When user click previous day button

// When user click next day button

// When user enter a goal entry

// When user enter an achievement entry

// When user mark a goal achieved

// When user delete an entry

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 

