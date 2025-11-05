/**
 * Article Composable
 * 管理文章資料的載入和狀態
 */
import type { ArticleResponse } from './useCMSAPI';

/**
 * 文章管理 Composable
 * 自動處理文章資料的載入、快取和錯誤處理
 * 支援多文章快取機制
 *
 * @returns {object} 文章管理物件
 * @returns {Ref<ArticleResponse | null>} article - 當前文章資料
 * @returns {Ref<any>} parsedContent - 解析後的內容
 * @returns {Ref<boolean>} error - 錯誤狀態
 * @returns {Ref<boolean>} loading - 載入狀態
 * @returns {Function} loadArticle - 載入文章方法
 */

export function useArticle() {
  // 當前文章資料
  const article = useState<ArticleResponse | null>('current-article', () => null);

  // 解析後的內容
  const parsedContent = useState<any>('parsed-content', () => null);

  // 錯誤狀態
  const error = useState<boolean>('article-error', () => false);

  // 載入狀態
  const loading = useState<boolean>('article-loading', () => false);

  // 文章快取 (用 Map 儲存多個文章)
  const articleCache = useState<Map<number, ArticleResponse>>('article-cache', () => new Map());

  /**
   * 載入文章資料
   * 優先使用快取資料,若無快取則從 API 載入
   *
   * @param {number} id - 文章 ID
   * @param {boolean} forceReload - 是否強制重新載入 (預設: false)
   */
  const loadArticle = async (id: number, forceReload: boolean = false) => {
    // 檢查快取中是否有該文章且不強制重新載入
    if (articleCache.value.has(id) && !forceReload) {
      article.value = articleCache.value.get(id)!;
      error.value = false;
      return;
    }

    // 如果正在載入中,避免重複請求
    if (loading.value) {
      return;
    }

    loading.value = true;
    error.value = false;

    try {
      const { fetchArticle } = useCMSAPI();
      const data = await fetchArticle(id);

      // 更新當前文章
      article.value = data;

      // 儲存到快取
      articleCache.value.set(id, data);

      // 清空解析內容 (新文章需要重新解析)
      parsedContent.value = null;
    } catch (err) {
      console.error('Failed to load article:', err);
      error.value = true;
      article.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 清除文章快取
   *
   * @param {number} id - 要清除的文章 ID,若不提供則清除全部
   */
  const clearCache = (id?: number) => {
    if (id !== undefined) {
      articleCache.value.delete(id);
    } else {
      articleCache.value.clear();
    }
  };

  return {
    article,
    parsedContent,
    error,
    loading,
    loadArticle,
    clearCache,
  };
}
