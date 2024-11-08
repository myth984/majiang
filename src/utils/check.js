/*
*
* 本算法10W次随机14张牌胡牌检测耗时4700毫秒，其中随机生成10万次14张牌，耗时2000毫秒。
* 所以10W次随机14张牌胡牌计算为2700毫秒  cpu5代I7
* 本算法支持七对判断，支持癞子，支持随机癞子，支持风牌
* 牌的数字1-9筒  11-19条  21-29万 31-37 东，南，西，北，中，发，白
* 交流请加微信：17775718902
* 2年棋牌公司技术总监，有合作欢迎骚扰。
* 对外暴露的方法
* checkHu(arr)检测是否胡牌
* canHu(arr)提示能胡什么牌
* 其他如吃，碰，杠检测比较简单，自行完成。
*
* */
let isQiDui = true; //是否默认支持七对
let isLaiZi = true; //是否有癞子
let laiZi = 35; //默认红中是癞子
let isFeng = false; //是否开启风牌


import Fan from './fan'
const fan = new Fan();
let Check = function () {

};
//返回牌在二位数组中位置坐标
let getPos = function (pai) {
    let x = parseInt(pai / 10);//getType(pai);
    let y = pai % 10 - 1;
    return { x: x, y: y };
};

//将一个牌数组转为二维数组
let transform = function (pais) {
    let result = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //筒
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //条
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //万
        [0, 0, 0, 0, 0, 0, 0] //风
    ];
    for (let i = pais.length - 1; i >= 0; i--) {
        let pos = getPos(pais[i]);
        result[pos.x][pos.y] += 1;
    }
    return result;
};

let copyTransformedPais = function (transformedPais) {
    let result = [];
    for (let i = 0; i < transformedPais.length; i++) {
        result.push([].concat(transformedPais[i]));
    }
    return result;
};




//获取癞子的个数,并且在之后移除转换牌中的所有癞子
let getLaiZiCount = function (transformedPais) {
    let pos = getPos(laiZi);
    let count = transformedPais[pos.x][pos.y];
    transformedPais[pos.x][pos.y] = 0;
    return count;
};

//获取所有可能的将的位置
let getAllJiang = function (transformedPais) {
    let result = [];
    for (let i = 0; i < transformedPais.length; i++) {
        for (let j = 0; j < transformedPais[i].length; j++) {
            if (transformedPais[i][j] > 0) {
                result.push(transformedPais[i][j] === 1 ? [[i, j]] : [[i, j], [i, j]]);
            }
        }
    }
    result.sort((a, b) => {
        return a.length - b.length;
    });
    return result;
};

let checkQiDui = function (transformedPais, laiZiCount) {
    let duiZi = 0;
    for (let i = 0; i < transformedPais.length; i++) {
        for (let j = 0; j < transformedPais[i].length; j++) {
            if (transformedPais[i][j] < 2)
                continue;
            switch (transformedPais[i][j]) {
                case 2:
                    duiZi += 1;
                    break;
                case 3:
                    duiZi += 1;
                    break;
                case 4:
                    duiZi += 2;
                    break;
            }
        }
    }
    return laiZiCount > 6 - duiZi;
};

let onePair = function (value, isReverse = false) {
    if (isReverse) {
        return Math.abs(value - 8)
    }
    return value;
};

let clearOnePais = function (transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr, isReverse) {
    if (transformedPaiArray[i] === 0 || needLaiZi.n > maxLaiZi) {
        return;
    }
    if (transformedPaiArray[i] >= 3) {//如果是三个一样的，直接移除
        transformedPaiArray[i] -= 3;
        splitDropArr.push([onePair(i, isReverse), onePair(i, isReverse), onePair(i, isReverse)]);
        return clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr);
    }
    // 判断三个牌是连续的
    if (transformedPaiArray[i] > 0 && transformedPaiArray[i + 1] != undefined && transformedPaiArray[i + 1] > 0 && transformedPaiArray[i + 2] != undefined && transformedPaiArray[i + 2] > 0) {
        transformedPaiArray[i] -= 1;
        transformedPaiArray[i + 1] -= 1;
        transformedPaiArray[i + 2] -= 1;
        let willInsert = [onePair(i, isReverse), onePair(i + 1, isReverse), onePair(i + 2, isReverse)];
        if (isReverse) {
            willInsert.reverse();
        }
        splitDropArr.push(willInsert);
        return clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr);
    }
    // 三个一样的移除 两个+一个癞子
    if (transformedPaiArray[i] === 2) {//如果是三个一样的，直接移除
        transformedPaiArray[i] -= 2;
        needLaiZi.n += 1;
        splitDropArr.push([onePair(i, isReverse), onePair(i, isReverse), onePair(i, isReverse)])
        return clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr);
    }
    // 两张牌连续 移除两张+一个癞子
    if (transformedPaiArray[i] > 0 && transformedPaiArray[i + 1] != undefined && transformedPaiArray[i + 1] > 0) {
        transformedPaiArray[i] -= 1;
        transformedPaiArray[i + 1] -= 1;
        needLaiZi.n += 1;
        let willInsert = [];

        if (i + 2 < transformedPaiArray.length) {
            willInsert = [onePair(i, isReverse), onePair(i + 1, isReverse), onePair(i + 2, isReverse)];
        } else if (i - 1 >= 0) {
            willInsert = [onePair(i - 1, isReverse), onePair(i, isReverse), onePair(i + 1, isReverse)];
        } else {
            console.log('error', "不知道填什么了")
        }
        if (isReverse) {
            willInsert.reverse();
        }
        splitDropArr.push(willInsert);
        return clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr);
    }
    // 两张牌间隔一张 也就是所谓的夹牌 移除两张+一个癞子
    if (transformedPaiArray[i] > 0 && transformedPaiArray[i + 2] != undefined && transformedPaiArray[i + 2] > 0) {
        transformedPaiArray[i] -= 1;
        transformedPaiArray[i + 2] -= 1;
        needLaiZi.n += 1;
        let willInsert = [onePair(i, isReverse), onePair(i + 1, isReverse), onePair(i + 2, isReverse)];
        if (isReverse) {
            willInsert.reverse();
        }
        splitDropArr.push(willInsert)
        return clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr);
    }
    transformedPaiArray[i] -= 1;
    splitDropArr.push([onePair(i, isReverse), onePair(i, isReverse), onePair(i, isReverse)]);
    // 处理单张需要消耗两个癞子
    needLaiZi.n += 2;
};

