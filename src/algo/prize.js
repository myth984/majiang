const 老虎 = {
    name: "老虎",
    level: "1",
    desc: "当手牌中全部的牌都是奇数时，胡牌番数*2",
    passDesc: "*2",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = true;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            if (pass && item.value % 2 == 0) {
                pass = false;
            }
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan * 2 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 筷子 = {
    name: "筷子",
    level: "1",
    desc: "当手牌中全部的牌都是欧数时，胡牌番数*2",
    passDesc: "*2",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = true;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            if (pass && item.value % 2 != 0) {
                pass = false;
            }
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan * 2 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 土豆 = {
    name: "土豆",
    level: "1",
    desc: "每次胡牌结算时+1番",
    passDesc: "+1",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        const result = {
            // 是否满足
            pass: true,
            // 最终的番薯
            fan: fan + 1,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 烙饼 = {
    name: "烙饼",
    level: "1",
    desc: "胡牌如果是饼，则番数+3",
    passDesc: "+3",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = false;
        if (huCard <= 29 && huCard >= 21) {
            pass = true;
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 3 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 金库 = {
    name: "金库",
    level: "1",
    desc: "胡牌如果是万，则番数+3",
    passDesc: "+3",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = false;
        if (huCard <= 9 && huCard >= 1) {
            pass = true;
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 3 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}
const 油条 = {
    name: "油条",
    level: "1",
    desc: "胡牌如果是条，则番数+3",
    passDesc: "+3",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = false;
        if (huCard <= 19 && huCard >= 11) {
            pass = true;
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 3 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 质数 = {
    name: "质数",
    level: "1",
    desc: "胡牌如果是质数，则番数+5",
    passDesc: "+5",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        let pass = false;
        const realV = huCard % 10;
        if (realV == 2 || realV == 3 || realV == 5 || realV == 7) {
            pass = true;
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 5 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}

const 小登 = {
    name: "小登",
    level: "1",
    desc: "当你所有手牌均小于等于5，则番数*5",
    passDesc: "*5",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const realV = item.value % 10;
            if (realV > 5) {
                pass = false;
                return {
                    // 是否满足
                    pass: false,
                    // 最终的番薯
                    fan: fan,
                    passDesc: this.passDesc
                }
            }
        }
        const result = {
            // 是否满足
            pass: true,
            // 最终的番薯
            fan: fan * 5,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 老登 = {
    name: "老登",
    level: "1",
    desc: "当你所有手牌均大于等于5，则番数*5",
    passDesc: "*5",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, currentLevelAllHuNum) {
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const realV = item.value % 10;
            if (realV < 5) {
                pass = false;
                return {
                    // 是否满足
                    pass: false,
                    // 最终的番薯
                    fan: fan,
                    passDesc: this.passDesc
                }
            }
        }
        const result = {
            // 是否满足
            pass: true,
            // 最终的番薯
            fan: fan * 5,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 门缝 = {
    name: "门缝",
    level: "1",
    desc: "当你胡夹牌时, 番薯*3",
    passDesc: "*3",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        if (huInfo.fanType.name == '特大夹' || huInfo.fanType.name == '单吊' || huInfo.fanType.name == '夹胡') {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan * 3,
                passDesc: this.passDesc
            }
        }
        return {
            // 是否满足
            pass: false,
            // 最终的番薯
            fan: fan,
            passDesc: this.passDesc
        };
    },
}


const 纸抽 = {
    name: "纸抽",
    level: "1",
    desc: "当你手牌中有任意花色为5的牌，则番数+2",
    passDesc: "+2",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        let pass = false;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const realV = item.value % 10;
            if (realV == 5) {
                pass = true;
                break;
            }
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 2 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 饭碗 = {
    name: "饭碗",
    level: "1",
    desc: "当你手牌中有4张相同的牌，则番数*10",
    passDesc: "*10",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        const tempMap = {}
        for (let item of handCards.value) {
            const realV = item.value;
            if (realV in tempMap) {
                tempMap[realV] = tempMap[realV] + 1
            } else {
                tempMap[realV] = 1
            }
        }
        console.log(tempMap);
        let pass = false;
        for (let key in tempMap) {
            if (tempMap[key] >= 4) {
                pass = true;
                break;
            }
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan * 10 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 水杯 = {
    name: "水杯",
    level: "1",
    desc: "当你用光了全部的弃牌次数，则番数*5",
    passDesc: "*5",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        console.log(dropCount);
        const pass = dropCount.value == 0;
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan * 5 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 眼罩 = {
    name: "眼罩",
    level: "1",
    desc: "当你待抽牌库中还有少于30张牌时, 番薯+10",
    passDesc: "+10",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        console.log(pool);
        const pass = pool.length < 30;
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: pass ? fan + 10 : fan,
            passDesc: this.passDesc
        }
        return result;
    },
}


const 电池 = {
    name: "电池",
    level: "1",
    desc: "当你的当前得分被3整除时, 番数*3;当你的当前得分被7整除时, 番数*7; 即被3整除又被7整除时, 番数*21",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        let tp = 1;
        let pass = false;
        let passDesc = "";

        if (currentScore.value % 3 == 0) {
            tp = 3;
            pass = true;
            passDesc = "*3";
        }
        if (currentScore.value % 7 == 0) {
            tp = 7;
            pass = true;
            passDesc = "*7";
        }
        if (currentScore.value % 21 == 0) {
            tp = 21;
            pass = true;
            passDesc = "*21";
        }
        const result = {
            // 是否满足
            pass: pass,
            // 最终的番薯
            fan: fan * tp,
            passDesc: passDesc
        }
        return result;
    },
}

const 轮盘 = {
    name: "轮盘",
    level: "1",
    desc: "50%概率+10番,,40%什么也不做,10%概率-100番",
    passDesc: "+10",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        // 获取随机数
        const tp = Math.random() * 100;
        let pass = false;
        if (tp <= 40) {
            return {
                // 是否满足
                pass: false,
                // 最终的番薯
                fan: fan,
            }
        }
        if (tp > 40 && tp <= 50) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan - 100,
                passDesc: "-100"
            }
        }
        if (tp > 50) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan + 10,
                passDesc: "+10"
            }
        }
    },
}

const 火车 = {
    name: "火车",
    level: "1",
    desc: "当你的手牌和抓牌包含相同花色且连续的1-9牌时, 番数*10",
    passDesc: "*10",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, currentLevelAllHuNum) {
        const suitMap = {
            '万': new Set(),
            '条': new Set(),
            '饼': new Set(),
        }
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const v = item.value;
            const rv = v % 10;
            if (v < 10) {
                suitMap['万'].add(rv);
            } else if (v < 20) {
                suitMap['条'].add(rv);
            } else {
                suitMap['饼'].add(rv);
            }
        }
        // 判断哪个集合为9
        for (let se in suitMap) {
            if (suitMap[se].size == 9) {
                return {
                    // 是否满足
                    pass: true,
                    // 最终的番薯
                    fan: fan * 10,
                    passDesc: this.passDesc
                }
            }
        }
        return {
            // 是否满足
            pass: false,
            // 最终的番薯
            fan: fan,
        }
    },
}


const 残月 = {
    name: "残月",
    level: "1",
    desc: "当你的总胡牌数<4张时, 番数*3",
    passDesc: "*3",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let num = 0
        if (currentLevelAllHuNum.value < 4) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan * 3,
                passDesc: this.passDesc
            }
        }
        return {
            // 是否满足
            pass: false,
            // 最终的番薯
            fan: fan,
        }
    },
}


const 迷路 = {
    name: "迷路",
    level: "1",
    desc: "再次计算之前的奖励",
    passDesc: "*2",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let passDesc = ""
        for (let prize of currentPrizes.value) {
            if (prize == this) {
                break
            }
            const result = prize.handle(fan, handCards, huCard, pool, dropCards, dropCount,
                currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum);
            if (result.pass) {
                fan = result.fan;
                passDesc += result.passDesc;
            }
        }
        if (passDesc != "") {
            return {
                pass: true,
                // 最终的番薯
                fan: fan,
                passDesc: passDesc
            }
        } else {
            return {
                pass: false,
                // 最终的番薯
                fan: fan,
            }
        }
    }
}
const 神秘 = {
    name: "神秘",
    level: "1",
    desc: "增加两次弃牌次数",
    // 当被选择时触发
    selected(maxDropCount, maxDropNum) {
        maxDropCount.value = maxDropCount.value + 2;
    },
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        return { pass: false }
    }
}
const 玄幻 = {
    name: "玄幻",
    level: "1",
    desc: "增加两张弃牌数量",
    // 当被选择时触发
    selected(maxDropCount, maxDropNum) {
        maxDropNum.value = maxDropNum.value + 2;
    },
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        return { pass: false }
    }
}

