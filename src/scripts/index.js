import '@babel/polyfill';
import { currentTime } from './time.js';
import { searchItems } from './search.js';
import { getUsers } from './users.js';
import * as bootstrap from 'bootstrap';

currentTime();
getUsers();
searchItems();

const addTaskBtn = document.querySelector('#AddTaskBtn');
const list_backlog = document.querySelector('#backlog_list');
const list_progress = document.querySelector('#in_progress_list');
const list_review = document.querySelector('#review_list');
const list_done = document.querySelector('#done_list');
const addBtn = document.querySelector('.form__add-btn');
const cancelBtn = document.querySelector('.form__cancel-btn');
const textArea = document.querySelector('.form__textarea');
const form = document.querySelector('.form');
const itemDel = document.querySelector('.card__delete');
const editBtn = document.querySelector('.card__edit');
const itemDesc = document.querySelector('.card__description');
const boardName = document.querySelector('.header__title');
const tasksList = document.querySelector('.board');
const backlog = document.getElementsByClassName('backlog_list');
const progress = document.getElementsByClassName('in_progress_list');
const review = document.getElementsByClassName('review_list');
const done = document.getElementsByClassName('done_list');
const userChoice = document.querySelector(".card__user-choice");

//локал сторидж

const BACKLOG_COL = "backlog_list"
const IN_PROGRESS_COL = "in_progress_list"
const REVIEW_COL = "review_list"
const DONE_COL = "done_list"
const COLUMN_IDS = [BACKLOG_COL, IN_PROGRESS_COL, REVIEW_COL, DONE_COL]

const tasks = localStorage.getItem('tasks') ?
    JSON.parse(localStorage.getItem('tasks')) : {
        [BACKLOG_COL]: [],
        [IN_PROGRESS_COL]: [],
        [REVIEW_COL]: [],
        [DONE_COL]: []
    };

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
updateLocalStorage();
displayTasks();


// создание задачи

function createTask(obj) {
    const card_el = document.createElement("article");
    card_el.classList.add("card");
    card_el.setAttribute('id', obj.id);
    card_el.draggable = true;

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("card__header");
    card_el.appendChild(task_content_el);

    const card_priority = document.createElement("select");
    card_priority.classList.add("card__priority");
    const optionLow = document.createElement("option");
    optionLow.innerText = 'Low';
    optionLow.classList.add("card__option-low");
    card_priority.appendChild(optionLow);
    const optionMedium = document.createElement("option");
    optionMedium.classList.add("card__option-medium");
    optionMedium.innerText = 'Medium';
    card_priority.appendChild(optionMedium);
    const optionHigh = document.createElement("option");
    optionHigh.innerText = 'High';
    optionHigh.classList.add("card__option-high");
    card_priority.appendChild(optionHigh);
    task_content_el.appendChild(card_priority);

    const editBtn = document.createElement("button");
    editBtn.classList.add("card__edit");
    editBtn.innerHTML = "Edit";
    task_content_el.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("card__delete");
    deleteBtn.innerHTML = "Delete";
    task_content_el.appendChild(deleteBtn);

    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card__title");
    cardTitle.textContent = obj.title;
    //cardTitle.contentEditable = true;
    card_el.appendChild(cardTitle);

    const cardDesc = document.createElement("p");
    cardDesc.classList.add("card__description");
    cardDesc.innerText = "Enter a description of the task.."
    cardDesc.contentEditable = true;
    card_el.appendChild(cardDesc);

    const footer = document.createElement("div");
    footer.classList.add("card__footer");
    card_el.appendChild(footer);

    const cardUser = document.createElement("select");
    cardUser.classList.add("card__user-choice");
    cardUser.value = obj.user;
    footer.appendChild(cardUser);

    const cardConfirm = document.createElement("div");
    cardConfirm.classList.add("card__confirmation");
    footer.appendChild(cardConfirm);

    const confirmBtn = document.createElement("button");
    confirmBtn.classList.add("card__confirm");
    confirmBtn.innerHTML = "Confirm";
    cardConfirm.appendChild(confirmBtn);

    const revokeBtn = document.createElement("button");
    revokeBtn.classList.add("card__confirm");
    revokeBtn.innerHTML = "Cancel";
    cardConfirm.appendChild(revokeBtn);

    if (obj.priority === "Low") {
        card_priority.value = "Low";
        card_priority.style.background = "b90000"
    } else if (obj.priority === "Medium") {
        card_priority.value = "Medium";
        card_priority.style.background = "#ccb034";
    } else if (obj.priority === "High") {
        card_priority.value = "High";
        card_priority.style.background = "#026b02";
    }

    return card_el;
}

function displayTasks() {
    COLUMN_IDS.forEach(id => {
        const columnEl = document.getElementById(id)
        columnEl.innerHTML = ''
        const columnTasks = tasks[id]
        columnTasks.forEach((item) => {
            columnEl.appendChild(createTask(item));
        });
    })
}

