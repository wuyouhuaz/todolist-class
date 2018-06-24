let taskUi = new TaskUi('#todo-form', '#todo-list', '#todo-input');
let taskApi = new TaskApi();
let catUi = new CatUi();
taskUi.init();
catUi.init({
    taskUi,
    taskApi
});