/**
 * Breadcrumb Composable
 * 使用選單和文章資料建立麵包屑導航
 */
import type { ArticleResponse, MenuResponse } from './useCMSAPI';

/**
 * 麵包屑項目資料結構
 */
interface BreadcrumbItem {
  title: string;
  href: string;
}

/**
 * 麵包屑 Composable
 * 根據選單結構和文章資料建立麵包屑路徑
 *
 * @param {MenuResponse | null} menu - 選單資料
 * @param {ArticleResponse | null} article - 文章資料
 * @returns {BreadcrumbItem[]} 麵包屑項目陣列
 */
export function useBreadcrumb(
  menu: MenuResponse | null,
  article: ArticleResponse | null,
): BreadcrumbItem[] {
  const breadcrumbItems: BreadcrumbItem[] = [];

  // 如果沒有選單資料,返回空陣列
  if (!menu) {
    return breadcrumbItems;
  }

  // 如果沒有文章資料,返回空陣列
  if (!article) {
    return breadcrumbItems;
  }

  // 遍歷選單尋找對應的 menuId
  for (const menuItem of menu.nav) {
    for (const link of menuItem.links) {
      // 從 link.to 取得 articleId (假設格式為 /article/{id} 或包含 id 參數)
      const match = link.to.match(/\/article\/(\d+)/) || link.to.match(/[?&]id=(\d+)/);

      if (match) {
        const linkArticleId = Number.parseInt(match[1], 10);

        // 如果找到對應的文章
        if (linkArticleId === article.articleId) {
          // 加入選單標題作為第一層
          breadcrumbItems.push({
            title: menuItem.title,
            href: menuItem.to || '#',
          });

          // 加入文章標題作為第二層
          breadcrumbItems.push({
            title: article.title,
            href: link.to,
          });

          return breadcrumbItems;
        }
      }
    }
  }

  // 如果沒有在選單中找到對應的文章,只使用文章資料
  if (article.menuName) {
    breadcrumbItems.push({
      title: article.menuName,
      href: '#',
    });
  }

  breadcrumbItems.push({
    title: article.title,
    href: `#`,
  });

  return breadcrumbItems;
}