const 月亮 = {
    name: "月球",
    level: "1",
    desc: "手牌中每有一张万牌, 番数+1",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let addFan = 0;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const v = item.value;
            if (v < 10) {
                addFan += 1;
            }
        }
        if (addFan > 0) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan + addFan,
                passDesc: "+" + addFan
            }
        }
    }
}

const 太阳 = {
    name: "太阳",
    level: "1",
    desc: "手牌中每有一张饼牌, 番数+1",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let addFan = 0;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const v = item.value;
            if (v > 20) {
                addFan += 1;
            }
        }
        if (addFan > 0) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan + addFan,
                passDesc: "+" + addFan
            }
        }
    }
}
const 地球 = {
    name: "地球",
    level: "1",
    desc: "手牌中每有一张条牌, 番数+1",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let addFan = 0;
        for (let item of handCards.value) {
            // 会不参与运算
            if (item.value == 35) {
                continue;
            }
            const v = item.value;
            if (v > 10 && v < 20) {
                addFan += 1;
            }
        }
        if (addFan > 0) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan + addFan,
                passDesc: "+" + addFan
            }
        }
    }
}

const 风扇 = {
    name: "风扇",
    level: "1",
    desc: "每剩余一个弃牌机会, 番数+2",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let addFan = 0;
        addFan = dropCount.value * 2;
        return {
            // 是否满足
            pass: addFan > 0,
            // 最终的番薯
            fan: fan + addFan,
            passDesc: "+" + addFan
        }
    }
}

