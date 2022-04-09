export function searchItems() {
   searchInput.oninput = function () {
      let value = this.value.trim();
      let task = document.querySelectorAll('.card__title');
   
      if (value != '') {
         task.forEach(elem => {
            if (elem.innerText.search(value) == -1) {
               elem.classList.add('hide');
            }
         });
      } else {
         task.forEach(elem => {
            elem.classList.remove('hide');
         });
      }
   }
}
