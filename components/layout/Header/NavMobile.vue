<template>
  <div v-if="!loading && nav && nav.length > 0">
    <LayoutHeaderNavMobileItem
      v-for="(item, i) in nav"
      :key="i"
      :item="item"
      :index="i"
    />
  </div>
  <div v-else-if="loading" class="p-4">
    <div class="text-muted-foreground text-sm">
      載入中...
    </div>
  </div>
  <div v-else-if="menuError" class="p-4">
    <div class="text-destructive text-sm">
      選單載入失敗
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Navigation Menu Component
 * 導航選單元件
 */
const { menu, error: menuError, loading, loadMenu } = useMenu();

// 元件掛載時載入選單
onMounted(() => {
  loadMenu();
});

// 計算屬性:取得導航項目,若無資料則回傳空陣列
const nav = computed(() => menu.value?.nav || []);
</script>
