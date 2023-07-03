import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from
        'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://lanot-fd1d0-default-rtdb.europe-west1.firebasedatabase.app/'
}
const app = initializeApp(appSettings);
const database = getDatabase(app);
let UUID = null;
if ( !document.cookie.split(';').some(c => {
        return c.trim().startsWith('SESSION_ID' + '=');})) {
    UUID = window.crypto.randomUUID();
    let date = new Date();
    let days = 400;
    date.setTime(+ date + (days * 86400000));
    document.cookie = `SESSION_ID=${UUID}; expires=${date.toGMTString()}`;
} else {
    UUID = `; ${document.cookie}`.split('; SESSION_ID=')[1];
}
const shoppingListInDB = ref(database, `shoppingList/${UUID}`);

const infoButtonEl = document.getElementById('info');
const infoModalWindowEl = document.getElementById('modal-window-info');
const addBtnEl = document.getElementById('add-button');
const inputEl = document.getElementById('input-field');
const shoppingListEl = document.getElementById('shopping-list');

infoModalWindowEl.addEventListener('click', () => {
    infoModalWindowEl.classList.remove('active');
    document.querySelector("html").style.overflowY = "auto";
});
infoButtonEl.addEventListener('click', (e) => {
    infoModalWindowEl.classList.add('active');
    document.querySelector("html").style.overflowY = "hidden";
});
addBtnEl.addEventListener('click', () => addItem());
inputEl.addEventListener('keydown', e => {
    if (e.code === 'Enter') addItem();
});

onValue(shoppingListInDB, snapshot => {
    if (snapshot.exists()) {
        let shoppingItems = Object.entries(snapshot.val());

        clearElement(shoppingListEl);

        for (let i = 0; i < shoppingItems.length; i++) {
            const currentItem = shoppingItems[i];
            appendItemToList(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = 'Список пока пуст :(';
    }
});

const addItem = () => {
    let inputValue = inputEl.value;
    if (inputValue) {
        push(shoppingListInDB, inputValue);
        clearInputEl(inputEl);
    }
}
const clearInputEl = element => element.value = '';

const clearElement = element => element.innerHTML = '';

const appendItemToList = item => {
    const itemID = item[0];
    const itemValue = item[1];

    const newEl = document.createElement('li');
    newEl.innerText = itemValue;
    newEl.addEventListener('dblclick', () => {
       const exactLocationOfItemInDB = ref(database, `shoppingList/${UUID}/${itemID}`);
       remove(exactLocationOfItemInDB);
    });

    shoppingListEl.append(newEl);
}