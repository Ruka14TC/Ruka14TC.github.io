/**
 * Menu Composable
 * 管理選單資料的載入和狀態
 * 支援 SSG 模式，在建置時預先載入選單資料
 */
import type { MenuResponse } from './useCMSAPI';

/**
 * 選單管理 Composable
 * 自動處理選單資料的載入、快取和錯誤處理
 * 在 SSG 模式下會將選單資料序列化到 payload
 *
 * @returns {object} 選單管理物件
 * @returns {Ref<MenuResponse | null>} menu - 選單資料
 * @returns {Ref<boolean>} error - 錯誤狀態
 * @returns {Ref<boolean>} loading - 載入狀態
 * @returns {Function} loadMenu - 載入選單方法
 * @returns {Function} initializeMenu - 初始化選單（用於 SSG）
 */

export function useMenu() {
  // 選單資料
  const menu = useState<MenuResponse | null>('menu', () => null);

  // 錯誤狀態
  const error = useState<boolean>('menu-error', () => false);

  // 載入狀態
  const loading = useState<boolean>('menu-loading', () => false);

  /**
   * 載入選單資料
   * 如果已有快取資料則直接使用，避免重複請求
   *
   * @param {boolean} forceReload - 是否強制重新載入（預設: false）
   */
  const loadMenu = async (forceReload: boolean = false) => {
    // 如果已經有快取資料且不強制重新載入，直接返回
    if (menu.value && !forceReload) {
      return;
    }

    // 如果正在載入中，避免重複請求
    if (loading.value) {
      return;
    }

    loading.value = true;
    error.value = false;

    try {
      const { fetchMenu } = useCMSAPI();
      const data = await fetchMenu();
      menu.value = data;
    } catch (err) {
      console.error('[載入選單失敗]:', err);
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 初始化選單（用於 SSG 和應用啟動時）
   * 使用 useAsyncData 確保資料在 SSG 時被序列化到 payload
   *
   * @returns {Promise<void>}
   */
  const initializeMenu = async () => {
    const { data } = await useAsyncData(
      'global-menu',
      async () => {
        try {
          const { fetchMenu } = useCMSAPI();
          const menuData = await fetchMenu();
          return menuData;
        } catch (err) {
          console.error('[初始化選單失敗]:', err);
          return null;
        }
      },
      {
        // 關鍵設定：在客戶端使用快取的資料
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp();
          const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
          if (cached) {
            menu.value = cached;
          }
          return cached;
        },
      },
    );

    // 設定選單資料
    if (data.value) {
      menu.value = data.value;
    }
  };

  return {
    menu,
    error,
    loading,
    loadMenu,
    initializeMenu,
  };
}
