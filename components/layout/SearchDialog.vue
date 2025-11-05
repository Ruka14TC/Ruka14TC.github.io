<template>
  <UiDialog v-model:open="open">
    <UiDialogContent class="p-0">
      <VisuallyHidden as-child>
        <UiDialogTitle />
      </VisuallyHidden>
      <VisuallyHidden as-child>
        <UiDialogDescription aria-describedby="undefined" />
      </VisuallyHidden>
      <UiCommand class="h-svh sm:h-[350px]">
        <UiCommandInputOnly
          v-model="input"
          :loading="searchLoading"
          :placeholder="$t(placeholderDetailed)"
          @keydown.enter="handleEnter"
          @keydown.down="handleNavigate(1)"
          @keydown.up="handleNavigate(-1)"
        />
        <UiCommandList class="text-sm" @escape-key-down="open = false">
          <template v-if="!input?.length">
            <template v-for="item in navigation" :key="item._path">
              <UiCommandGroup v-if="item.children" :heading="item.title" class="p-1.5">
                <NuxtLinkLocale v-for="child in item.children" :key="child._path" :to="child._path">
                  <UiCommandItem :value="child._path">
                    <SmartIcon v-if="getChildIcon(item, child)" :name="getChildIcon(item, child)" class="mr-2 size-4" />
                    <div v-else class="mr-2 size-4" />
                    <span>{{ child.title }}</span>
                  </UiCommandItem>
                </NuxtLinkLocale>
              </UiCommandGroup>
              <UiCommandSeparator v-if="item.children" />
            </template>
            <UiCommandGroup v-if="darkModeToggle" heading="Theme" class="p-1.5">
              <UiCommandItem value="light" @click="colorMode.preference = 'light'">
                <Icon name="lucide:sun" class="mr-2 size-4" />
                <span>{{ $t('Light') }}</span>
              </UiCommandItem>
              <UiCommandItem value="dark" @click="colorMode.preference = 'dark'">
                <Icon name="lucide:moon" class="mr-2 size-4" />
                <span>{{ $t('Dark') }}</span>
              </UiCommandItem>
              <UiCommandItem value="system" @click="colorMode.preference = 'auto'">
                <Icon name="lucide:monitor" class="mr-2 size-4" />
                <span>{{ $t('System') }}</span>
              </UiCommandItem>
            </UiCommandGroup>
          </template>
          <div v-else-if="searchResult?.length" class="p-1.5">
            <NuxtLinkLocale
              v-for="(item, i) in searchResult"
              :id="i"
              :key="item.id"
              :to="item.id"
              class="hover:bg-muted flex select-none rounded-md p-2 hover:cursor-pointer"
              :class="[i === activeSelect && 'bg-muted']"
              @click="open = false; activeSelect = i;"
            >
              <SmartIcon v-if="getItemIcon(item.id)" :name="getItemIcon(item.id)" class="mr-2 size-4 shrink-0 self-center" />
              <div v-else class="mr-2 size-4 shrink-0" />

              <span v-for="(subtitle, j) in item.titles" :key="`${subtitle}${j}`" class="flex shrink-0 self-center">
                {{ subtitle }}
                <Icon name="lucide:chevron-right" class="text-muted-foreground mx-0.5 self-center" />
              </span>
              <span class="shrink-0 self-center">
                {{ item.title }}
              </span>
              <span class="text-muted-foreground ml-2 self-center truncate text-xs" v-html="getHighlightedContent(item.content)" />
            </NuxtLinkLocale>
          </div>
          <div v-else class="text-muted-foreground pt-4 text-center">
            {{ $t('No results found.') }}
          </div>
        </UiCommandList>
      </UiCommand>
    </UiDialogContent>
  </UiDialog>
</template>

<script setup lang="ts">
/**
 * SearchDialog 元件
 * 使用選單資料進行搜尋和顯示
 */
import { VisuallyHidden } from 'reka-ui';

// 取得設定
const { darkModeToggle } = useConfig().value.header;
const { placeholderDetailed } = useConfig().value.search;

// Dialog 開關狀態
const open = defineModel<boolean>('open');

// 顏色模式
const colorMode = useColorMode();

// 目前選取的項目索引
const activeSelect = ref(0);

// 鍵盤快捷鍵 (Cmd/Ctrl + K)
const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey))
      e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1])
    open.value = true;
});

// 搜尋相關狀態
const input = ref('');
const searchResult = ref();
const searchLoading = ref(false);

// 取得導航資料
const { localizeSearchResult, navigation } = useI18nDocs();

// 監聽搜尋輸入
watch(
  input,
  async (v) => {
    activeSelect.value = 0;
    if (!v)
      return;

    searchLoading.value = true;
    const result = (await searchContent(v)).value;

    searchResult.value = localizeSearchResult(result);
    searchLoading.value = false;
  },
);

/**
 * 取得子項目的圖示
 * 從選單資料中尋找對應的 icon
 *
 * @param {any} item - 父選單項目
 * @param {any} child - 子選單項目
 * @returns {string | undefined} 圖示名稱
 */
function getChildIcon(item: any, child: any) {
  return child.icon || item.icon;
}

/**
 * 取得搜尋結果項目的圖示
 * 從選單資料中尋找對應路徑的 icon
 *
 * @param {string} path - 項目路徑
 * @returns {string | undefined} 圖示名稱
 */
function getItemIcon(path: string) {
  // 在 navigation 中尋找對應的路徑
  for (const item of navigation.value) {
    if (item.children) {
      for (const child of item.children) {
        if (child._path === path) {
          return (child as any).icon || (item as any).icon;
        }
      }
    }
    if (item._path === path) {
      return (item as any).icon;
    }
  }
  return undefined;
}

/**
 * 高亮顯示搜尋關鍵字
 *
 * @param {string} text - 原始文字
 * @returns {string} 包含 HTML 標記的高亮文字
 */
function getHighlightedContent(text: string) {
  return text.replace(input.value, `<span class="font-semibold underline">${input.value}</span>`);
}

// 監聽選取項目變化,自動捲動到可視範圍
watch(activeSelect, (value) => {
  document.querySelector(`[id="${value}"]`)?.scrollIntoView({ block: 'nearest' });
});

/**
 * 處理 Enter 鍵按下事件
 * 導航到選取的搜尋結果
 */
async function handleEnter() {
  if (searchResult.value[activeSelect.value]?.id) {
    await navigateTo(searchResult.value[activeSelect.value].id);
    open.value = false;
  }
}

/**
 * 處理上下方向鍵導航
 *
 * @param {-1 | 1} delta - 移動方向 (-1: 上, 1: 下)
 */
function handleNavigate(delta: -1 | 1) {
  if (activeSelect.value + delta >= 0 && activeSelect.value + delta < searchResult.value.length)
    activeSelect.value += delta;
}

// 監聽路由變化,關閉對話框
const router = useRouter();

watch(
  () => router.currentRoute.value,
  () => {
    open.value = false;
  },
);
</script>
