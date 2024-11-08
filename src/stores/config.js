import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('CONFIG', () => {
    const levelScoreArr = ref([
        10, 30, 80, 160, 260, 380, 520, 680, 860, 1060
    ])

    // 最大弃牌次数
    const maxDropCount = ref(10);
    // 每次最多弃牌张数
    const maxDropNum = ref(3);
    // 胡牌等待时间
    const waitTime = ref(100);

    return { levelScoreArr, maxDropCount, maxDropNum, waitTime }
})
