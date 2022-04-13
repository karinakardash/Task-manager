const addTaskBtn = document.querySelector('#AddTaskBtn');
const list_el = document.querySelector('#tasks');
const addBtn = document.querySelector('.form__add-btn');
const cancelBtn = document.querySelector('.form__cancel-btn');
const textArea = document.querySelector('.form__textarea');
const form = document.querySelector('.form');
const itemDel = document.querySelector('.card__delete');
const editBtn = document.querySelector('.card__edit');
const itemDesc = document.querySelector('.card__description');
const boardName = document.querySelector('.header__title');
const searchInput = document.querySelector('#searchInput');

import { currentTime } from './time.js';
currentTime()

import { getUsers } from './users.js';
getUsers()

import * as bootstrap from 'bootstrap';

//локал сторидж

let tasks;

if (localStorage.tasks === tasks) {
   tasks = [];
} else {
   tasks = JSON.parse(localStorage.getItem('tasks'));
   displayTask();
};

function updateLocalStorage() {
   localStorage.setItem('tasks', JSON.stringify(tasks));
}
updateLocalStorage();

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

    const cardUser = document.createElement("div");
    cardUser.classList.add("card__user");
    cardUser.textContent = '+';
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
    } else if (obj.priority === "Medium"){
        card_priority.value = "Medium";
        card_priority.style.background = "#ccb034";
    } else if (obj.priority === "High"){
        card_priority.value = "High";
        card_priority.style.background = "#026b02";
    }

    return card_el;
};

function displayTask() {
   list_el.innerHTML = '';

   tasks.forEach((item) => {
      list_el.appendChild(createTask(item));
   });
};

function addNewItem() {
   tasks.push({
      id: Date.now(),
      board: boardName.innerHTML,
      title: textArea.value,
      comment: "",
      priority: 'low',
      status: "backlog",
      user: "",
   });
   displayTask();
   updateLocalStorage();
   getUsers();
   textArea.value = ''
   form.style.display = 'none';
   addTaskBtn.style.display = 'block';
};

addBtn.addEventListener('click', function () {
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


import { searchItems } from './search.js';
searchItems()

//свитчер

const switchBtn = document.getElementById('switchBtn');
switchBtn.addEventListener("click", function () {
   document.body.classList.toggle("light")
});

//удаление задачи

function deleteTask(element) {
   if (element.target.classList.contains("card__delete")) {
      let taskItem = element.target.parentElement.parentElement;
      let taskId = +taskItem.getAttribute("id");
      taskItem.remove();

      tasks.forEach((item, index) => {
         if (taskId === item.id) {
            tasks.splice(index, 1);
         }
      });
      updateLocalStorage();
   }
};

list_el.addEventListener('click', deleteTask);

//select priority

function drawPriority(element) {
   if (element.target.classList.contains("card__priority")) {
      let taskItem = element.target.parentElement.parentElement;
      let taskId = +taskItem.getAttribute("id");
      if (element.target.value === "Medium") {
         element.target.style.background = "#ccb034"
      } else if (element.target.value === "High") {
         element.target.style.background = "#026b02"
      } else {
         element.target.style.background = "#b90000"
      }

      tasks.forEach((item) => {
         if (taskId === item.id) {
            item.priority = element.target.value;
         }
      });
      updateLocalStorage();
   }
};

list_el.addEventListener('change', drawPriority);

//modal windows 1

function getModal() {
   const elemModal = document.querySelector('#modal');
   const modal = new bootstrap.Modal(elemModal);
   modal.show();
}

let status = "backlog"

tasks.forEach((item) => {
   if (item.status === status) {
      getModal()
   }
});


//btn delete all tasks + modal windows 2

document.addEventListener('DOMContentLoaded', function () {

   const btn = document.querySelector('#DeleteAllTasks');
   const modal = new bootstrap.Modal(document.querySelector('#modalDeleteAll'));
   btn.addEventListener('click', function () {
      modal.show();
   });
});

const btnDeleteAllTasks = document.querySelector('.btn-primary');

const deleteAll = () => {
   tasks = [];
   list_el.innerHTML = '';
   updateLocalStorage();
};

btnDeleteAllTasks.addEventListener('click', deleteAll);


