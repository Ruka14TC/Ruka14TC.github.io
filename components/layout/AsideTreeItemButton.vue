<template>
  <!-- 圖示：支援 URL 或 icon name -->
  <img
    v-if="isImageUrl(link.icon)"
    :src="link.icon"
    :alt="link.title"
    class="min-w-4 w-4 h-4 object-cover rounded"
  >
  <SmartIcon
    v-else-if="link.icon"
    :name="link.icon"
    class="min-w-4"
  />

  <!-- 標題 -->
  <span class="truncate text-nowrap">
    {{ link.title }}
  </span>

  <!-- 描述（如果有） -->
  <span v-if="link.description" class="text-xs text-foreground/60 truncate">
    {{ link.description }}
  </span>
</template>

<script setup lang="ts">
import type { MenuLink } from '~/composables/useCMSAPI';

/**
 * 側邊欄項目按鈕組件
 * 顯示連結的圖示、標題和描述
 *
 * Props:
 * @param {MenuLink} link - 連結資料
 */

const { link } = defineProps<{
  link: MenuLink;
}>();

/**
 * 判斷是否為圖片 URL
 * 檢查是否以 http:// 或 https:// 開頭
 *
 * @param {string} icon - 圖示字串
 * @returns {boolean} 是否為圖片 URL
 */
function isImageUrl(icon: string): boolean {
  if (!icon)
    return false;
  return icon.startsWith('http://') || icon.startsWith('https://');
}
</script>
