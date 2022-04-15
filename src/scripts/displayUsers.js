export function displayUsers(users) {
    const select = document.createElement('select');
    select.classList.add('card__user-choice');

    for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option');
        option.value = users[i].name;
        option.textContent = users[i].name;
        select.appendChild(option);
    }
    return select;
}