// function prepCardStructure(callback) {
//   const section = document.createElement('section');
//   section.setAttribute('class', 'outter');
//   section.setAttribute('id', 'out');
//   section.innerHTML = `
//   <i class="fas mid fa-caret-left dbutton"></i>
//       <div class="container" id="sec">
//         <div class="card">
//           <div class="cardcard goal">
//             <div class="date">
//               <h4 id="gdate"></h4>
//             </div>
//             <div class="main">
//               <form onsubmit="return false">
//                 <label>
//                   <input id="gnew" type="text" name="input" placeholder=" Goals">
//                 </label>
//               </form>
//               <ol class = 'dragcontainer' id="glist"></ol>
//             </div>
//             <footer>
//               <i class="fas fa-bars grey normalbutton"></i>
//               <i class="fas fa-chevron-right grey normalbutton" id="gFlip"></i>
//               <i class="fas fa-trash grey trashbutton" title="Drag an item here to delete"></i>
//             </footer>
//           </div>
//           <div class="cardcard achi">
//             <div class="date">
//               <h4 id="adate"></h4>
//             </div>
//             <div class="main">
//               <form onsubmit="return false">
//                 <label>
//                   <input id="anew" type="text" name="input" placeholder=" Chores">
//                 </label>
//               </form>
//               <ol class = 'dragcontainer' id="alist"></ol>
//             </div>
//             <footer>
//             <i class="fas fa-bars grey normalbutton"></i>
//             <i class="fas fa-chevron-left grey normalbutton" id="aFlip"></i>
//             <i class="fas fa-trash grey trashbutton" title="Drag an item here to delete"></i>
//           </footer>
//           </div>
//         </div>
//       </div>
//       <i class="fas mid fa-caret-right dbutton"></i>
//   `;
//   let fragment = new DocumentFragment();
//   fragment.appendChild(section);
//   const scriptTag = document.getElementsByTagName('script')[0];
//   document.body.insertBefore(fragment, scriptTag);
//   callback();
// }

// When user click previous day button

// When user click next day button

// When user delete an entry (mobile)

// When user drag an entry

// When user edit an entry

// When user call the weekly goal 
