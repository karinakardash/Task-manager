export async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    console.log(users);

    const listOfUsers = document.querySelectorAll('.card__user-choice');
    for (let j = 0 ; j < listOfUsers.length; j++) {
        for (let i = 0; i < users.length; i++) {
            const option = document.createElement('option');
            option.classList.add("card__user-option")
            option.value = users[i].name;
            option.textContent = users[i].name;
            listOfUsers[j].appendChild(option)
        }
    }

    const sidebar_users = document.querySelector(".sidebar__filter-users");
    for (let k = 0; k < users.length; k++) {
        const sidebar_option = document.createElement('option');
        sidebar_option.classList.add("sidebar__option")
        sidebar_option.textContent = users[k].name;
        sidebar_users.appendChild(sidebar_option)
    }
}