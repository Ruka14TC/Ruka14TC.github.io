<template>
  <ul
    class="flex flex-col gap-1 py-1"
    :class="[level > 0 && 'mx-3.5 border-l px-2.5']"
  >
    <template v-for="link in links" :key="link.to">
      <LayoutAsideTreeItem
        :link="link"
        :level="level"
      />
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { MenuLink } from '~/composables/useCMSAPI';

/**
 * 側邊欄樹狀結構組件
 * 顯示文章連結列表
 *
 * Props:
 * @param {MenuLink[]} links - 連結列表
 * @param {number} level - 層級深度（目前固定為 0，不支援巢狀）
 */

defineProps<{
  links: MenuLink[];
  level: number;
}>();
</script>
