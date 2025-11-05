<template>
  <UiNavigationMenu v-if="!loading && nav && nav.length > 0">
    <UiNavigationMenuList>
      <UiNavigationMenuItem v-for="(item, i) in nav" :key="i" class="relative">
        <template v-if="item.links && item.links.length > 0">
          <UiNavigationMenuTrigger class="bg-transparent font-semibold">
            {{ item.title }}
          </UiNavigationMenuTrigger>
          <UiNavigationMenuContent>
            <ul class="w-[250px] p-2">
              <li v-for="link in item.links" :key="link.title">
                <NuxtLinkLocale
                  :to="link.to && localePath(link.to)"
                  :target="link.target || '_self'"
                  class="hover:bg-muted mb-1 flex w-full gap-2 rounded-md px-3 py-2 transition-all"
                >
                  <template v-if="link?.icon">
                    <img
                      v-if="link.icon.startsWith('http')"
                      :src="link.icon"
                      class="mt-1 min-w-5 h-4 w-4 object-contain"
                      :alt="link.title"
                    >
                    <SmartIcon
                      v-else
                      :name="link.icon"
                      :size="16"
                      class="mt-1 min-w-5"
                    />
                  </template>

                  <div>
                    <div v-if="link.title" class="font-semibold">
                      {{ link.title }}
                    </div>
                    <div v-if="link.description" class="text-muted-foreground text-sm">
                      {{ link.description }}
                    </div>
                  </div>
                </NuxtLinkLocale>
              </li>
            </ul>
          </UiNavigationMenuContent>
        </template>
        <NuxtLinkLocale
          v-else-if="item.to"
          :to="localePath(item.to)"
          :target="item.target || '_self'"
        >
          <Icon
            v-if="item.showLinkIcon"
            name="lucide:arrow-up-right"
            class="text-muted-foreground absolute right-2 top-2"
            size="13"
          />
          <div
            class="bg-transparent font-semibold"
            :class="[navigationMenuTriggerStyle(), item.showLinkIcon && 'pr-6']"
          >
            {{ item.title }}
          </div>
        </NuxtLinkLocale>
        <div
          v-else
          class="bg-transparent font-semibold cursor-default"
          :class="navigationMenuTriggerStyle()"
        >
          {{ item.title }}
        </div>
      </UiNavigationMenuItem>
    </UiNavigationMenuList>
  </UiNavigationMenu>
  <div v-else-if="loading" class="flex items-center justify-center p-4">
    <div class="text-muted-foreground">
      載入中...
    </div>
  </div>
  <div v-else-if="menuError" class="flex items-center justify-center p-4">
    <div class="text-destructive">
      選單載入失敗
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 導航選單元件
 * 顯示頂部導航選單
 */
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const { localePath } = useI18nDocs();
const { menu, error: menuError, loading } = useMenu();

// 計算屬性：取得導航項目，若無資料則回傳空陣列
const nav = computed(() => menu.value?.nav || []);
</script>
