<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/25 border border-gray-200 dark:border-gray-700 p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          生產巨集轉換
        </h1>

        <!-- 語言選擇區域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              輸入語言
            </label>
            <select
              v-model="inputLang"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              輸出語言
            </label>
            <select
              v-model="outputLang"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
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
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            輸入內容
          </label>
          <textarea
            v-model="inputText"
            rows="8"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>

        <!-- 轉換按鈕 -->
        <div class="text-center mb-6">
          <button
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition duration-200 shadow-md hover:shadow-lg dark:shadow-blue-500/25"
            @click="translateContent"
          >
            開始轉換
          </button>
        </div>

        <!-- 輸出區域 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            轉換結果
          </label>
          <textarea
            v-model="outputText"
            rows="8"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            readonly
          />
        </div>

        <!-- 複製按鈕 -->
        <div class="text-center mt-4">
          <button
            v-if="outputText"
            class="text-white font-bold py-2 px-6 rounded-md transition duration-200 shadow-md hover:shadow-lg" :class="[
              copySuccess
                ? 'bg-gray-600 dark:bg-gray-500'
                : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:shadow-green-500/25',
            ]"
            @click="copyToClipboard"
          >
            {{ copySuccess ? '已複製！' : '複製結果' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// 響應式數據
const inputLang = ref('jp');
const outputLang = ref('tw');
const inputText = ref('');
const outputText = ref('');
const copySuccess = ref(false);

// 語言對照表
const translationData: Record<number, Record<string, string>> = {
  260: {
    jp: 'グレートストライド',
    en: 'Great Strides',
    cn: '阔步',
    tw: '闊步',
  },
  4574: {
    jp: 'マニピュレーション',
    en: 'Manipulation',
    cn: '掌握',
    tw: '掌握',
  },
  4631: { jp: '倹約', en: 'Waste Not', cn: '俭约', tw: '儉約' },
  4639: {
    jp: '長期倹約',
    en: 'Waste Not II',
    cn: '长期俭约',
    tw: '長期儉約',
  },
  19004: {
    jp: 'イノベーション',
    en: 'Innovation',
    cn: '改革',
    tw: '改革',
  },
  19012: {
    jp: '最終確認',
    en: 'Final Appraisal',
    cn: '最终确认',
    tw: '最終確認',
  },
  19297: {
    jp: 'ヴェネレーション',
    en: 'Veneration',
    cn: '崇敬',
    tw: '崇敬',
  },
  100001: {
    jp: '作業',
    en: 'Basic Synthesis',
    cn: '制作',
    tw: '製作',
  },
  100002: { jp: '加工', en: 'Basic Touch', cn: '加工', tw: '加工' },
  100003: {
    jp: 'マスターズメンド',
    en: 'Master\'s Mend',
    cn: '精修',
    tw: '精修',
  },
  100004: {
    jp: '中級加工',
    en: 'Standard Touch',
    cn: '中级加工',
    tw: '中級加工',
  },
  100010: { jp: '経過観察', en: 'Observe', cn: '观察', tw: '觀察' },
  100128: {
    jp: '集中加工',
    en: 'Precise Touch',
    cn: '集中加工',
    tw: '集中加工',
  },
  100203: {
    jp: '模範作業',
    en: 'Careful Synthesis',
    cn: '模范制作',
    tw: '模範製作',
  },
  100227: {
    jp: '倹約加工',
    en: 'Prudent Touch',
    cn: '俭约加工',
    tw: '儉約加工',
  },
  100283: {
    jp: '匠の早業',
    en: 'Trained Eye',
    cn: '工匠的神速技巧',
    tw: '工匠的神速技巧',
  },
  100299: {
    jp: '下地加工',
    en: 'Preparatory Touch',
    cn: '垫料加工',
    tw: '墊料加工',
  },
  100315: {
    jp: '集中作業',
    en: 'Intensive Synthesis',
    cn: '集中制作',
    tw: '集中製作',
  },
  100323: {
    jp: '精密作業',
    en: 'Delicate Synthesis',
    cn: '精密制作',
    tw: '精密製作',
  },
  100339: {
    jp: 'ビエルゴの祝福',
    en: 'Byregot\'s Blessing',
    cn: '比尔格的祝福',
    tw: '比爾格的祝福',
  },
  100355: {
    jp: 'ヘイスティタッチ',
    en: 'Hasty Touch',
    cn: '仓促',
    tw: '倉促',
  },
  100363: {
    jp: '突貫作業',
    en: 'Rapid Synthesis',
    cn: '高速制作',
    tw: '高速製作',
  },
  100371: {
    jp: '秘訣',
    en: 'Tricks of the Trade',
    cn: '秘诀',
    tw: '秘訣',
  },
  100379: {
    jp: '確信',
    en: 'Muscle Memory',
    cn: '坚信',
    tw: '堅信',
  },
  100387: { jp: '真価', en: 'Reflect', cn: '闲静', tw: '閒靜' },
  100395: {
    jp: '設計変更',
    en: 'Careful Observation',
    cn: '设计变动',
    tw: '設計變動',
  },
  100403: {
    jp: '下地作業',
    en: 'Groundwork',
    cn: '垫料制作',
    tw: '墊料製作',
  },
  100411: {
    jp: '上級加工',
    en: 'Advanced Touch',
    cn: '上级加工',
    tw: '上級加工',
  },
  100419: {
    jp: '一心不乱',
    en: 'Heart and Soul',
    cn: '专心致志',
    tw: '專心致志',
  },
  100427: {
    jp: '倹約作業',
    en: 'Prudent Synthesis',
    cn: '俭约制作',
    tw: '儉約製作',
  },
  100435: {
    jp: '匠の神業',
    en: 'Trained Finesse',
    cn: '工匠的神技',
    tw: '工匠的神技',
  },
  100443: {
    jp: '洗練加工',
    en: 'Refined Touch',
    cn: '精炼加工',
    tw: '精煉加工',
  },
  100451: {
    jp: 'デアリングタッチ',
    en: 'Daring Touch',
    cn: '冒进',
    tw: '冒進',
  },
  100459: {
    jp: 'クイックイノベーション',
    en: 'Quick Innovation',
    cn: '快速改革',
    tw: '快速改革',
  },
  100467: {
    jp: 'パーフェクトメンド',
    en: 'Immaculate Mend',
    cn: '巧夺天工',
    tw: '巧奪天工',
  },
  100475: {
    jp: '匠の絶技',
    en: 'Trained Perfection',
    cn: '工匠的绝技',
    tw: '工匠的絕技',
  },
};

// 建立反向查找表
function buildReverseLookup() {
  const reverseLookup: Record<string, Record<string, string>> = {};
  Object.keys(translationData).forEach((id) => {
    const item = translationData[Number.parseInt(id)];
    Object.keys(item).forEach((lang) => {
      if (!reverseLookup[lang]) {
        reverseLookup[lang] = {};
      }
      reverseLookup[lang][item[lang]] = id;
    });
  });
  return reverseLookup;
}

const reverseLookup = buildReverseLookup();

// 主要轉換邏輯
function translateContent() {
  if (!inputText.value.trim()) {
    alert('請輸入要轉換的內容');
    return;
  }

  const lines = inputText.value.split('\n');
  const translatedLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('/ac ')) {
      // 處理 /ac 指令
      const match = line.match(/^\/ac\s+([^<]+)(<.*>)?$/);
      if (match) {
        const skillName = match[1].trim();
        const waitPart = match[2] || '';

        // 查找技能名稱的ID
        const skillId = reverseLookup[inputLang.value] && reverseLookup[inputLang.value][skillName];

        if (skillId && translationData[Number.parseInt(skillId)]) {
          const translatedSkill = translationData[Number.parseInt(skillId)][outputLang.value];
          translatedLines.push(`/ac ${translatedSkill} ${waitPart}`);
        } else {
          // 如果找不到對應，保持原樣
          translatedLines.push(line);
        }
      } else {
        translatedLines.push(line);
      }
    } else {
      // 非 /ac 指令，保持原樣
      translatedLines.push(line);
    }
  });

  outputText.value = translatedLines.join('\n');
}

// 複製功能
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputText.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 1500);
  } catch (err) {
    console.error('複製失敗:', err);
    alert('複製失敗，請手動選取文字複製');
  }
}
</script>
