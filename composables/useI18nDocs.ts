/**
 * I18n Docs Composable
 * 移除多語言功能,使用單語言處理
 * 保持介面不變以防止其他元件損壞
 */
import type { SearchResult } from 'minisearch';

/**
 * I18n Docs Composable
 * 提供單語言版本的國際化工具
 * 所有多語言功能都回傳預設值或空資料
 *
 * @returns {object} I18n 工具物件
 */
export function useI18nDocs() {
  // 停用 i18n 功能
  const i18nEnabled = false;

  // 取得選單資料
  const { menu } = useMenu();

  // 單語言設定
  const locale = ref('zh-TW');
  const locales = ref([{ code: 'zh-TW', name: '繁體中文' }]);
  const defaultLocale = ref('zh-TW');
  const availableLocales = ref(['zh-TW']);
  const otherLocales = ref<string[]>([]);

  /**
   * 轉換選單資料為 navigation 格式
   */
  const localizedNavigation = computed(() => {
    if (!menu.value) {
      return [];
    }

    // 將選單資料轉換為 NavItem 格式
    return menu.value.nav.map(item => ({
      _path: item.to || '#',
      title: item.title,
      children: item.links.map(link => ({
        _path: link.to,
        title: link.title,
        description: link.description,
      })),
    }));
  });

  /**
   * 上一頁導航
   * 單語言模式下返回 null
   */
  const localizedPrev = computed(() => null);

  /**
   * 下一頁導航
   * 單語言模式下返回 null
   */
  const localizedNext = computed(() => null);

  /**
   * 路徑本地化函式
   * 單語言模式下直接返回原路徑
   *
   * @param {string} path - 原始路徑
   * @returns {string} 本地化後的路徑(單語言下不變)
   */
  const localePath = (path: string) => path;

  /**
   * 搜尋結果本地化過濾
   * 單語言模式下直接返回原結果
   *
   * @param {SearchResult[]} result - 搜尋結果
   * @returns {SearchResult[]} 過濾後的搜尋結果(單語言下不變)
   */
  const localizeSearchResult = (result: SearchResult[]) => result;

  /**
   * 語言切換路徑函式
   * 單語言模式下直接返回原路徑
   *
   * @param {string} localeCode - 語言代碼(單語言下無作用)
   * @returns {string} 切換後的路徑(單語言下不變)
   */
  const switchLocalePath = (localeCode?: string) => {
    const route = useRoute();
    return route.path;
  };

  return {
    // 功能開關
    i18nEnabled,

    // 語言設定
    locale,
    locales,
    defaultLocale,
    availableLocales,
    otherLocales,

    // 導航資料
    navigation: localizedNavigation,
    prev: localizedPrev,
    next: localizedNext,

    // 工具函式
    localePath,
    localizeSearchResult,
    switchLocalePath,
  };
}
