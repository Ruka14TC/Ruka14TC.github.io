<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <!-- 卡片內容 -->
    <div class="p-6 space-y-6">
      <!-- 戰利品類別區域 -->
      <div
        v-for="category in lootCategories"
        :key="category.id"
        class="space-y-3"
      >
        <!-- 道具卡片網格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="border rounded-lg p-4 space-y-3"
            :class="category.cardClass"
          >
            <!-- 道具圖片 -->
            <div class="flex justify-center">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 rounded-md object-contain"
              >
            </div>

            <!-- 道具資訊 -->
            <div class="text-center">
              <div class="font-semibold" :class="category.nameClass">
                {{ item.name }}
              </div>
              <div class="text-sm text-muted-foreground">
                單價：{{ formatPrice(item.price) }}
              </div>
            </div>

            <!-- 數量輸入 -->
            <input
              v-model.number="loot[item.id]"
              type="number"
              min="0"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >

            <!-- 小計顯示 -->
            <div class="text-center text-sm font-medium text-primary">
              小計：{{ formatPrice(getSubtotal(item.id, item.price)) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 總價顯示 -->
      <div class="pt-4 border-t">
        <div class="text-center text-2xl font-bold text-primary">
          總價：{{ formatPrice(totalPrice) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 潛水艇戰利品計算器元件（Nuxt 3 版本）
 *
 * 功能摘要:
 * - 計算 FF14 部隊潛水艇打撈戰利品的總價值
 * - 使用資料驅動的方式動態渲染道具卡片
 * - 支援明暗主題切換（透過 shadcn/ui）
 * - 符合 Nuxt 3 的 Auto-imports 規範
 */

/**
 * 戰利品類別資料
 *
 * 將所有道具依類別組織，方便動態渲染
 * 包含上等沈船系列（高價）與一般沈船系列
 */
const lootCategories = [
  {
    id: 'super',
    cardClass: 'bg-muted/20',
    titleClass: 'text-primary',
    nameClass: 'text-primary',
    items: [
      {
        id: 'superNecklace',
        name: '上等沈船項鍊',
        price: 34500,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/3/3f/51f34679964ea8cd9685deefe5930d5e8c0b0076.png',
      },
      {
        id: 'superEarring',
        name: '上等沈船耳飾',
        price: 30000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/b/b5/7b63a24c89baadeba97b4515561112bec749a333.png',
      },
      {
        id: 'superBracelet',
        name: '上等沈船手鐲',
        price: 28500,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/f/fd/69bbb4cd6455f0f8c883042525a9528653b08150.png',
      },
      {
        id: 'superRing',
        name: '上等沈船戒指',
        price: 27000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/4/40/7659721be6f4f3e57c19da550c5fda38a62e22cc.png',
      },
    ],
  },
  {
    id: 'normal',
    cardClass: 'bg-card',
    titleClass: '',
    nameClass: '',
    items: [
      {
        id: 'necklace',
        name: '沈船項鍊',
        price: 13000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/d/d3/908b54b61a9b4e0bce74adfddaf2ae3e5120c66b.png',
      },
      {
        id: 'earring',
        name: '沈船耳飾',
        price: 10000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/2/22/433dda1e45ec51ebf0cf765a1392b33317732095.png',
      },
      {
        id: 'bracelet',
        name: '沈船手鐲',
        price: 9000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/c/c3/72d21c3b21bec20424e923e18bf15a2f6af96ac2.png',
      },
      {
        id: 'ring',
        name: '沈船戒指',
        price: 8000,
        image:
          'https://huiji-public.huijistatic.com/ff14/uploads/c/c4/1c6d4fb8f8b25465071ec8f2ee23a247b42f6b36.png',
      },
    ],
  },
];

/**
 * 戰利品數量
 *
 * 儲存各道具的打撈數量
 * 預設值皆為 0
 */
const loot = ref({
  necklace: 0,
  earring: 0,
  bracelet: 0,
  ring: 0,
  superNecklace: 0,
  superEarring: 0,
  superBracelet: 0,
  superRing: 0,
});

/**
 * 計算總價值
 *
 * 遍歷所有類別與道具，累加總價值
 *
 * @returns {number} 總價值
 */
const totalPrice = computed(() => {
  let total = 0;
  for (const category of lootCategories) {
    for (const item of category.items) {
      total += (loot.value[item.id] || 0) * item.price;
    }
  }
  return total;
});

/**
 * 取得單項戰利品小計
 *
 * @param {string} itemId - 道具識別碼
 * @param {number} price - 道具單價
 * @returns {number} 小計金額
 */
function getSubtotal(itemId, price) {
  return (loot.value[itemId] || 0) * price;
}

/**
 * 格式化價格顯示
 *
 * 將數字加上千分位逗號
 *
 * @param {number} price - 價格數字
 * @returns {string} 格式化後的價格字串
 */
function formatPrice(price) {
  return price.toLocaleString();
}
</script>
