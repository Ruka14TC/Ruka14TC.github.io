<template>
  <div
    class="px-4 py-6 md:px-8"
    :class="[config.main.padded && 'container']"
  >
    <ContentRenderer
      :key="pageData._id"
      :value="pageData"
      :data="(appConfig.shadcnDocs as any)?.data"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Index 頁面元件
 */

// 取得設定
const config = useConfig();
const appConfig = useAppConfig();

// 寫死的頁面資料
const pageData = ref({
  _id: 'index',
  title: 'Ruka14TC',
  description: '放一些小設定、攻略、便利工具、快速連結的小站',
  navigation: false,
  body: {
    type: 'root',
    children: [
      {
        type: 'element',
        tag: 'hero',
        props: {
          announcement: {
            title: 'FF14繁中官網',
            icon: 'https://www.ffxiv.com.tw/web//images/favicon.ico',
            to: 'https://www.ffxiv.com.tw/',
          },
          actions: [
            {
              name: 'Get Started',
              to: '/setting/1',
            },
          ],
        },
        children: [
          {
            type: 'element',
            tag: 'template',
            props: { '#title': true },
            children: [
              {
                type: 'text',
                value: 'Ruka FF14 筆記本',
              },
            ],
          },
          {
            type: 'element',
            tag: 'template',
            props: { '#description': true },
            children: [
              {
                type: 'text',
                value: '放一些小設定、攻略、便利工具、快速連結的小站',
              },
            ],
          },
        ],
      },
    ],
  },
});

// SEO Meta 設定
useSeoMeta({
  title: `${pageData.value.title} - ${config.value.site.name}`,
  ogTitle: pageData.value.title,
  description: pageData.value.description,
  ogDescription: pageData.value.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
});
</script>
