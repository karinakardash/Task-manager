import { currentTime } from './time.js';
currentTime()

import { getUsers } from './users.js';
getUsers()

const switchBtn = document.getElementById('switchBtn');
switchBtn.addEventListener ("click", function() {
   document.body.classList.toggle("light")
});