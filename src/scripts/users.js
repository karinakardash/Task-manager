export async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    console.log(users);
    const select = document.createElement('select');
    select.classList.add('card__user-choice');

    for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option');
        option.value = users[i].name;
        option.textContent = users[i].name;
        select.appendChild(option);
    }
    let listOfUsers = document.querySelectorAll('.card__user');

    listOfUsers.forEach(function (el, index) {
        el.appendChild(select);
      });
}