import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// Initialize Firebase (replace with your own configuration)
const firebaseConfig = {
    apiKey: "AIzaSyDC_cIVi_BfJmYEkEiWQsA6GAea6nJAcBg",
    authDomain: "todo-list-b3003.firebaseapp.com",
    projectId: "todo-list-b3003",
    storageBucket: "todo-list-b3003.appspot.com",
    messagingSenderId: "349349804975",
    appId: "1:349349804975:web:bcee1b2d4e604bedbb0d5a",
    databaseURL: "https://todo-list-b3003-default-rtdb.asia-southeast1.firebasedatabase.app",
};
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase();

// Load tasks from the database when the page loads
window.onload = function() {
    try {
        const tasksRef = ref(database, 'tasks');
        onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                clearTaskList(); // Clear existing task list
                Object.entries(data).forEach(([taskId, taskText]) => {
                    addTaskToList(taskText, taskId);
                });
            }
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
};

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        saveTaskToDatabase(taskText); // Save task to Firebase
        taskInput.value = ""; // Clear input field
    }
}

function addTaskToList(taskText, taskId) {
    const taskList = document.getElementById("taskList");
    const newTask = document.createElement("li");
    newTask.innerText = taskText;
    newTask.dataset.taskId = taskId; // Assign Firebase ID to dataset
    newTask.addEventListener("click", function() {
        deleteTask(taskId);
    });
    taskList.appendChild(newTask);
}

function saveTaskToDatabase(taskText) {
    const tasksRef = ref(database, 'tasks');
    push(tasksRef, taskText);
}

function deleteTask(taskId) {
    const taskRef = ref(database, `tasks/${taskId}`);
    remove(taskRef);
}

function clearTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ''; // Clear existing tasks
}

// Add event listener to the button when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", addTask);
});

// Open extension in a new tab when clicked on the browser action
browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({ url: "index.html" });
});
