<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <!-- 卡片標題 -->
    <div class="border-b bg-muted/40 px-6 py-4">
      <h1 class="text-2xl font-semibold tracking-tight">
        生產巨集轉換
      </h1>
    </div>

    <!-- 卡片內容 -->
    <div class="p-6 space-y-6">
      <!-- 語言選擇區域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 輸入語言 -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">
            輸入語言
          </label>
          <select
            v-model="inputLang"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="jp">
              日文
            </option>
            <option value="en">
              英文
            </option>
            <option value="cn">
              簡體中文
            </option>
            <option value="tw">
              繁體中文
            </option>
          </select>
        </div>

        <!-- 輸出語言 -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">
            輸出語言
          </label>
          <select
            v-model="outputLang"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="jp">
              日文
            </option>
            <option value="en">
              英文
            </option>
            <option value="cn">
              簡體中文
            </option>
            <option value="tw">
              繁體中文
            </option>
          </select>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="space-y-2">
        <label class="text-sm font-medium leading-none">
          輸入內容
        </label>
        <textarea
          v-model="inputText"
          rows="8"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="請輸入要轉換的巨集內容..."
        />
      </div>

      <!-- 轉換按鈕 -->
      <div class="flex justify-center">
        <button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
          @click="translateContent"
        >
          開始轉換
        </button>
      </div>

      <!-- 輸出區域 -->
      <div class="space-y-2">
        <label class="text-sm font-medium leading-none">
          轉換結果
        </label>
        <textarea
          v-model="outputText"
          rows="8"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          readonly
        />
      </div>

      <!-- 複製按鈕 -->
      <div v-if="outputText" class="flex justify-center">
        <button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-6"
          :class="[
            copySuccess
              ? 'bg-muted text-muted-foreground cursor-default'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          ]"
          @click="copyToClipboard"
        >
          {{ copySuccess ? '已複製!' : '複製結果' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCraftActions } from '~/composables/useCraftActions';

/**
 * 生產巨集轉換器元件
 *
 * 功能摘要:
 * - 提供技能巨集的多語言轉換功能
 * - 支援日文、英文、簡體中文、繁體中文
 * - 自動載入翻譯資料
 * - 提供一鍵複製功能
 */

// 使用 composable 取得翻譯功能
const { loadTranslations, translateMacro } = useCraftActions();

// 響應式資料
const inputLang = ref('jp'); // 輸入語言,預設日文
const outputLang = ref('tw'); // 輸出語言,預設繁體中文
const inputText = ref(''); // 使用者輸入的巨集內容
const outputText = ref(''); // 轉換後的巨集內容
const copySuccess = ref(false); // 複製成功狀態

/**
 * 元件掛載時載入翻譯資料
 *
 * 功能說明:
 * - 在元件載入時自動載入 translations.json
 * - 如果載入失敗會顯示錯誤提示
 */
onMounted(async () => {
  try {
    await loadTranslations();
  } catch (error) {
    alert('載入翻譯資料失敗,請重新整理頁面');
  }
});

/**
 * 執行巨集轉換
 *
 * 功能說明:
 * - 驗證輸入內容是否為空
 * - 呼叫 translateMacro 進行轉換
 * - 將結果顯示在輸出區域
 */
function translateContent() {
  // 檢查是否有輸入內容
  if (!inputText.value.trim()) {
    alert('請輸入要轉換的內容');
    return;
  }

  // 執行轉換
  outputText.value = translateMacro(
    inputText.value,
    inputLang.value,
    outputLang.value,
  );
}

/**
 * 複製結果到剪貼簿
 *
 * 功能說明:
 * - 使用 Clipboard API 複製轉換結果
 * - 顯示複製成功提示 1.5 秒
 * - 如果複製失敗,提示使用者手動複製
 */
async function copyToClipboard() {
  try {
    // 使用現代 Clipboard API
    await navigator.clipboard.writeText(outputText.value);

    // 顯示複製成功狀態
    copySuccess.value = true;

    // 1.5秒後恢復按鈕狀態
    setTimeout(() => {
      copySuccess.value = false;
    }, 1500);
  } catch (err) {
    // 複製失敗時的錯誤處理
    console.error('複製失敗:', err);
    alert('複製失敗,請手動選取文字複製');
  }
}
</script>
