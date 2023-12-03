// Vänta tills dokumentet har laddats
document.addEventListener('DOMContentLoaded', function () {
    // API-nyckel och URL för att hämta och hantera todos
    const apikey = '8ea60a91-2786-4d01-9c8f-e6732efbac01';
    const apiUrl = 'https://js1-todo-api.vercel.app/api/todos';

    // Hämta DOM-element
    const inputBox = document.getElementById('input-box');
    const addButton = document.getElementById('addButton');
    const listContainer = document.getElementById('list-container');
    const customModal = document.getElementById('customModal');
    const customModalMessage = document.getElementById('custom-modal-message');
    const customModalClose = document.querySelector('.custom-modal-close');

    // Funktion för att hämta todos från API
    function getTodos() {
        fetch(`${apiUrl}?apikey=${apikey}`)
            .then(response => response.json())
            .then(todos => renderTodos(todos))
            .catch(error => console.error('Error fetching todos:', error));
    }

    // Funktion för att lägga till en ny todo
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

    // Funktion för att ta bort en todo
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

    // Funktion för att hantera borttagning av todos
    function handleDelete(todoId, completed) {
        if (!completed) {
            showCustomModal('Kan inte ta bort oavklarade todos!');
        } else {
            const confirmDelete = confirm('Är du säker på att du vill ta bort denna todo?');
            if (confirmDelete) {
                deleteTodo(todoId);
            }
        }
    }

    // Funktion för att visa en anpassad modal
    function showCustomModal(message) {
        customModalMessage.textContent = message;
        customModal.style.display = 'block';
    }

    // Funktion för att stänga den anpassade modalen
    function closeCustomModal() {
        customModal.style.display = 'none';
    }

    // Funktion för att hämta en specifik todo baserat på ID
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

    // Funktion för att ändra status för en todo (klar/ointe klar)
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

    // Funktion för att rendera en enskild todo
    function renderTodo(todo) {
        const li = document.createElement('li');
        li.textContent = todo.title;
        li.id = todo._id;

        // Skapa stäng-ikonen för att ta bort en todo
        const closeIcon = document.createElement('span');
        closeIcon.textContent = 'x';
        closeIcon.className = 'close-icon';
        closeIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            handleDelete(todo._id, todo.completed);
        });

        // Lägg till stäng-ikonen till todo-elementet
        li.appendChild(closeIcon);

        // Lägg till en klickhändelse för att ändra status för en todo
        li.addEventListener('click', function (event) {
            toggleTodoStatus(event, todo._id);
        });

        // Uppdatera stilen för todo-elementet baserat på om det är klart eller inte
        updateTodoElementStyle(li, todo.completed);

        // Lägg till todo-elementet till listan
        listContainer.appendChild(li);
    }

    // Funktion för att rendera en lista av todos
    function renderTodos(todos) {
        todos.forEach(todo => renderTodo(todo));
    }

    // Funktion för att uppdatera ett todo-element
    function updateTodoElement(updatedTodo) {
        const todoElement = document.getElementById(updatedTodo._id);
        if (todoElement) {
            const textContent = document.createTextNode(updatedTodo.title);
            todoElement.innerHTML = '';

            // Lägg till textinnehållet till todo-elementet
            todoElement.appendChild(textContent);

            // Skapa stäng-ikonen för att ta bort en todo
            const closeIcon = document.createElement('span');
            closeIcon.textContent = 'x';
            closeIcon.className = 'close-icon';
            closeIcon.addEventListener('click', function (event) {
                event.stopPropagation();
                deleteTodo(updatedTodo._id);
            });

            // Lägg till stäng-ikonen till todo-elementet
            todoElement.appendChild(closeIcon);

            // Uppdatera stilen för todo-elementet baserat på om det är klart eller inte
            updateTodoElementStyle(todoElement, updatedTodo.completed);
        }
    }

    // Funktion för att uppdatera stilen för ett todo-element baserat på om det är klart eller inte
    function updateTodoElementStyle(todoElement, completed) {
        if (completed) {
            todoElement.classList.add('checked');
        } else {
            todoElement.classList.remove('checked');
        }
    }

    // Funktion för att ta bort ett todo-element från DOM:en
    function removeTodoElement(todoId) {
        const todoElement = document.getElementById(todoId);
        if (todoElement) {
            todoElement.remove();
        }
    }

    // Lägg till en händelsehanterare för att stänga den anpassade modalen
    customModalClose.addEventListener('click', closeCustomModal);

    // Lägg till en händelsehanterare för att lägga till en ny todo
    addButton.addEventListener('click', function () {
        const todoTitle = inputBox.value.trim();

        if (todoTitle !== '') {
            addTodo(todoTitle);
            inputBox.value = '';
        } else {
            alert('Fyll i en text för att lägga till en Todo.');
        }
    });

    // Hämta todos när sidan har laddats
    getTodos();

    // Lägg till en händelsehanterare för att ändra status för en todo när den klickas på
    listContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            toggleTodoStatus(event, event.target.id);
        }
    });
});