let pro = Check.prototype;

pro.setIsQiDui = function (temp) {
    isQiDui = temp;
};

pro.checkHu = function (pais) {
    // 定义数据结构 保存全部hu结果
    const result = [];

    let transformedPais = transform(pais);
    // 获取癞子个数 然后从正常牌库中移除癞子
    let laiZiCount = isLaiZi ? getLaiZiCount(transformedPais) : 0;
    // 四个癞子直接胡吗? 四惠凑整扑算胡 多个癞子目前最多算4会
    if (laiZiCount === 4) {
        return {
            type: "四会",
            isHu: true,
        };
    }
    //先检测七对
    if (isQiDui && pais.length === 14 && checkQiDui(transformedPais, laiZiCount)) {
        return {
            type: "七对",
            isHu: true,
        };
    }
    let allJiang = getAllJiang(transformedPais);
    //随机拿走一对做将，判断剩下的牌能否成为整扑
    for (let i = 0; i < allJiang.length; i++) {
        let laiZi = laiZiCount;
        let needLaiZiCount = 0;
        let copyedTransformedPais = copyTransformedPais(transformedPais); //复制一份牌
        // 如果只有一个将，则癞子少一个 用于凑将
        if (allJiang[i].length == 1) {
            laiZi -= 1;
        }
        //移除将占用的牌获得 去除 将 的新牌库
        for (let j = 0; j < allJiang[i].length; j++) {
            copyedTransformedPais[allJiang[i][j][0]][[allJiang[i][j][1]]] -= 1;
        }
        let splitDropArr = [];

        let has3SameFlag = false;
        //计算筒子，条子，万子成为整朴需要的癞子个数
        for (let j = 0; j < 3; j++) {
            let reversePais = [].concat(copyedTransformedPais[j]);
            // 计算单独需要的数量
            let tempSplitDropArr = [];
            let oneNeedLaiZiCount = this.getNeedLaiZiCount(copyedTransformedPais[j], laiZi, tempSplitDropArr);
            // 如果需要癞子 使用最少的癞子方案
            if (oneNeedLaiZiCount > 0) {
                let tempReverseSplitDropArr = [];
                let oneNeedLaiZiCountReverse = this.getNeedLaiZiCount(reversePais.reverse(), laiZi, tempReverseSplitDropArr, true);
                if (oneNeedLaiZiCount > oneNeedLaiZiCountReverse) {
                    oneNeedLaiZiCount = oneNeedLaiZiCountReverse;
                    tempSplitDropArr = tempReverseSplitDropArr;
                }
            }
            laiZi -= oneNeedLaiZiCount;
            splitDropArr.push(tempSplitDropArr);
            if (!has3SameFlag) {
                for (let dropArr of tempSplitDropArr) {
                    // 判断三个是否一样
                    if (dropArr.length === 3 && dropArr[0] === dropArr[1] && dropArr[1] === dropArr[2]) {
                        has3SameFlag = true;
                        break;
                    }
                }
            }
            // 如果癞子数不够，则结束不需要判断后续的牌了
            if (laiZi < 0) {
                break;
            }
        }

        if (isFeng && laiZi >= 0) { //如果需要风牌，则加入风牌需要的癞子数量
            laiZi -= this.getFengNeedLaiZiCount(copyedTransformedPais[3]);
        }
        // 必须有3个一样的

        if (has3SameFlag && laiZi >= 0) {
            // feature 是否需要断19判断
            const jiangArr = [];
            for (let j = 0; j < allJiang[i].length; j++) {
                // 获取被去掉的jiang
                // 转为具体的牌
                const colorIndex = allJiang[i][j][0];
                const parisIndex = allJiang[i][j][1];
                const parisValue = (colorIndex * 10) + parisIndex + 1;
                jiangArr.push(parisValue);
                if (allJiang[i].length == 1) {
                    jiangArr.push(parisValue);
                }
            }
            result.push({ split: splitDropArr, jiang: jiangArr })
        }
    }
    return {
        type: 'drop',
        data: result,
        isHu: result.length > 0,
    };
};


