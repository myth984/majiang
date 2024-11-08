<script setup>
const transMap = {
  1: "🀇",
  2: "🀈",
  3: "🀉",
  4: "🀊",
  5: "🀋",
  6: "🀌",
  7: "🀍",
  8: "🀎",
  9: "🀏",
  11: "🀐",
  12: "🀑",
  13: "🀒",
  14: "🀓",
  15: "🀔",
  16: "🀕",
  17: "🀖",
  18: "🀗",
  19: "🀘",
  21: "🀙",
  22: "🀚",
  23: "🀛",
  24: "🀜",
  25: "🀝",
  26: "🀞",
  27: "🀟",
  28: "🀠",
  29: "🀡",
  35: "🀄︎",
};

const transArr = (arr) => {
  return arr.map((item) => {
    return transMap[item];
  });
};

const props = defineProps(["value", "disable"]);

function toggle() {
  if (props.disable) return;
  props.value.selected = !props.value.selected;
}
</script>
<template>
  <span
    :class="{
      pair: true,
      selected: props.value.selected,
      disable: props.disable,
    }"
    @click="toggle"
    >{{ transMap[props.value.value] }}</span
  >
</template>
<style scoped>
.pair {
  cursor: pointer;
  display: inline-block;
  transition: transform 0.1s;
}
.pair:hover {
  background-color: #a8a8a8;
}
.pair.selected {
  transform: translateY(-30%);
}
.pair.disable:hover {
  background-color: unset;
}
</style>