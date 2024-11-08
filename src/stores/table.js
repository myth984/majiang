import { ref, computed, reactive, h } from 'vue'
import { defineStore } from 'pinia'
import Check from "@/utils/check";
import Fan from "@/utils/fan";
import Table from "@/utils/table.js";



export const useTableStore = defineStore('table', (initScore=0) => {
    const table = reactive(new Table())
    const hands = ref([])
    const check = new Check();
    const score = ref(initScore);
    // 当前关卡
    const currentLevel = ref(1);
    function reload() {
        score.value = 0;
        table.initNormalPool();
        table.shuffle();
        const handValue = table.getPair(13);
        handValue.sort(function (a, b) {
            return a - b;
        });
        hands.value = handValue.map(item => {
            return {
                value: item,
                selected: false,
            }
        })
    }
    function dropHands() {
        // 从hands 去掉selected
        const selected = hands.value.filter((item) => item.selected);
        hands.value = hands.value.filter((item) => !item.selected);
        // 在pull
        const changePairs = table.getPair(selected.length);
        hands.value = hands.value.concat(
            changePairs.map((item) => {
                return {
                    value: item,
                    selected: false,
                };
            })
        );
        hands.value.sort((a, b) => a.value - b.value);
        table.dropPool = table.dropPool.concat(selected.map((item) => item.value));
    }

    function getHuResult() {
        const handsValue = hands.value.map((item) => item.value);
        const list = check.canHu(handsValue);
        for (let item of list) {
            const huNum = table.getPairNum(item.hand);
            item.huNum = huNum
        }
        return list;
    }


    return { table, hands, reload, dropHands, getHuResult, score, currentLevel }
})