//获取风牌成为整扑所需要的癞子数量
pro.getFengNeedLaiZiCount = function (transformedPaiArray) {
    let needLaiZiCount = 0;
    for (let i = 0; i < transformedPaiArray.length; i++) {
        if (transformedPaiArray[i] === 0 || transformedPaiArray[i] === 3) {
            continue;
        }
        if (transformedPaiArray[i] == 2) {
            needLaiZiCount += 1;
        } else {
            needLaiZiCount += 2;
        }
    }
    return needLaiZiCount;
}
//获取单门（筒，条，万）成为整扑需要的牌有哪些,所需癞子的个数
pro.getNeedLaiZiCount = function (transformedPaiArray, maxLaiZi, splitDropArr, isReverse = false) {
    let needLaiZi = { n: 0 };
    for (let i = 0; i < transformedPaiArray.length; i++) {
        if (transformedPaiArray[i] === 0) {
            continue;
        }
        clearOnePais(transformedPaiArray, maxLaiZi, i, needLaiZi, splitDropArr, isReverse);
    }
    return needLaiZi.n;
};

//判断当前牌型听什么牌
pro.canHu = function (arr) {
    let result = [];
    let majhongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    if (isFeng) {
        majhongs = majhongs.concat([31, 32, 33, 34, 35, 36, 37]);
    } else if (isLaiZi && laiZi > 30) {
        majhongs.push(laiZi);
    }
    for (let i = 0; i < majhongs.length; i++) {
        // 遍历检查具体hu pais
        const hand = majhongs[i];
        const fullHands = [].concat(arr, hand)
        const r = this.checkHu(fullHands);
        if (hand === laiZi) {
            continue;
        }
        if (r.isHu) {
            // 判断是否有会
            let noHui = fullHands.indexOf(35) == -1;
            // 判断是否清一色
            let isSameColor = true;
            let color;
            for (let hp of fullHands) {
                if (hp == 35) {
                    continue;
                }
                if (color == undefined) {
                    color = Math.ceil(hp / 10);
                } else {
                    if (color != Math.ceil(hp / 10)) {
                        isSameColor = false;
                        break;
                    }
                }
            }
            let baseFan = 1;
            // 清一色和干牌不在这里计算
            // if (noHui) {
            //     baseFan = baseFan * 2;
            // }
            // if (isSameColor) {
            //     baseFan = baseFan * 2;
            // }

            let maxFun = undefined;
            if (r.type == 'drop') {
                // 开始计算番数
                // [0] 0-8 circle
                // [1] 0-8 long
                // [2] 0-8 wan
                // [ [ [ [Array], [Array] ], [], [] ] ]
                // 全部hu color combo
                const sourceSplitData = r.data;
                // 将下标格式转为paris格式
                for (let splitI = 0; splitI < sourceSplitData.length; splitI++) {
                    const resultObj = sourceSplitData[splitI];
                    const jiang = resultObj.jiang;
                    const tempHu = resultObj.split;
                    for (let colorI = 0; colorI < tempHu.length; colorI++) {
                        const color = tempHu[colorI];
                        let parisValue = colorI * 10;
                        for (let comboI = 0; comboI < color.length; comboI++) {
                            const combo = color[comboI];
                            for (let pIndex = 0; pIndex < combo.length; pIndex++) {
                                const pValue = combo[pIndex];
                                combo[pIndex] = pValue + parisValue + 1;
                            }

                        }
                    }
                    let fanResult = fan.computeFan(tempHu, jiang, hand);
                    // 获取最大的hui
                    if (maxFun == undefined) {
                        maxFun = fanResult;
                    } else if (maxFun.fan < fanResult.fan) {
                        maxFun = fanResult;
                    }
                }
            } else if (r.type === "七对") {
                maxFun = fan.qiXiaoDui
            } else if (r.type === "四会") {
                maxFun = fan.siHui
            }
            // laiZi先不处理等待最后处理
            const o = {
                hand: hand,
                fanType: maxFun,
                fanNum: maxFun.fan * baseFan,
                isNoHui: noHui,
                isSameColor: isSameColor
            }
            result.push(o);
        }
    }
    // 获取最大的番薯
    if (result.length > 0) {
        let laiZiFun = result.reduce((a, b) => {
            return a.fanType.fan > b.fanType.fan ? a : b;
        });
        result.push({ hand: laiZi, fanType: laiZiFun.fanType, fanNum: laiZiFun.fanNum });
    }
    return result;
};



export default Check;