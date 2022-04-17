export async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();

    const sidebar_users = document.querySelector(".sidebar__filter-users");
    for (let k = 0; k < users.length; k++) {
        const sidebar_option = document.createElement('option');
        sidebar_option.classList.add("sidebar__option")
        sidebar_option.textContent = users[k].name;
        sidebar_users.appendChild(sidebar_option)
    }
    return users;
}