function addNewItem() {
    tasks[BACKLOG_COL].push({
        id: Date.now().toString(),
        board: boardName.innerHTML,
        title: textArea.value,
        comment: "",
        priority: 'low',
        status: "backlog",
        user: "Leanne Graham",
    });
    displayTasks();
    updateLocalStorage();
    getUsers();
    updateCounter();
    textArea.value = ''
    form.style.display = 'none';
    addTaskBtn.style.display = 'block';
}

addBtn.addEventListener('click', function() {
    addNewItem();
});

//Модальное окно ввода названия задачи

addTaskBtn.addEventListener('click', () => {
    form.style.display = 'block';
    addTaskBtn.style.display = 'none';
    addBtn.style.display = 'none';

    //Проверяем, если инпут пустой, тогда кнопку добавления прячем
    textArea.addEventListener('input', () => {
        if (textArea.value.trim()) {
            addBtn.style.display = 'block';
        } else {
            addBtn.style.display = 'none';
        }
    })
});

cancelBtn.addEventListener('click', () => {
    textArea.value = '';
    form.style.display = 'none';
    addTaskBtn.style.display = 'block';
});



//свитчер

const switchBtn = document.getElementById('switchBtn');
switchBtn.addEventListener("click", function() {
    document.body.classList.toggle("light")
});


// drag'n'drop

