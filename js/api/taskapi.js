class TaskApi extends BaseApi {
    constructor(list, maxId) {
        super(list);
        this.maxId = this.getStorageList('cat-max-id') || 0;
        this.list = this.getStorageList('task-list') || [];
        // this.list = [{
        //         id: 1,
        //         title: '买菜',
        //         completed: false,
        //         catId: 1,
        //     },
        //     {
        //         id: 2,
        //         title: '洗菜',
        //         completed: false,
        //         catId: 2,
        //     },
        //     {
        //         id: 3,
        //         title: '背单词',
        //         completed: false,
        //         catId: 3,
        //     },
        // ];
    }
    insertTask(row, currentCatId) {
        if (!row.title)
            return;
        this.maxId = this.maxId + 1;
        row.id = this.maxId;
        row.catId = currentCatId;
        this.setStorageList('task-max-id', this.maxId);
        return this.$$insertByPush('task-list', row);
    }
    deleteTask(id) {
        return this.$$delete('task-list', id);
    }
    deleteTaskWithCat(catId) {
        this.list = this.list.filter(function (row) {
            if (row.catId != catId)
                return true;
            else
                return false;
        });
        this.setStorageList('task-list', this.list);
        return this.list;
    }
    modifyTask(id, newRow) {
        return this.$$modify('task-list', id, newRow);
    }
    selectTask(id) {
        return this.$$select(id);
    }
    selectTaskByCatId(catId) {
        return this.list.filter(function (row) {
            if (row.catId == catId)
                return true;
            else
                return false;
        });
    }
    getStorageList(model) {
        return this.$$getStorageList(model);
    }
    setStorageList(model, data) {
        this.$$setStorageList(model, data);
    }
}