const 橱柜 = {
    name: "橱柜",
    level: "1",
    desc: "每有一个奖品,则番数+2",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        // todo
        let addFan = currentPrizes.value.length * 2;
        return {
            // 是否满足
            pass: addFan > 0,
            // 最终的番薯
            fan: fan + addFan,
            passDesc: "+" + addFan
        }
    }
}


const 扫把 = {
    name: "扫把",
    level: "1",
    desc: "每次胡牌番+20, 效果-2. (第一次20,第二次18,第三次16)",
    passDesc: "+n",
    // 维护奖品的状态
    state: {
        fan: 20
    },
    initState: {
        fan: 20
    },
    // 每次游戏重置
    // todo维护初始状态
    gameReset() {
        this.state.fan = this.initState.fan;
    },
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        console.log(this.state.fan);
        if (this.state.fan > 0) {
            let addFan = this.state.fan;
            this.state.fan -= 2;
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan + addFan,
                passDesc: "+" + addFan
            }
        }
        return { pass: false }
    }
}

const 钉耙 = {
    name: "钉耙",
    level: "1",
    desc: "每关第9次胡牌时, 番薯*9",
    passDesc: "*9",
    state: {
        count: 0
    },
    initState: {
        count: 0
    },
    // todo 每关重置
    levelReset() {
        this.state.count = this.initState.count;
    },
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        // todo
        this.state.count += 1;
        if (this.state.count == 9) {
            return {
                // 是否满足
                pass: true,
                // 最终的番薯
                fan: fan * 9,
                passDesc: "*9"
            }
        }
        return { pass: false }
    }
}

const 石头 = {
    name: "石头",
    level: "1",
    desc: "不论胡牌的大小, 番数固定为3, 享受后续奖品加成",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        return {
            // 是否满足
            pass: true,
            // 最终的番薯
            fan: 3,
            passDesc: "=3"
        }
    }
}

const 花瓶 = {
    name: "花瓶",
    level: "1",
    desc: "番数加成为你手牌中出现最多次数的牌",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        const valueCountMap = {
        }
        for (let item of handCards.value) {
            const v = item.value;
            if (valueCountMap[v] == undefined) {
                valueCountMap[v] = 1;
            } else {
                valueCountMap[v] += 1;
            }
        }
        // 遍历map 获取最大的值
        let maxCount = 0;
        for (let key in valueCountMap) {
            if (valueCountMap[key] > maxCount) {
                maxCount = valueCountMap[key];
            }
        }
        return {
            pass: true,
            // 最终的番薯
            fan: fan + maxCount,
            passDesc: "+" + maxCount
        }
    }
}

const 螺丝 = {
    name: "螺丝",
    level: "1",
    desc: "每次胡八万/八饼/八条时, 永久获得+2番数",
    passDesc: "+n",
    state: {
        fan: 0
    },
    initState: {
        fan: 0
    },
    gameReset() {
        this.state.fan = this.initState.fan;
    },
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        const rv = huCard % 10;
        if (rv == 8) {
            this.state.fan += 2;
            return {
                pass: true,
                fan: fan + this.state.fan,
                passDesc: "+" + this.state.fan
            }
        } else {
            return {
                pass: false
            }
        }
    }
}

const 镜子 = {
    name: "镜子",
    level: "1",
    desc: "复制左侧的奖品",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let prePrize = undefined;
        for (let i = 0; i < currentPrizes.value.length; i++) {
            const prize = currentPrizes.value[i];
            if (prize == this) {
                prePrize = currentPrizes.value[i - 1];
                break;
            }
        }
        if (prePrize) {
            if (prePrize.name == '子镜') {
                return { pass: false }
            }
            return prePrize.handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum);
        } else {
            return { pass: false }
        }
    }
}
const 子镜 = {
    name: "子镜",
    level: "1",
    desc: "复制右侧的奖品",
    passDesc: "+n",
    handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum) {
        let nextPrize = undefined;
        for (let i = 0; i < currentPrizes.value.length; i++) {
            const prize = currentPrizes.value[i];
            if (prize == this) {
                nextPrize = currentPrizes.value[i + 1];
                break;
            }
        }
        if (nextPrize) {
            if (nextPrize.name == '镜子') {
                return { pass: false }
            }
            return nextPrize.handle(fan, handCards, huCard, pool, dropCards, dropCount, currentScore, currentPrizes, huInfo, huResult, currentLevelAllHuNum);
        } else {
            return { pass: false }
        }
    }
}

export default {
    pool: [老虎,
        筷子,
        土豆,
        烙饼,
        金库,
        油条,
        质数,
        小登,
        老登,
        门缝,
        纸抽,
        饭碗,
        饭碗,
        水杯,
        眼罩,
        电池,
        轮盘,
        火车,
        残月,
        迷路,
        神秘,
        玄幻,
        月亮,
        太阳,
        地球,
        风扇,
        橱柜,
        扫把,
        钉耙,
        石头,
        花瓶,
        螺丝,
        镜子,
        子镜],
}