let draggedElement;
document.addEventListener('dragstart', (e) => {
    e.target.classList.add('selected');
    draggedElement = e.target;
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// функция для помещения тасок в новом положении в local storage
function moveTaskToNewColumn(sourceColumnId, targetColumnId, movedTaskId) {
    const movedTask = tasks[sourceColumnId].find(obj => obj.id === movedTaskId)
    tasks[sourceColumnId] = tasks[sourceColumnId].filter(obj => obj.id !== movedTask.id)
    movedTask.status = targetColumnId
    const columnCardElements = document.getElementById(targetColumnId).querySelectorAll('.card');
    const taskIdx = Array.from(columnCardElements).findIndex(card => card.id === movedTaskId)
    tasks[targetColumnId].splice(taskIdx, 0, movedTask)
    updateLocalStorage();
    updateCounter();
}

// само перетаскивание либо между задачами, либо между колонками

document.addEventListener('drop', (e) => {
    e.preventDefault();

    const activeElement = document.querySelector('.selected');
    const currentElement = e.target;
    const currentCard = currentElement.closest('.card');
    const activeTaskList = activeElement.closest('.board__tasks-list');
    const currentTaskList = currentElement.closest('.board__tasks-list');

    if (currentTaskList === null) {
        draggedElement.classList.remove('selected');
        return;
    }

    const isHoverAnotherCard = currentCard !== null &&
        activeElement !== currentCard;

    if (isHoverAnotherCard) {
        if (isCardHigher(e.clientY, currentCard)) {
            currentTaskList.insertBefore(activeElement, currentCard);
        } else {
            currentTaskList.insertBefore(currentCard, activeElement);
        }
    } else {
        activeTaskList.removeChild(activeElement);
        currentTaskList.appendChild(activeElement);
    }

    draggedElement.classList.remove('selected');
    window.setTimeout(() => {
        draggedElement.classList.add('isMoved');
    }, 100);
    window.setTimeout(() => {
        draggedElement.classList.remove('isMoved');
    }, 500);

    //displayModal();

    // добавление изменения положения элементов в local storage

    moveTaskToNewColumn(activeTaskList.id, currentTaskList.id, activeElement.id);

});

const isCardHigher = (cursorPosition, currentCard) => {
    const { height, y } = currentCard.getBoundingClientRect();
    const currentElementCenter = y + height / 2;
    //const nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
    return (cursorPosition < currentElementCenter);
}


//удаление задачи

function deleteTask(element) {
    if (element.target.classList.contains("card__delete")) {
        let taskItem = element.target.parentElement.parentElement;
        let taskId = taskItem.getAttribute("id");
        taskItem.remove();

        tasks[BACKLOG_COL].forEach((item, index) => {
            if (taskId === item.id) {
                tasks[BACKLOG_COL].splice(index, 1);
            }
        });
        tasks[IN_PROGRESS_COL].forEach((item, index) => {
            if (taskId === item.id) {
                tasks[IN_PROGRESS_COL].splice(index, 1);
            }
        });
        tasks[REVIEW_COL].forEach((item, index) => {
            if (taskId === item.id) {
                tasks[REVIEW_COL].splice(index, 1);
            }
        });
        tasks[DONE_COL].forEach((item, index) => {
            if (taskId === item.id) {
                tasks[DONE_COL].splice(index, 1);
            }
        });
        updateLocalStorage();
        updateCounter();
    }
};

tasksList.addEventListener('click', deleteTask);

//select priority

function drawPriority(element) {
    if (element.target.classList.contains("card__priority")) {
        let taskItem = element.target.parentElement.parentElement;
        let taskId = taskItem.getAttribute("id");
        if (element.target.value === "Medium") {
            element.target.style.background = "#ccb034"
        } else if (element.target.value === "High") {
            element.target.style.background = "#026b02"
        } else {
            element.target.style.background = "#b90000"
        }

        tasks[BACKLOG_COL].forEach((item) => {
            if (taskId === item.id) {
                item.priority = element.target.value;
            }
        });
        tasks[IN_PROGRESS_COL].forEach((item) => {
            if (taskId === item.id) {
                item.priority = element.target.value;
            }
        });
        tasks[REVIEW_COL].forEach((item) => {
            if (taskId === item.id) {
                item.priority = element.target.value;
            }
        });
        tasks[DONE_COL].forEach((item) => {
            if (taskId === item.id) {
                item.priority = element.target.value;
            }
        });
        updateLocalStorage();
    }
};

tasksList.addEventListener('change', drawPriority);

//select users

function drawUsers(element) {
    if (element.target.classList.contains("card__user-choice")) {
        let taskItem = element.target.parentElement.parentElement;
        let taskId = taskItem.getAttribute("id");

        tasks[BACKLOG_COL].forEach((item) => {
            if (taskId === item.id) {
                item.user = element.target.value;
            }
        });
        tasks[IN_PROGRESS_COL].forEach((item) => {
            if (taskId === item.id) {
                item.user = element.target.value;
            }
        });
        tasks[REVIEW_COL].forEach((item) => {
            if (taskId === item.id) {
                item.user = element.target.value;
            }
        });
        tasks[DONE_COL].forEach((item) => {
            if (taskId === item.id) {
                item.user = element.target.value;
            }
        });
        updateLocalStorage();
    }
};

tasksList.addEventListener('change', drawUsers);


/*modal windows 1

function getModal() {
    const elemModal = document.querySelector('#modal');
    const modal = new bootstrap.Modal(elemModal);
    modal.show();
}

function displayModal() {
    if (tasks[IN_PROGRESS_COL].length > 5) {
        getModal();
    }
}
displayModal();*/

//btn delete all tasks + modal windows 2

document.addEventListener('DOMContentLoaded', function() {

    const btn = document.querySelector('#DeleteAllTasks');
    const modal = new bootstrap.Modal(document.querySelector('#modalDeleteAll'));
    btn.addEventListener('click', function() {
        modal.show();
    });
});

const btnDeleteAllTasks = document.querySelector('.btn-primary');

const deleteAll = () => {
    tasks[BACKLOG_COL] = [];
    tasks[IN_PROGRESS_COL] = [];
    tasks[REVIEW_COL] = [];
    tasks[DONE_COL] = [];
    list_backlog.innerHTML = '';
    list_progress.innerHTML = '';
    list_review.innerHTML = '';
    list_done.innerHTML = '';
    updateLocalStorage();
    updateCounter();
};

btnDeleteAllTasks.addEventListener('click', deleteAll);

//counter

const backlogCount = document.querySelector('.backlog-count');
const inprogressCount = document.querySelector('.inprogress-count');
const reviewCount = document.querySelector('.review-count');
const doneCount = document.querySelector('.done-count');

function updateCounter() {
    backlogCount.innerHTML = tasks[BACKLOG_COL].length;
    inprogressCount.innerHTML = tasks[IN_PROGRESS_COL].length;
    reviewCount.innerHTML = tasks[REVIEW_COL].length;
    doneCount.innerHTML = tasks[DONE_COL].length;
}
updateCounter();


//userfilter

const filterSelect = document.querySelector(".sidebar__filter-users");

function filterUser(){
    const allCardsUser = document.querySelectorAll(".card__user-choice");
    for (let i = 0; i < allCardsUser.length; i++){
        if (filterSelect.value !== "Show all"){
            if(allCardsUser[i].value !== filterSelect.value){
                allCardsUser[i].parentElement.parentElement.style.display = "none"
            } else if (allCardsUser[i].value === filterSelect.value){
                allCardsUser[i].parentElement.parentElement.style.display = "block"
            }
    } else {
        allCardsUser[i].parentElement.parentElement.style.display = "block"
    }
    }
}
filterSelect.addEventListener("change", filterUser);

//priorityfilter

const filterPr = document.querySelector(".sidebar__filter-priority");

function filterPriority(){
    const allCardsPr = document.querySelectorAll(".card__priority");
    for (let i = 0; i < allCardsPr.length; i++){
        if (filterPr.value !== "Show all"){
            if(allCardsPr[i].value !== filterPr.value){
                allCardsPr[i].parentElement.parentElement.style.display = "none"
            } else if (allCardsPr[i].value === filterPr.value){
                allCardsPr[i].parentElement.parentElement.style.display = "block"
            }
    } else {
        allCardsPr[i].parentElement.parentElement.style.display = "block"
    }
    }
}
filterPr.addEventListener("change", filterPriority);