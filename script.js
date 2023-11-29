document.addEventListener('DOMContentLoaded', function () {
    const apikey = '8ea60a91-2786-4d01-9c8f-e6732efbac01';
    const apiUrl = 'https://js1-todo-api.vercel.app/api/todos';

    const inputBox = document.getElementById('input-box');
    const addButton = document.getElementById('addButton');
    const listContainer = document.getElementById('list-container');

    function getTodos() {
        fetch(`${apiUrl}?apikey=${apikey}`)
            .then(response => response.json())
            .then(todos => renderTodos(todos))
            .catch(error => console.error('Error fetching todos:', error));
    }

    function addTodo(title) {
        fetch(`${apiUrl}?apikey=${apikey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title }),
        })
            .then(response => response.json())
            .then(newTodo => {
                renderTodo(newTodo);
            })
            .catch(error => console.error('Error adding todo:', error));
    }

    function deleteTodo(todoId) {
        fetch(`${apiUrl}/${todoId}?apikey=${apikey}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    removeTodoElement(todoId);
                } else {
                    console.error('Error deleting todo:', response.status);
                }
            })
            .catch(error => console.error('Error deleting todo:', error));
    }

    function getTodoById(todoId) {
        const todoUrl = `${apiUrl}/${todoId}?apikey=${apikey}`;

        fetch(todoUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    throw new Error('Todo not found');
                } else {
                    throw new Error('Error fetching todo');
                }
            })
            .then(todo => {
                console.log(todo);
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    function toggleTodoStatus(event, todoId) {
        fetch(`${apiUrl}/${todoId}?apikey=${apikey}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !event.currentTarget.classList.contains('checked') }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error updating todo status');
                }
            })
            .then(updatedTodo => {
                updateTodoElement(updatedTodo);
            })
            .catch(error => console.error('Error updating todo status:', error));
    }

    function renderTodo(todo) {
        const li = document.createElement('li');
        li.textContent = todo.title;
        li.id = todo._id;

      
        const closeIcon = document.createElement('span');
        closeIcon.textContent = 'x';
        closeIcon.className = 'close-icon';
        closeIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            deleteTodo(todo._id);
        });

        li.appendChild(closeIcon);

        li.addEventListener('click', function (event) {
            toggleTodoStatus(event, todo._id);
        });

        updateTodoElementStyle(li, todo.completed);

        listContainer.appendChild(li);
    }

    function renderTodos(todos) {
        todos.forEach(todo => renderTodo(todo));
    }

    // ...

function updateTodoElement(updatedTodo) {
    const todoElement = document.getElementById(updatedTodo._id);
    if (todoElement) {
        const textContent = document.createTextNode(updatedTodo.title);
        todoElement.innerHTML = '';

        
        todoElement.appendChild(textContent);

        
        const closeIcon = document.createElement('span');
        closeIcon.textContent = 'x';
        closeIcon.className = 'close-icon';
        closeIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            deleteTodo(updatedTodo._id);
        });

        todoElement.appendChild(closeIcon);

       
        updateTodoElementStyle(todoElement, updatedTodo.completed);
    }
}



    function updateTodoElementStyle(todoElement, completed) {
        if (completed) {
            todoElement.classList.add('checked');
        } else {
            todoElement.classList.remove('checked');
        }
    }

    function removeTodoElement(todoId) {
        const todoElement = document.getElementById(todoId);
        if (todoElement) {
            todoElement.remove();
        }
    }

    addButton.addEventListener('click', function () {
        const todoTitle = inputBox.value.trim();

        if (todoTitle !== '') {
            addTodo(todoTitle);
            inputBox.value = '';
        } else {
            alert('Fyll i en text för att lägga till en Todo.');
        }
    });

    getTodos();

    listContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            toggleTodoStatus(event, event.target.id);
        }
    });
});
