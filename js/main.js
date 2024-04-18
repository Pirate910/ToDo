const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')){
  tasks = JSON.parse(localStorage.getItem('tasks'))
  console.log(JSON.parse(localStorage.getItem('tasks')))
}

tasks.forEach((task) => {
  let cssClass;
  if(task.done){
    cssClass = 'task-title task-title--done';
  }else {
    cssClass = 'task-title';
  }

  const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
    </div>
  </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHtml);
});



checkEmptyList();

// добавляем задачи
form.addEventListener('submit', addTask);
//удаляем задачу
tasksList.addEventListener('click', deleteTask)
// отмечаем задачу сделанной 
tasksList.addEventListener('click', doneTask)

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;

  // описываем задачу в виде объекта 
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,

  } 

  // Добавляем задачу в массив с задачами 
  tasks.push(newTask);
  save();
  // формируем css class 
  // const cssClass = newTask.done ? "task-title tasktitle--done": "task-title";

  let cssClass;
  if(newTask.done){
    cssClass = 'task-title task-title--done';
  }else {
    cssClass = 'task-title';
  }

  const taskHtml = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
    </div>
  </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHtml);

  taskInput.value = '';
  taskInput.focus();  

  checkEmptyList();
}


function deleteTask(e){

  if(e.target.dataset.action === 'delete'){
    const parentNode = e.target.closest('li');
    // определяем id у задачи
    const id = Number(parentNode.id)
    // находим индекс задачи в элементе
    const index = tasks.findIndex((task) => {
      if (task.id == id){
        return true;
      }
    })

    console.log(index);

    // вырезаем задачу из массива 
    // tasks.splice(index, 1);

    // если id задачи равна - вернет true и задача автоматически попадает в новый массив, крч удаляется с кода
    tasks = tasks.filter((task) => {
      if (task.id === id){
        return false
      }else{
        return true
      }
    });

    save();

    // удаляем задачу из разметки
    parentNode.remove();


  } else if(e.target.dataset.action !== 'delete'){
    return;
  }

  checkEmptyList();
 
}

// отключает автозаполнение полей в input
form.addEventListener('mouseenter', (e) => {
  e.target.setAttribute('autocomplete', 'off')
})

function doneTask(e){

  if(e.target.dataset.action !== "done"){
    return;
  }
  
  const parentNode = e.target.closest('li')
  const taskTitle = parentNode.querySelector(".task-title")
  taskTitle.classList.toggle ("task-title--done")

  // определяем id у задачи   
  const id = parentNode.id

  tasks.find( (task) => {
    if(task.id == id){
      return true
    }
    
    console.log(task);
    task.done = !task.done;
    save();
  });

}

function checkEmptyList(){

  if(tasks.length == 0){
    const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHtml)
  }

  if(tasks.length > 0){
     const emptyListEl = document.querySelector('#emptyList')
     emptyListEl ? emptyListEl.remove() : null;
  }
}

// очищает консколь при нажатии кнопки escape
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    console.clear();
  }
})

function save(){
  localStorage.setItem('tasks', JSON.stringify(tasks))
}