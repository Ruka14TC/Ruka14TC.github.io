/**
 * CMS API Composable
 * 整合所有 CMS 相關的 API 呼叫
 * 支援 SSG 模式，在建置時預先載入資料
 */

// ============================================
// Interfaces - Article
// ============================================

/**
 * 文章回應資料結構
 */
export interface ArticleResponse {
  articleId: number;
  title: string;
  content: string;
  menuId: number;
  menuName: string;
}

// ============================================
// Interfaces - Menu
// ============================================

/**
 * 選單連結資料結構
 */
export interface MenuLink {
  title: string;
  description: string | null;
  to: string;
  icon: string;
  target: string;
}

/**
 * 選單項目資料結構
 */
export interface MenuItem {
  title: string;
  links: MenuLink[];
  to: string | null;
  target: string | null;
  showLinkIcon: boolean;
}

/**
 * 選單回應資料結構
 */
export interface MenuResponse {
  nav: MenuItem[];
}

// ============================================
// Composable
// ============================================

/**
 * CMS API Composable
 * 提供文章和選單的 API 呼叫方法
 * 在 SSG 模式下會將資料序列化到 payload，避免客戶端重複請求
 *
 * @returns {object} API 方法集合
 * @returns {Function} fetchArticle - 取得文章資料
 * @returns {Function} fetchMenu - 根據類型取得選單資料
 */

export function useCMSAPI() {
  // 從 runtime config 取得 API Base URL
  const config = useRuntimeConfig();
  const baseURL = config.public.cmsBaseUrl;

  // ============================================
  // Article APIs
  // ============================================

  /**
   * 根據 ID 取得文章資料
   * 在 SSG 模式下，資料會在建置時載入並序列化到 payload
   *
   * @param {number} id - 文章 ID
   * @returns {Promise<ArticleResponse>} 文章資料
   * @throws {Error} 當 API 呼叫失敗時拋出錯誤
   */
  const fetchArticle = async (id: number): Promise<ArticleResponse> => {
    try {
      const response = await $fetch<ArticleResponse>(`${baseURL}/Articles/${id}`, {
        // SSG 建置時會執行此請求，並將結果快取
        // 客戶端會使用快取的資料，不會重新請求
      });
      return response;
    } catch (error) {
      console.error('[取得文章失敗]:', error);
      throw error;
    }
  };

  // ============================================
  // Menu APIs
  // ============================================

  /**
   * 取得主選單資料
   *
   * @returns {Promise<MenuResponse>} 主選單資料
   * @throws {Error} 當 API 呼叫失敗時拋出錯誤
   */
  const fetchMenu = async (): Promise<MenuResponse> => {
    try {
      const response = await $fetch<MenuResponse>(`${baseURL}/Menu`);
      return response;
    } catch (error) {
      console.error('[取得選單失敗]:', error);
      throw error;
    }
  };

  // ============================================
  // Return
  // ============================================

  return {
    // Article APIs
    fetchArticle,

    // Menu APIs
    fetchMenu,
  };
}
