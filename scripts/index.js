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
    document.cookie = `SESSION_ID=${UUID}`;
} else {
    UUID = `; ${document.cookie}`.split('; SESSION_ID=')[1];
}
const shoppingListInDB = ref(database, `shoppingList/${UUID}`);


const addBtnEl = document.getElementById('add-button');
const inputEl = document.getElementById('input-field');
const shoppingListEl = document.getElementById('shopping-list');

addBtnEl.addEventListener('click', () => {
    let inputValue = inputEl.value;
    if (inputValue) {
        push(shoppingListInDB, inputValue);
        clearInputEl(inputEl);
    }
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