HTMLCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.forEach = Array.prototype.forEach;

//Elements 
const mainTodoList = document.querySelector('.mainTodoList');
const subTasksList = document.querySelector('.subTasksList');
const modal = document.querySelector('.opacityModal');

//Inputs
const newTodoTitle = document.querySelector('.newTodoTitle');
const newSubTask = document.querySelector('.newSubTask');
const newSubTasks = document.getElementsByClassName('newSubTasks');

//btns
const addTodoBtn = document.querySelector('.addTodoBtn');
const addSubTaskBtn = document.querySelector('.addSubTaskBtn');
const createTodoBtn = document.querySelector('.btn-create');
const closeModalBtn = document.querySelector('.closeModalBtn');
const actBtn = document.getElementsByClassName('actBtn');

//EVENT LISTENERS
//Init function render
if(document.readyState !== 'loading'){
    renderTodos();
}else {
    document.addEventListener('DOMContentLoaded', function(){
        renderTodos();
    });
}

//Hit enter to add subtask
newSubTask.addEventListener('keyup', function(e){
    const key = (event.keyCode ? event.keyCode : event.which);
    const item = e.target;

    if(key == 13){
        addSubTask(item);
    }
});

//Hit enter on subtask to add other
subTasksList.addEventListener('keyup', function(e){
    const key = (event.keyCode ? event.keyCode : event.which);
    const item = e.target;

    if(key == 13 && item.tagName == 'INPUT'){
        addSubTask(item);
    }
});

//Create subtask btn
addSubTaskBtn.addEventListener('click', function(e){
    const item = e.target;
    addSubTask(item.previousElementSibling);
});

//Get data id from main list
mainTodoList.addEventListener('click', function(e){
    const item = e.target;

    //Get current todo
    if(item.classList[0] == 'todoThumb'){
        getTodo(item.getAttribute('data-id'));
    }
    //Delet current todo
    else if(item.classList.contains('btnDelete')){
        deleteData(item.getAttribute('data-id'));
    }
});

addTodoBtn.addEventListener('click', createTodo);
createTodoBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
subTasksList.addEventListener('click', removeCheck);

//LOCAL STORAGE FUNCTIONS
//Get
function getData() {
    const todos = JSON.parse(localStorage.getItem('todos'));

    if(todos != null){
        return todos;
    }
}

//Insert and update
function insertData (objModel, storageIndex) {
    let todo = getData();
    if(todo == null) todo = [];

    if(storageIndex !== null) {
        todo[storageIndex] = objModel;
    } else {
        todo.push(objModel);
    }

    localStorage.setItem('todos', JSON.stringify(todo));
}

//Delete
function deleteData (storageIndex) {
    const todo = getData();
    todo.splice(storageIndex, 1)
    localStorage.setItem('todos', JSON.stringify(todo));
    renderTodos();
}


//Render main Todos
function renderTodos() {
    const todos = getData();

    if(todos){
        document.querySelectorAll('.todoThumb').forEach(e => e.remove());

        todos.forEach((todo, index) => {

            const todoLi = document.createElement('li');
            todoLi.classList.add('todoThumb');
            todoLi.setAttribute('data-id', index);
            
            const trashIcon = document.createElement('i');
            trashIcon.classList.add('fas', 'fa-trash', 'btnDelete');
            trashIcon.setAttribute('data-id', index);
            trashIcon.setAttribute('title', 'Delete todo?');
            todoLi.appendChild(trashIcon);

            const barProgress = document.createElement('span');
            barProgress.classList.add('barProgress', todo.color);
            todoLi.appendChild(barProgress);
    
            const todoTitle = document.createElement('h2');
            todoTitle.innerText = todo.title;
            todoLi.appendChild(todoTitle);

            if(todo.tasks != 0) {
                const subTask = document.createElement('ul');
                for (let i = 0; i < todo.tasks.length; i++) {
                    if(i < 4){
                        const subTasks = document.createElement('li');
                        if(todo.tasks[i].done){ 
                            subTasks.classList.add('complete');
                        }
                        subTask.appendChild(subTasks);
            
                        const textTasks = document.createElement('p');
                        textTasks.innerText = todo.tasks[i].text;
                        subTasks.appendChild(textTasks);
            
                        todoLi.appendChild(subTask);
                    }
                }
            }
    
            mainTodoList.appendChild(todoLi);
        });
    }
}

