let alert = document.querySelector('.alert');
let form = document.querySelector('.grocery-form');
let grocery = document.getElementById('grocery');
let submitBtn = document.querySelector('.submit-btn');
let container = document.querySelector('.grocery-container');
let list = document.querySelector('.grocery-list');
let clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
document.addEventListener('DOMContentLoaded', loadFromSessionStorage);

function addItem(e) {
  e.preventDefault();
  let value = grocery.value.trim();
  let regex_patten = /^[A-Za-z]+$/;
  if (regex_patten.test(value) && value !== "") {
    let itemObj = { content: value };

    let items = JSON.parse(sessionStorage.getItem('grocery-list')) || [];
    items.push(itemObj);
    sessionStorage.setItem('grocery-list', JSON.stringify(items)); 

    addItemToStorage(itemObj);
    container.classList.add('show-container');
    displayAlert('add');
  } else {
    displayAlert('empty');
  }

  setBackToDefault();
}

function addItemToStorage(item) {
  let element = document.createElement('article');
  element.classList.add('grocery-item');
  element.innerHTML = `
    <p class="title">${item.content}</p>
    <div class="btn-container">
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
    </div>
  `;

  element.querySelector('.delete-btn').addEventListener('click', deleteItem);
  element.querySelector('.edit-btn').addEventListener('click', editItem);
  list.appendChild(element);
}

function loadFromSessionStorage() {
  let items = JSON.parse(sessionStorage.getItem('grocery-list')) || [];

  items.forEach(item => addItemToStorage(item));

  if (items.length > 0) {
    container.classList.add('show-container');
  }
}

function displayAlert(action) {
  switch (action) {
    case 'add':
      alert.textContent = 'Item added successfully';
      alert.classList.add('alert-success');
      break;
    case 'edit':
      alert.textContent = 'Item edited successfully';
      alert.classList.add('alert-success');
      break;
    case 'remove':
      alert.textContent = 'Item removed successfully';
      alert.classList.add('alert-danger');
      break;
    case 'empty':
      alert.textContent = 'Please enter a value';
      alert.classList.add('alert-danger');
      break;
    case 'clear':
      alert.textContent = 'All items cleared';
      alert.classList.add('alert-danger');
      break;
    default:
      alert.textContent = '';
      break;
  }

  setTimeout(() => {
    alert.textContent = '';
    alert.classList.remove('alert-success', 'alert-danger');
  }, 1500);
}

function clearItems() {
  list.innerHTML = "";
  sessionStorage.removeItem("grocery-list");
  container.classList.remove('show-container');
  displayAlert('clear');
}

function deleteItem(e) {
  let element = e.currentTarget.parentElement.parentElement;
  let items = JSON.parse(sessionStorage.getItem('grocery-list')) || [];
  let updatedItems = items.filter(item => item.content !== element.querySelector('.title').textContent);
  sessionStorage.setItem('grocery-list', JSON.stringify(updatedItems)); 

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }

  displayAlert('remove');
}

function editItem(e) {
  let element = e.currentTarget.parentElement.parentElement;
  grocery.value = element.querySelector('.title').textContent;
  submitBtn.textContent = "Edit";

  deleteItem(e);
  displayAlert('edit');
}

function setBackToDefault() {
  grocery.value = '';
  submitBtn.textContent = "Submit";
}

