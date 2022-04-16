export function searchItems() {
   const searchInput = document.querySelector('#searchInput');
   searchInput.oninput = function () {
      let value = this.value.trim();
      let task = document.querySelectorAll('.card__title');
   
      if (value != '') {
         task.forEach(elem => {
            if (elem.innerText.search(value) == -1) {
               elem.parentElement.classList.add('hide');
            }
         });
      } else {
         task.forEach(elem => {
            elem.parentElement.classList.remove('hide');
         });
      }
   }
}
