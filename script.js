document.addEventListener("DOMContentLoaded", function () {
    const listTitleInput = document.getElementById("listTitleInput");
    const addListBtn = document.getElementById("addListBtn");
    const listsContainer = document.getElementById("listsContainer");

    loadLists();

    addListBtn.addEventListener("click", function () {
        const listTitle = listTitleInput.value.trim();
        if (listTitle === "") {
            alert("Please enter a list title.");
            return;
        }

        createTodoList(listTitle);
        listTitleInput.value = "";
        saveListsToLocalStorage();
    });

    function createTodoList(title, tasks = []) {
        const listDiv = document.createElement("div");
        listDiv.classList.add("todo-list");

        const listTitle = document.createElement("h3");
        listTitle.textContent = title;

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Enter a task";

        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "Add Task";

        const deleteAllBtn = document.createElement("button");
        deleteAllBtn.textContent = "Delete All Tasks";

        const deleteListBtn = document.createElement("button");
        deleteListBtn.textContent = "Delete List";
        deleteListBtn.classList.add("delete-list-btn");

        const taskList = document.createElement("ul");

        listDiv.appendChild(listTitle);
        listDiv.appendChild(taskInput);
        listDiv.appendChild(addTaskBtn);
        listDiv.appendChild(deleteAllBtn);
        listDiv.appendChild(deleteListBtn);
        listDiv.appendChild(taskList);
        listsContainer.appendChild(listDiv);

        tasks.forEach(task => addTaskToList(taskList, task.text, task.completed));

        addTaskBtn.addEventListener("click", function () {
            const taskText = taskInput.value.trim();
            if (taskText === "") {
                alert("Please enter a task.");
                return;
            }
            addTaskToList(taskList, taskText, false);
            taskInput.value = "";
            saveListsToLocalStorage();
        });

        deleteAllBtn.addEventListener("click", function () {
            taskList.innerHTML = "";
            saveListsToLocalStorage();
        });

        deleteListBtn.addEventListener("click", function () {
            listDiv.remove();
            saveListsToLocalStorage();
        });
    }

    function addTaskToList(taskList, taskText, completed) {
        const taskItem = document.createElement("li");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        if (completed) {
            taskSpan.classList.add("completed");
        }

        editBtn.addEventListener("click", function () {
            if (editBtn.textContent === "Edit") {
                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.value = taskSpan.textContent;

                taskItem.replaceChild(inputField, taskSpan);
                inputField.focus();
                editBtn.textContent = "Save";

                checkbox.checked = false;
                taskSpan.classList.remove("completed");

                inputField.addEventListener("blur", function () {
                    taskSpan.textContent = inputField.value.trim() || taskSpan.textContent;
                    taskItem.replaceChild(taskSpan, inputField);
                    editBtn.textContent = "Edit";
                    saveListsToLocalStorage();
                });

                inputField.addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {
                        inputField.blur();
                    }
                });
            }
        });

        deleteBtn.addEventListener("click", function () {
            taskItem.remove();
            saveListsToLocalStorage();
        });

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                taskSpan.classList.add("completed");
            } else {
                taskSpan.classList.remove("completed");
            }
            saveListsToLocalStorage();
        });

        saveListsToLocalStorage();
    }

    function saveListsToLocalStorage() {
        const lists = [];
        document.querySelectorAll(".todo-list").forEach(listDiv => {
            const listTitle = listDiv.querySelector("h3").textContent;
            const tasks = [];
            listDiv.querySelectorAll("li").forEach(taskItem => {
                const taskText = taskItem.querySelector("span").textContent;
                const completed = taskItem.querySelector("input[type='checkbox']").checked;
                tasks.push({ text: taskText, completed: completed });
            });
            lists.push({ title: listTitle, tasks: tasks });
        });
        localStorage.setItem("todoLists", JSON.stringify(lists));
    }

    function loadLists() {
        const savedLists = JSON.parse(localStorage.getItem("todoLists")) || [];
        savedLists.forEach(list => createTodoList(list.title, list.tasks));
    }
});
