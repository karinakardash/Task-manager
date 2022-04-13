const backlog = document.getElementsByClassName('backlog-count');
const inprogress = document.getElementsByClassName('inprogress-count');
const review = document.getElementsByClassName('review-count');
const done = document.getElementsByClassName('done-count');

function updateCounter() {
   backlog.innerHTML = backlog.length;
   inprogress.innerHTML = inprogress.length;
   review.innerHTML = review.length;
   done.innerHTML = done.length;
}
updateCounter();