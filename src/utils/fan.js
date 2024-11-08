// name fanNum



const duiDaoHu = {
    fan: 1,
    name: "对倒",
    match(splitData, jiang, hand) {
        for (let color of splitData) {
            for (let combo of color) {
                if (combo.length == 3
                    && combo.includes(hand)
                    && combo[0] == combo[2] && combo[0] == combo[1]) {
                    return true
                }
            }
        }
        return false;
    }
}

const bianHu = {
    fan: 1,
    name: "边胡",
    match(splitData, jiang, hand) {
        for (let color of splitData) {
            for (let combo of color) {
                if (combo.length == 3 && combo.includes(hand)) {
                    // 去掉hand
                    combo.splice(combo.indexOf(hand), 1);
                    // 判断是否是边
                    if (combo[0] + 1 == combo[1]) {
                        if (combo[0] - 1 == hand || combo[1] + 1 == hand) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
}
const jiaHu = {
    fan: 2,
    name: "夹胡",
    match(splitData, jiang, hand) {
        for (let color of splitData) {
            for (let combo of color) {
                if (combo.length == 3 && combo.includes(hand)) {
                    // 去掉hand
                    combo.splice(combo.indexOf(hand), 1);
                    if (combo[0] + 2 == combo[1]) {
                        return true;
                    }
                    // 3 7 为边
                    if (hand % 10 == 7) {
                        if (hand + 1 == combo[0] && combo[0] + 1 == combo[1]) {
                            return true;
                        }
                    }
                    if (hand % 10 == 3) {
                        if (hand - 1 == combo[1] && combo[0] + 1 == combo[1]) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
}

const danDiao = {
    fan: 2,
    name: "单吊",
    match(splitData, jiang, hand) {
        // todo
        for (let color of splitData) {
            for (let tempCombo of color) {
                if (!(tempCombo.length == 3 || tempCombo.length == 0)) {
                    return false;
                }
            }
        }
        // 所有的splitData都是3个
        if (jiang.length == 2 && jiang.includes(hand)) {
            return true;
        }
        return false;
    },
}

const piaoHu = {
    fan: 4,
    name: "飘胡",
    match(splitData, jiang, hand) {
        // 全都的splitData都是一样的
        for (let color of splitData) {
            for (let tempCombo of color) {
                if (tempCombo.length == 3) {
                    if (
                        !(tempCombo[0] == tempCombo[1] && tempCombo[0] == tempCombo[2])
                    ) {
                        return false
                    }
                }

                if (tempCombo.length == 2) {
                    if (
                        tempCombo[0] != tempCombo[1]
                    ) {
                        return false
                    }
                }

            }
        }
        return true
    },
}

const qiXiaoDui = {
    fan: 4,
    name: "七小对",
    match: undefined,
}
const siHui = {
    fan: 8,
    name: "四会",
    match: undefined,
}

const teDaJia = {
    fan: 8,
    name: "特大夹",
    match(splitData, jiang, hand) {
        let isThreeSame = false;
        for (let color of splitData) {
            for (let tempCombo of color) {
                if (tempCombo.length == 3
                    && tempCombo.includes(hand)
                    && tempCombo[0] == tempCombo[1]
                    && tempCombo[0] == tempCombo[2]
                ) {
                    isThreeSame = true;
                    break
                }
            }
        }
        if (isThreeSame) {
            for (let color of splitData) {
                for (let tempCombo of color) {
                    if (tempCombo.includes(hand)) {
                        if (jiaHu.match(splitData, tempCombo, jiang, hand)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
}

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var copy = Array.isArray(obj) ? [] : {};

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }

    return copy;
}

let Fan = function () {


};

let pro = Fan.prototype;

/**
 * 计算番数
 * @param splitData 为完整的数据
 * @param combo 为拆分的数据
 * @param jiang
 * @param hand
 */
pro.computeFan = function (splitData, jiang, hand) {
    const allFan = [
        teDaJia, piaoHu, jiaHu, danDiao, bianHu, duiDaoHu
    ];

    // 判断是否是清一色
    for (let fan of allFan) {
        let tempSplitData = deepCopy(splitData);
        if (fan.match(tempSplitData, jiang, hand)) {
            return fan;
        }
    }
};
pro.qiXiaoDui = qiXiaoDui;
pro.siHui = siHui;


export default Fan