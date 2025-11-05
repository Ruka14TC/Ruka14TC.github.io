<template>
  <li>
    <NuxtLink
      :to="link.to"
      :target="link.target"
      class="text-foreground/80 hover:bg-muted hover:text-primary flex items-center gap-2 rounded-md p-2 text-sm h-8"
      :class="[
        isActive && 'bg-muted !text-primary font-medium',
      ]"
    >
      <LayoutAsideTreeItemButton :link />
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import type { MenuLink } from '~/composables/useCMSAPI';

/**
 * 側邊欄樹狀項目組件
 * 顯示單一文章連結
 *
 * Props:
 * @param {MenuLink} link - 連結資料
 * @param {number} level - 層級深度（目前未使用）
 */

const { link } = defineProps<{
  link: MenuLink;
  level: number;
}>();

const route = useRoute();

/**
 * 判斷是否為當前啟用的連結
 * 比對路由路徑
 */
const isActive = computed(() => link.to === route.path);
</script>