//create todo
function createTodo () {
    if(newTodoTitle.value != '') {
        //Get values 
        let doneTask;
        let titleTodo = newTodoTitle.value;
        const storageIndex = addTodoBtn.getAttribute('data-index');
        const subTasks = newSubTasks;
        const arrSubTasks = [];

        //Get subtasks
        if(subTasks.length != 0){
            subTasks.forEach(item => {
                if(item.value != '') {

                    item.parentElement.classList[0] == 'complete' ? doneTask = true : doneTask = false;

                    arrSubTasks.push({
                        text: item.value, 
                        done: doneTask
                    });
                }
            });
        }

        //Create object with all data
        const objModel = {
            id: 4, 
            title: titleTodo, 
            tasks: arrSubTasks, 
            color: 'red'
        };

        //Add to localstorage
        insertData(objModel, storageIndex);
        
        //Close Modal
        closeModal();

        //Populate todo list on homepage
        renderTodos();
    }else {
        alert('Digite um titulo');
    }
}

//Get todo (to update data)
function getTodo(todoItem) {
    const todos = getData();
    
    if (todos) {
        let todo = todos[todoItem];
        newTodoTitle.value = todo.title;

        if(todo.tasks != 0) {
            todo.tasks.forEach(item => {

                const subLi = document.createElement('li');

                if(item.done){ 
                    subLi.classList.add('complete');
                }

                const inputSub = document.createElement('input');
                inputSub.setAttribute('type', 'text');
                inputSub.setAttribute('value', item.text);
                inputSub.classList.add('newSubTasks');
                subLi.appendChild(inputSub);
        
                const checkBtn = document.createElement('button');
                checkBtn.innerHTML = '<i class="fas fa-check"></i>';
                checkBtn.classList.add('actBtn');
                checkBtn.classList.add('checkBtn');
                subLi.appendChild(checkBtn);
        
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                removeBtn.classList.add('actBtn');
                removeBtn.classList.add('removeBtn');
                subLi.appendChild(removeBtn);
        
                //Ond qro inser         //Oq eu qro inser             
                subTasksList.appendChild(subLi);
            });
        }

        addTodoBtn.setAttribute('data-index', todoItem);
    }

    openModal();
}


//Add subtasks
function addSubTask(sourceData) {
    const sourceDataClass = sourceData.classList[0];

    if(sourceData.value != ''){
        const subLi = document.createElement('li');

        const inputSub = document.createElement('input');
        inputSub.setAttribute('type', 'text');
        inputSub.setAttribute('value', newSubTask.value);
        inputSub.classList.add('newSubTasks');
        subLi.appendChild(inputSub);

        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        checkBtn.classList.add('actBtn');
        checkBtn.classList.add('checkBtn');
        subLi.appendChild(checkBtn);

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.classList.add('actBtn');
        removeBtn.classList.add('removeBtn');
        subLi.appendChild(removeBtn);
          
        subTasksList.appendChild(subLi);

        if(sourceDataClass == 'newSubTask'){
            newSubTask.value = '';
            sourceData.focus();
        }else {
            sourceData.parentElement.nextElementSibling.childNodes[0].focus();
        }
    }else {
        alert('Digite uma tarefa');
    }
}

//Check and Remove subtasks
function removeCheck(e){
    const item = e.target;
    if(item.tagName == 'BUTTON'){
        if(item.classList.contains('checkBtn')) {
            item.parentElement.classList.toggle('complete');
        }else {
            item.parentElement.remove();
        }
    }
}

//Close modal and clear all data
function closeModal(){
    modal.setAttribute('style', 'display: none');

    //Clear all data on modal
    newTodoTitle.value = '';
    newSubTask.value = '';
    for(let i = 0; len = newSubTasks.length; i < len){
        newSubTasks[i].parentElement.remove();
    }
    addTodoBtn.removeAttribute('data-index');
}

//Open modal
function openModal(){
    modal.setAttribute('style', 'display: flex');
}