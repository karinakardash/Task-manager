export function updateCounter() {
    const backlogCount = document.querySelector('.backlog-count');
    const inprogressCount = document.querySelector('.inprogress-count');
    const reviewCount = document.querySelector('.review-count');
    const doneCount = document.querySelector('.done-count');
    
    backlogCount.innerHTML = backlog.length;
    inprogressCount.innerHTML = progress.length;
    reviewCount.innerHTML = review.length;
    doneCount.innerHTML = done.length;
}