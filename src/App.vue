<script setup>
import Check from "@/utils/check";
import Fan from "@/utils/fan";
import Pair from "@/components/Pair.vue";
import { useTableStore } from "@/stores/table";
import { useConfigStore } from "@/stores/config"
import { storeToRefs } from "pinia";
import { ref, computed, watch, nextTick, onMounted } from "vue";
import Prize from "@/algo/prize"
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalConfirm from '@/components/Modal.vue'
import { VueDraggable } from 'vue-draggable-plus'




const tableStore = useTableStore();
const configStore = useConfigStore();

const { table, hands, score, currentLevel } = storeToRefs(tableStore);

const { levelScoreArr, maxDropCount, maxDropNum, waitTime } = storeToRefs(configStore);

const huResult = ref([]);
const currentMsg = ref("");
const isRun = ref(false);
const currentPair = ref(-1);
// 已经弃牌次数
const dropCount = ref(0);
// 剩余弃牌次数
const overDropNum = computed(() => {
  return maxDropCount.value - dropCount.value;
});
const currentPrizes = ref([]);
const msgList = ref([]);
// todo当前关卡分数
const currentLevelScore = computed(() => {
  return levelScoreArr.value[currentLevel.value - 1];
});

// 状态有 就绪,开胡,结算
const tableState = ref("就绪");

const prizePool = ref(Prize.getPrizePool())
// 重载
function reload() {
  tableState.value = "就绪"
  tableStore.reload();
  dropCount.value = 0;
  // 设为第一关
  currentLevel.value = 1;
  currentPair.value = -1;
  // 奖品池清空
  currentPrizes.value = [];
  // 设置奖品状态
  prizePool.value = Prize.getPrizePool()
  prizePool.value.forEach(i => {
    if (i.gameReset) {
      i.gameReset()
    }
    if (i.levelReset) {
      i.levelReset()
    }
  })
}
// 下一关
function nextLevel() {
  tableState.value = "就绪"
  // 分数不变
  const lastScore = score.value;
  tableStore.reload(lastScore);
  dropCount.value = 0;
  currentPair.value = -1;
  score.value = lastScore;
  // 重置奖品
  currentPrizes.value.forEach(i => {
    if (i.levelReset) {
      i.levelReset()
    }
  })
  // 选择奖品
  selectPrize();
}



// 是否允许drop
const allowDrop = computed(() => {
  if (tableState.value != "就绪") {
    return false;
  }
  if (dropCount.value >= maxDropCount.value) {
    return false;
  }
  const selected = hands.value.filter((item) => item.selected);
  if (selected.length === 0 || selected.length > maxDropNum.value) {
    return false;
  }
  return true;
});

// 变动手牌 变动可胡牌
watch(hands, () => {
  huResult.value = tableStore.getHuResult();
});

// 棋牌
function drop() {
  tableStore.dropHands();
  dropCount.value++;
  const tempMsg = "剩余弃牌次数" + overDropNum.value;
  currentMsg.value = tempMsg
  msgList.value.push({
    msg: tempMsg,
  });
}

// 是否可胡
const allowHu = computed(() => {
  return huResult.value.length > 0 && !isRun.value;
});

// 胡牌数量
const allHuNum = computed(() => {
  return huResult.value.reduce((acc, cur) => {
    return acc + cur.huNum;
  }, 0);
});

