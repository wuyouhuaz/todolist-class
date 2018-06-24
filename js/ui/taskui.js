class TaskUi {
    constructor(formSelector, listSelector, inputSelector) {
        this.form = document.querySelector(formSelector);
        this.input = document.querySelector(inputSelector);
        this.listbox = document.querySelector(listSelector);
        this.taskcomplete = document.querySelector('#task-done');
        /*私有，不应该直接调用，仅限此文件内部调用*/
        this._taskApi = new TaskApi();
        this._formAction = new FormAction();
    }
    init() {
        this.taskRender();
        this.detectAdd();
        this.detectClickList();
    }
    detectAdd() {
        let me = this;
        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            /*将表单中的数据转化成纯数据对象 {id: xxx, title: '吃饭', ... } */
            let catList = document.querySelector('#cat-list');
            let catIdArr = catList.querySelectorAll('.cat-list-item');
            let currentCatId;
            let row = me._formAction.getFormData(me.form);
            /*如果数据中有id，说明是更新旧数据，否则为添加新数据*/
            if (row.id) {
                me._taskApi.modifyTask(row.id, row);
            } else {
                if (!catIdArr.length) {
                    alert('请添加待办事项分组');
                    return;
                } else {
                    catIdArr.forEach((item) => {
                        if (item.classList.contains('active')) {
                            currentCatId = parseInt(item.dataset.id);
                        }
                    });
                }
                if (!currentCatId) {
                    alert('请选择待办事项分组');
                    return;
                }
                me._taskApi.insertTask(row, currentCatId);
            }
            /*更新界面*/
            me.taskRender();
            me.input.value = '';
            me.form.querySelector('[name=id]').value = '';
        });
    }
    detectClickList() {
        let me = this;
        this.listbox.addEventListener('click', function (e) {
            let target = e.target,
                todoItem = target.closest('.todo-item'), // 被点击的.todo-item，没有这个元素，就拿不到id
                isRemoveBtn = target.classList.contains('remove'), // 点击的是否为删除按钮
                isUpdateBtn = target.classList.contains('update'), // 点击的是否为更新按钮
                isFinishedBtn = target.classList.contains('finished'); // 点击的是否为完成按钮
            let itemId;
            if (todoItem) {
                itemId = parseInt(todoItem.dataset.id); // 拿到id
            }
            if (isRemoveBtn) {
                me.removeList(itemId);
            } else if (isUpdateBtn) {
                let row = me._taskApi.selectTask(itemId);
                me._formAction.setFormData(me.form, row);
            } else if (isFinishedBtn) {
                let row = me._taskApi.selectTask(itemId);
                row.completed = true;
                me._taskApi.modifyTask(itemId, row);
                me.taskRender();
            }
        });
        this.taskcomplete.addEventListener('click', function (e) {
            let taskDoneId = parseInt(e.target.closest('.todo-item').dataset.id),
                isRemoveBtn = e.target.classList.contains('remove');
            if (isRemoveBtn) {
                me.removeList(taskDoneId);
            }
        })
    }
    removeList(id) {
        this._taskApi.deleteTask(id);
        this.taskRender();
    }
    taskRender(catId) {
        let todoList;
        /*先通过api拿到所有数据*/
        if (catId) {
            todoList = this._taskApi.selectTaskByCatId(catId);
        } else {
            todoList = this._taskApi.getStorageList('task-list') || [];
        }
        let me = this;
        this.listbox.innerHTML = '';
        this.taskcomplete.innerHTML = '';
        /*遍历所有的任务数据，生成每一条html元素，并插入到任务列表中*/
        todoList.forEach(item => {
            let el = document.createElement('div');
            el.classList.add('row', 'todo-item');
            el.dataset.id = item.id;
            if (!item.completed) {
                el.innerHTML = `
                    <div class="col checkbox">
                        <input name="completed" type="checkbox" style="display:none">
                        <i class='fa fa-square-o task-not-checked'></i>
                    </div>
                    <div class="col detail">
                        <div class="title">${item.title}</div>
                    </div>
                    <div class="col tool-set">
                        <button class="update">更新</button>
                        <button class="finished">完成</button>
                        <button class="remove">删除</button>
                    </div>
                    `;
                me.listbox.appendChild(el);
            } else {
                el.innerHTML = `
                    <div class="col checkbox">
                        <input name="completed" type="checkbox" style="display:none" checked>
                        <i class='fa fa-check-square-o task-checked'></i>
                    </div>
                    <div class="col detail">
                        <div class="title">${item.title}</div>
                    </div>
                    <div class="col tool-set">
                        <button class="remove">删除</button>
                    </div>
                    `;
                me.taskcomplete.appendChild(el);
            }
        });
        let hasTaskNode = document.querySelector('#todo-list').children;
        let hasDoneNode = document.querySelector('#task-done').children;
        if (!hasTaskNode.length) {
            this.listbox.innerHTML = '<div class="empty-holder">暂无内容</div>';
        }
        if (!hasDoneNode.length) {
            this.taskcomplete.innerHTML = '<div class="empty-holder">暂无内容</div>'
        }
    }
}