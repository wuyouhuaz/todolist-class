class CatApi extends BaseApi {
    constructor(list, maxId) {
        super(list);
        this.maxId = this.getStorageList('cat-max-id') || 1;
        this.config = {
            title: {
                maxLength: 10,
            },
        };
        this.list = this.getStorageList('cat-list') || [{
            id: 1,
            title: '默认',
        }];
        // this.list = [{
        //         id: 1,
        //         title: '默认',
        //     },
        //     {
        //         id: 2,
        //         title: '小兔纸'
        //     },
        //     {
        //         id: 3,
        //         title: '人家还是个宝宝'
        //     },
        // ];
    }
    insertCat(row) {
        if (!row.title)
            return;
        let titleMaxLength = this.config.title.maxLength;
        if (row.title.length > titleMaxLength) {
            return;
        }
        this.maxId = this.maxId + 1;
        row.id = this.maxId;
        this.setStorageList('cat-max-id', this.maxId);
        return this.$$insertByUnshift('cat-list', row);
    }
    deleteCat(id) {
        if (id == 1)
            return;
        return this.$$delete('cat-list', id);
    }
    modifyCat(id, newRow) {
        return this.$$modify('cat-list', id, newRow);
    }
    selectCat(id) {
        return this.$$select(id);
    }
    getStorageList(model) {
        return this.$$getStorageList(model);
    }
    setStorageList(model, data) {
        this.$$setStorageList(model, data);
    }
}