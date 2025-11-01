import { ref } from 'vue';

/**
 * 技能翻譯資料型別定義
 * 每個技能ID對應多個語言的名稱
 */
type TranslationData = Record<number, Record<string, string>>;

/**
 * 反向查找表型別
 * 用於從技能名稱查找對應的技能ID
 */
type ReverseLookup = Record<string, Record<string, string>>;

/**
 * 生產巨集翻譯 Composable
 *
 * 功能摘要:
 * - 載入並管理技能翻譯資料
 * - 提供技能名稱的語言轉換功能
 * - 建立反向查找表以快速查找技能ID
 *
 * @returns {object} 包含翻譯資料和相關方法的物件
 */
export function useCraftActions() {
  // 翻譯資料儲存
  const translationData = ref<TranslationData>({});

  // 反向查找表：從技能名稱找ID
  const reverseLookup = ref<ReverseLookup>({});

  // 載入狀態
  const isLoaded = ref(false);

  /**
   * 從JSON檔案載入翻譯資料
   *
   * 功能說明:
   * - 從 public/data/translations.json 載入資料
   * - 建立反向查找表以提升查詢效能
   * - 只會載入一次,避免重複請求
   */
  async function loadTranslations() {
    // 如果已載入則跳過
    if (isLoaded.value)
      return;

    try {
      // 從public目錄載入JSON資料
      const response = await fetch('/translations.json');
      const data = await response.json();

      // 將字串鍵轉換為數字鍵
      translationData.value = Object.keys(data).reduce((acc, key) => {
        acc[Number.parseInt(key)] = data[key];
        return acc;
      }, {} as TranslationData);

      // 建立反向查找表
      buildReverseLookup();

      isLoaded.value = true;
    } catch (error) {
      console.error('載入翻譯資料失敗:', error);
      throw error;
    }
  }

  /**
   * 建立反向查找表
   *
   * 功能說明:
   * - 將 {id: {lang: name}} 轉換為 {lang: {name: id}}
   * - 讓我們可以透過技能名稱快速找到對應的ID
   *
   * 範例:
   * 原始: {260: {jp: "グレートストライド", en: "Great Strides"}}
   * 轉換: {jp: {"グレートストライド": "260"}, en: {"Great Strides": "260"}}
   */
  function buildReverseLookup() {
    const lookup: ReverseLookup = {};

    Object.keys(translationData.value).forEach((id) => {
      const item = translationData.value[Number.parseInt(id)];

      // 為每個語言建立名稱到ID的映射
      Object.keys(item).forEach((lang) => {
        if (!lookup[lang]) {
          lookup[lang] = {};
        }
        lookup[lang][item[lang]] = id;
      });
    });

    reverseLookup.value = lookup;
  }

  /**
   * 翻譯單個技能名稱
   *
   * @param skillName - 技能名稱
   * @param fromLang - 來源語言
   * @param toLang - 目標語言
   * @returns 翻譯後的技能名稱,如果找不到則返回原名稱
   *
   * 功能說明:
   * 1. 透過反向查找表找到技能ID
   * 2. 使用ID查找目標語言的名稱
   * 3. 如果任何步驟失敗,返回原名稱
   */
  function translateSkill(skillName: string, fromLang: string, toLang: string): string {
    // 從反向查找表找到技能ID
    const skillId = reverseLookup.value[fromLang]?.[skillName];

    if (!skillId) {
      return skillName; // 找不到對應ID,返回原名稱
    }

    // 使用ID查找目標語言的名稱
    const translatedName = translationData.value[Number.parseInt(skillId)]?.[toLang];

    return translatedName || skillName; // 如果找不到翻譯,返回原名稱
  }

  /**
   * 翻譯整個巨集內容
   *
   * @param content - 巨集內容(多行文字)
   * @param fromLang - 來源語言
   * @param toLang - 目標語言
   * @returns 翻譯後的巨集內容
   *
   * 功能說明:
   * - 逐行處理巨集內容
   * - 只翻譯 /ac 開頭的指令行
   * - 保留等待時間參數 <wait.X>
   * - 非指令行保持原樣
   *
   * 支援格式:
   * - /ac 技能名稱
   * - /ac 技能名稱 <wait.3>
   */
  function translateMacro(content: string, fromLang: string, toLang: string): string {
    const lines = content.split('\n');
    const translatedLines: string[] = [];

    lines.forEach((line) => {
      // 檢查是否為 /ac 指令
      if (line.startsWith('/ac ')) {
        // 使用正則表達式解析指令
        // 格式: /ac 技能名稱 或 /ac 技能名稱 <wait.X>
        const match = line.match(/^\/ac\s+([^<]+)(<.*>)?$/);

        if (match) {
          const skillName = match[1].trim(); // 技能名稱
          const waitPart = match[2] || ''; // 等待時間參數(可選)

          // 翻譯技能名稱
          const translatedSkill = translateSkill(skillName, fromLang, toLang);

          // 重組指令行
          translatedLines.push(`/ac ${translatedSkill} ${waitPart}`.trim());
        } else {
          // 格式不符,保持原樣
          translatedLines.push(line);
        }
      } else {
        // 非 /ac 指令,保持原樣
        translatedLines.push(line);
      }
    });

    return translatedLines.join('\n');
  }

  // 返回公開的API
  return {
    translationData,
    reverseLookup,
    isLoaded,
    loadTranslations,
    translateSkill,
    translateMacro,
  };
}
