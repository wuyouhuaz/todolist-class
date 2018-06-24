class BaseApi {
    constructor(list) {
        this.list = list || [];
    }
    $$insertByPush(model,row) {
        this.list.push(row);
        this.$$setStorageList(model, this.list);
    }
     $$insertByUnshift(model, row) {
         this.list.unshift(row);
         this.$$setStorageList(model, this.list);
     }
    $$delete(model, id) {
        let index = this.$$findIndexById(this.list, id);
        /*如果id有误，就直接返回*/
        if (index < 0)
            return;
        /*用splice()删除找到的元素*/
        this.list.splice(index, 1);
        this.$$setStorageList(model, this.list);
    }
    $$modify(model, id, newRow) {
        let index = this.$$findIndexById(this.list, id);
        /*如果id有误，就直接返回*/
        if (index == -1)
            return;
        /*删除更新数据中的id，防止id被覆盖（id用于绝对定位，一旦生成不可修改）*/
        // delete newRow.id;
        let oldRow = this.list[index];
        newRow.id = id;
        this.list[index] = Object.assign({}, oldRow, newRow);
        this.$$setStorageList(model, this.list);
    }
    $$select(id) {
        if (id)
            return this.$$findItemById(this.list, id);
        return this.list;
    }
    $$findIndexById(arr, id) {
        return arr.findIndex(function (row) {
            return row.id == id;
        });
    }
    $$findItemById(arr, id) {
        return arr.find(function (row) {
            return row.id == id;
        });
    }
    $$getStorageList(model) {
        return JSON.parse(localStorage.getItem(model));
    }
    $$setStorageList(model, data) {
        localStorage.setItem(model, JSON.stringify(data));
    }
}