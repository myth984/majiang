// const majs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 35];
// function getNormalTable() {
//     const mjPool = [];
//     for (let i = 0; i < majhongs.length; i++) {
//         mjPool.push(majhongs[i])
//         mjPool.push(majhongs[i])
//         mjPool.push(majhongs[i])
//         mjPool.push(majhongs[i])
//     }
// }

class Table {
    constructor() {
        this.allMj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 35];
        this.dropPool = [];
        this.mjPool = [];
        Object.defineProperty(this, 'majs', {
            writable: false,
            value: this.allMj
        });
    }
    // 初始化pool
    initNormalPool() {
        let mjPool = [];
        const majhongs = this.allMj;
        for (let i = 0; i < majhongs.length; i++) {
            mjPool.push(majhongs[i])
            mjPool.push(majhongs[i])
            mjPool.push(majhongs[i])
            mjPool.push(majhongs[i])
        }
        this.mjPool = mjPool;
    }
    // 打乱顺序
    shuffle() {
        let mjPool = this.mjPool;
        let mj = [];
        while (mjPool.length > 0) {
            let index = Math.floor(Math.random() * mjPool.length);
            mj.push(mjPool[index]);
            mjPool.splice(index, 1);
        }
        this.mjPool = mj;
    }
    // 获取n张牌 默认为1
    getPair(num = 1) {
        let mjPool = this.mjPool;
        if (mjPool.length < num) {
            return false;
        }
        let r = [];
        for (let i = 0; i < num; i++) {
            const item = mjPool.pop();
            r.push(item);
        }
        return r;
    }

    // 获取pool中有几张牌
    getPairNum(value) {
        let mjPool = this.mjPool;
        return mjPool.filter(item => item === value).length;
    }

}

export default Table;