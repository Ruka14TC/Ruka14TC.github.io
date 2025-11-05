<template>
  <UiScrollArea orientation="vertical" class="relative h-full overflow-hidden py-6 pr-6 text-sm md:pr-4" type="hover">
    <LayoutHeaderNavMobile v-if="isMobile" class="mb-5 border-b pb-2" />
    <LayoutSearchButton v-if="config.search.inAside" />

    <!-- 頂層選單 -->
    <ul v-if="config.aside.useLevel && config.aside.levelStyle === 'aside'" class="flex flex-col gap-1 border-b pb-4">
      <li v-for="item in menuNav" :key="item.title">
        <button
          v-if="item.links.length > 0"
          class="text-foreground/80 hover:bg-muted hover:text-primary flex h-8 w-full items-center gap-2 rounded-md p-2 text-sm text-left"
          :class="[isCurrentSection(item) && 'bg-muted !text-primary font-medium']"
          @click="selectSection(item)"
        >
          <SmartIcon
            v-if="item.icon"
            :name="item.icon"
            class="self-center"
            :size="16"
          />
          {{ item.title }}
        </button>
        <div
          v-else
          class="text-foreground/80 flex h-8 items-center gap-2 rounded-md p-2 text-sm opacity-50 cursor-not-allowed"
        >
          {{ item.title }}
        </div>
      </li>
    </ul>

    <!-- 文章列表 -->
    <LayoutAsideTree
      v-if="currentLinks.length > 0"
      :links="currentLinks"
      :level="0"
      :class="[(config.aside.useLevel && config.aside.levelStyle === 'aside') ? 'pt-4' : 'pt-1']"
    />
  </UiScrollArea>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/useCMSAPI';

/**
 * 側邊欄組件
 * 顯示選單和文章列表
 *
 * Props:
 * @param {boolean} isMobile - 是否為行動裝置
 */

defineProps<{ isMobile: boolean }>();

const config = useConfig();
const route = useRoute();
const { menu } = useMenu();

// 當前選中的區段
const currentSection = ref<MenuItem | null>(null);

// 選單導航資料
const menuNav = computed(() => menu.value?.nav || []);

// 當前區段的連結列表
const currentLinks = computed(() => {
  if (!currentSection.value) {
    // 預設選擇第一個有連結的區段
    const firstSection = menuNav.value.find(item => item.links.length > 0);
    if (firstSection) {
      currentSection.value = firstSection;
      return firstSection.links;
    }
    return [];
  }
  return currentSection.value.links;
});

/**
 * 判斷是否為當前區段
 * 根據路由路徑判斷
 */
function isCurrentSection(item: MenuItem): boolean {
  if (item.links.length === 0)
    return false;
  return item.links.some(link => route.path === link.to);
}

/**
 * 選擇區段
 * 切換顯示的文章列表
 */
function selectSection(item: MenuItem) {
  currentSection.value = item;
}

// 監聽路由變化，自動切換區段
watch(() => route.path, (newPath) => {
  const matchedSection = menuNav.value.find(item =>
    item.links.some(link => link.to === newPath),
  );
  if (matchedSection) {
    currentSection.value = matchedSection;
  }
});
</script>