function getPairNum(v) {
  return table.value.getPairNum(v);
}
// 测试
function test() {
  const arr1 = [1, 2, 2, 2, 3, 4, 4, 5, 6, 7, 35, 35, 35];
  const arr2 = [8,8,18,18];
  hands.value = arr2.map((i) => {
    return {
      value: i,
      selected: false,
    };
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const isPass = computed(() => {
  return score.value >= currentLevelScore.value
})

function openModal(title, content, handle = () => { }) {
  const { open: modalOpen, close: modalClose } = useModal({
    component: ModalConfirm,
    attrs: {
      title: title,
      onConfirm() {
        modalClose()
        handle();
      },
    },
    slots: {
      default: content,
    },
  });
  modalOpen();
}
// 是否过关
function checkPassHandle() {
  if (isPass.value) {
    const tm = "恭喜你，过关了";
    currentMsg.value = tm;
    msgList.value.push({
      'msg': tm
    });
    currentLevel.value++
    // 如果当前为第十关则通关
    if (currentLevel.value === 10) {
      openModal(
        '恭喜你，通关了',
        '请大侠重新来过',
        () => {
          reload();
        }
      )
      return;
    }
    openModal(
      '恭喜你，过关了',
      '下一关所需分数:' + currentLevelScore.value,
      () => {
        nextLevel();
      }
    )
  } else {
    openModal(
      '胜败乃兵家常事',
      '请大侠重新来过',
      () => {
        reload();
      }
    )
  }
}

// 开始胡牌
async function hu() {
  isRun.value = true;
  tableState.value = "开胡"
  let currentLevelAllHuNum = allHuNum.value;
  // 获取之后的所有牌
  while (true) {
    await sleep(waitTime.value);
    // 获取一张牌
    const p = table.value.getPair(1);
    if (p == false || p.length === 0) {
      break;
    }
    // 判断是否在huResult中
    const pv = p[0];
    currentPair.value = pv;
    const fc = huResult.value.find((i) => i.hand === pv);
    if (fc) {
      let tempFanNum = fc.fanNum;
      let tempMsg = ''
      if (fc.isNoHui) {
        tempMsg += "[干牌*2]";
        tempFanNum = tempFanNum * 2
      }
      if (fc.isSameColor) {
        tempMsg += "[清一色*2]";
        tempFanNum = tempFanNum * 2
      }
      fc.huNum--;
      tempMsg += fc.fanType.name
      // 计算奖品的番薯附加
      for (let prize of currentPrizes.value) {
        // 番,传入手牌, 未摸牌库, 弃牌库, 剩余弃牌次数, 当前分数, 当前奖品, 当前胡牌, 全部胡牌, 当前关卡胡牌数
        const prizeResult = prize.handle(tempFanNum, hands, pv, table.value.mjPool, table.value.dropPool,
        overDropNum, score, currentPrizes, fc, huResult, currentLevelAllHuNum)
        if (prizeResult.pass) {
          tempMsg += "<span class='prize'>[" + prize.name + "]</span>" + tempFanNum + prizeResult.passDesc
          tempFanNum = prizeResult.fan
        }
      }
      tempMsg += "= +" + tempFanNum;
      currentMsg.value = tempMsg
      msgList.value.push({
        'pair': pv,
        'msg': tempMsg
      });
      score.value = score.value + tempFanNum;
    } else {
      currentMsg.value = "无胡";
    }
  }
  isRun.value = false;
  // 全部胡完之后检测是否过关
  tableState.value = "就绪"
  checkPassHandle();
}

// 每次添加消息把滚动条放置在底部
watch(msgList, () => {
  const msgListDom = document.getElementsByClassName('msg-list')[0];
  msgListDom.scrollTop = msgListDom.scrollHeight;
}, {
  deep: true,
  flush: 'post'
});

const prizeSelectModalShow = ref(false);


// 当前关卡奖品选择池
const currentLevelPrizeSelectedPool = ref([]);
function selectPrize() {
  // 确定三个奖品
  for (let i = 0; i < 3; i++) {
    let length = prizePool.value.length;
    // 从0到 length-1 随机取一个
    const index = Math.floor(Math.random() * length);
    // 删除避免重复选择
    currentLevelPrizeSelectedPool.value.push(prizePool.value[index])
    prizePool.value.splice(index, 1)
  }
  prizeSelectModalShow.value = true
}

const prizeSelectedIndex = ref(null);
function confirmPrize() {
  if (prizeSelectedIndex.value == null) {
    alert("请选择奖品")
    return;
  }
  const prize = currentLevelPrizeSelectedPool.value[prizeSelectedIndex.value];
  // 添加到当前奖品池
  currentPrizes.value.push(prize);
  // 重置奖品选择池
  currentLevelPrizeSelectedPool.value = [];
  // 重置奖品选择下标
  prizeSelectedIndex.value = null;
  // 关闭弹窗
  prizeSelectModalShow.value = false
  // 触发选择函数
  if (prize.selected) {
    prize.selected(maxDropCount, maxDropNum)
  }
}


onMounted(() => {
  reload();
})
</script>

<template>
  <div class="outer-container">
    <ModalsContainer />
    <ModalConfirm v-model="prizeSelectModalShow" title="选择你的奖品" @confirm="confirmPrize">
      <div style="display: flex;">
        <label v-for="(prize, index) in currentLevelPrizeSelectedPool" :key="index">
          <input type="radio" name="prize" :value="index" v-model="prizeSelectedIndex" />
          <div class="prize-item" v-tooltip="prize.desc">
            {{ prize.name }}
          </div>
        </label>
      </div>

    </ModalConfirm>
    <div class="outer-left">
      <div class="base-handle">
        <button class="handle-btn" @click="reload">重来</button>
        <button class="handle-btn" @click="test">测试</button>
      </div>
      <fieldset class="info">
        <legend>当前 第{{ currentLevel }}关</legend>
        <div>本关目标 >{{ currentLevelScore }} 过关</div>
        <div>得分:{{ score }}</div>
        <div>牌库还有 {{ table.mjPool.length }}张</div>
        <div>已经弃牌 {{ table.dropPool.length }}张</div>
        <div>剩余弃牌次数 {{ overDropNum }}</div>
        <div>每次弃牌最多 {{ maxDropNum }}张</div>
      </fieldset>
      <fieldset class="result">
        <legend>共胡{{ allHuNum }}张</legend>
        <div style="
          display: grid;
          gap: 5px;
          grid-template-columns: 20px 60px 50px 40px;
          overflow: auto;
          max-height: 100%;
        ">
          <template v-for="item in huResult" :key="item">
            <Pair disable :value="{ value: item.hand }"> </Pair>
            <div>{{ item.fanType.name }}</div>
            <div>{{ item.fanNum }}番</div>
            <div>{{ item.huNum }}张</div>
          </template>
        </div>
      </fieldset>
      <fieldset class="rule">
        <legend>规则/帮助</legend>

        <VTooltip style="display: inline-block;" placement="right">
          <a>胡牌规则</a>
          <template #popper>
            <p>经过多次弃牌凑成符合规则的牌即可胡牌</p>
            <hr>
            <p>手牌+摸牌必须凑出一对</p>
            <p>不限花色:任意种花色皆可胡</p>
            <p>不限幺九:有无幺九皆可胡</p>
            <p>癞子 <Pair disable :value="{ value: 35 }">
              </Pair>:红中为万能牌可以代替任意牌</p>
          </template>
        </VTooltip>
        |
        <VTooltip style="display: inline-block;" placement="right">
          <a>番数计算</a>
          <template #popper>
            <div>
              边胡(1番):胡一组相邻的牌两侧的牌, 如何只有一侧有牌,则视为夹胡
            </div>
            <div>
              对倒(1番):手牌中有两组对, 胡其中一组对
            </div>
            <div>
              单调(2番):抓到牌的牌与手牌凑成唯一个对
            </div>
            <div>
              夹胡(2番):胡两张牌中间的牌
            </div>
            <div>
              飘胡(4番):都是三张或两张相同的牌, 与七小对的区别在于七小对是n组两张相同的牌
            </div>
            <div>
              七小对(4番):手牌+抓拍凑成7个对
            </div>
            <div>
              四会(8番):手牌中有四个红中<Pair disable :value="{ value: 35 }"></Pair>,可以胡任意牌
            </div>
            <div>特大夹(8番): 在夹胡的基础上只胡一张牌.
              <div style="padding-left: 15px;">例如:
                <Pair disable :value="{ value: 11 }"></Pair>
                <Pair disable :value="{ value: 12 }"></Pair>
                <Pair disable :value="{ value: 12 }"></Pair>
                <Pair disable :value="{ value: 12 }"></Pair>
                <Pair disable :value="{ value: 13 }"></Pair>
                胡
                <Pair disable :value="{ value: 12 }"></Pair>
              </div>
              <div style="padding-left: 15px;">
                或:
                <Pair disable :value="{ value: 11 }"></Pair>
                <Pair disable :value="{ value: 12 }"></Pair>
                <Pair disable :value="{ value: 13 }"></Pair>
                <Pair disable :value="{ value: 13 }"></Pair>
                <Pair disable :value="{ value: 13 }"></Pair>
                胡
                <Pair disable :value="{ value: 13 }"></Pair>
              </div>
            </div>
            <div>
              其他:
              <div>
                清一色(*2番):手牌+摸牌为同一花色
              </div>
              <div>
                干胡(*2番):手牌+摸牌中没有癞子
              </div>
            </div>
          </template>
        </VTooltip>
      </fieldset>
    </div>
    <div class="outer-center">
      <div class="prizes-area">
        <fieldset >
          <legend>当前奖品 {{ currentPrizes.length }}个</legend>
          <VueDraggable ref="el" v-model="currentPrizes" class="prizes-list">
            <div class="prize-item" v-tooltip="prize.desc" v-for="(prize, index) in currentPrizes" :key="index">
              {{ prize.name }}
            </div>
          </VueDraggable>
        </fieldset>
      </div>
      <div class="hands-area">
        <div class="hands-area-left">
          <div class="handle">
            <button class="handle-btn" @click="checkPassHandle" :disabled="tableState == '开胡'">跳过本轮
            </button>
            <button class="handle-btn" @click="drop" :disabled="!allowDrop">弃牌</button>
            <button class="handle-btn" @click="hu" :disabled="!allowHu">开胡</button>
          </div>
          <div class="hand-list">
            <Pair v-for="(hand, index) in hands" :key="index" :value="hand"> </Pair>
          </div>
          <div style="display: inline-block; font-size: 20px; text-align: right" v-html="currentMsg"></div>
        </div>
        <div class="hands-area-right">
          <Pair style="font-size: 50px; margin-top: 50px;   display: block;   " v-show="currentPair != -1" disable
            :value="{ value: currentPair }">
          </Pair>
        </div>
      </div>
    </div>
    <div class="outer-right">
      <div class="msg-list">
        <div v-for="(item, index) in msgList" :key="index">
          <Pair v-if="item.pair" disable :value="{ value: item.pair }">
          </Pair>
          <span v-html="item.msg"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
