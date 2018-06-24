class CatUi {
    constructor() {
        this.list = document.querySelector('#cat-list');
        this.addCat = document.querySelector('#add-cat')
        this.catForm = document.querySelector('#cat-form');
        this.currentList = null;
        this._catApi = new CatApi();
        this._formAction = new FormAction();
    }
    init(config) {
        this.catRender();
        this.detectHideForm();
        this.detectShowForm();
        this.detectSubmit();
        this.detectClickList(config);
    }
    detectShowForm() {
        let me = this;
        this.addCat.addEventListener('click', function () {
            me.catForm.hidden = false;
            me.addCat.hidden = true;
        })
    }
    detectHideForm() {
        let me = this;
        this.catForm.addEventListener('click', function (e) {
            if (e.target.dataset.action == 'cancel') {
                me.catForm.hidden = true;
                me.addCat.hidden = false;
            }
        })
    }
    detectSubmit() {
        let me = this;
        this.catForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let row = me._formAction.getFormData(me.catForm);
            if (row.id) {
                me._catApi.modifyCat(row.id, row);
                me.catForm.hidden = true;
                me.addCat.hidden = false;
            } else {
                me._catApi.insertCat(row)
            }
            me._formAction.clearFrom(me.catForm);
            me.catRender();
        })
    }
    detectClickForm() {
        let me = this;
        this.catForm.addEventListener('click', function (e) {
            let cancelBtn = e.target.dataset.action == 'cancel';
            if (cancelBtn) {
                me.catForm.hidden = true;
                me.addCat.hidden = false;
                if (currentList) {
                    me.currentList.hidden = false;
                }
                me.list.insertAdjacentElement('afterend', me.catForm);
                me._formAction.clearFrom(me.catForm);
            }
        })
    }
    detectClickList(config) {
        let me = this;
        this.list.addEventListener('click', function (e) {
            let deleteBtn = e.target.classList.contains('delete'),
                updateBtn = e.target.classList.contains('update'),
                catItem = e.target.closest('.cat-list-item'),
                listId;
            if (catItem) {
                listId = parseInt(catItem.dataset.id);
            }
            if (deleteBtn) {
                let bl = confirm('确认删除分组吗？清空当前分组所有内容。');
                if (bl) {
                    me._catApi.deleteCat(listId);
                    config.taskApi.deleteTaskWithCat(listId);
                    config.taskUi.taskRender();
                    me.catRender();
                }
            } else if (updateBtn) {
                if (me.currentList) {
                    me.currentList.hidden = false;
                }
                me.catForm.hidden = false;
                me.addCat.hidden = true;
                let row = me._catApi.selectCat(listId);
                me._formAction.setFormData(me.catForm, row);
                catItem.hidden = true;
                catItem.insertAdjacentElement('afterend', me.catForm);
                me.currentList = catItem;
            } else {
                if (!listId)
                    return;
                me.list.querySelectorAll('.cat-list-item').forEach(item => {
                    if (item.dataset.id == listId) {
                        catItem.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                config.taskUi.taskRender(listId);
            }
        })
    }
    catRender() {
        let catList = this._catApi.selectCat(),
            me = this;
        this.list.insertAdjacentElement('afterend', me.catForm);
        this._formAction.clearFrom(this.catForm);
        this.list.innerHTML = '';
        catList.forEach(row => {
            let el = document.createElement('div');
            el.classList.add('cat-list-item', 'row');
            el.dataset.id = row.id;
            el.innerHTML = `
            <div class="cat-list-title">
                <div>${row.title}</div>
            </div>
            <div class="tool-set">
            ${row.id==1?'':
            `<span class="update">更新</span>
            <span class="delete">删除</span>`}
            </div>`;
            me.list.appendChild(el);
        });
    }
}