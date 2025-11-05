<template>
  <div v-bind="imageAttrs">
    <DefineTemplate>
      <NuxtImg
        :src="refinedSrc"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        class="rounded-md"
        :class="[
          props.lifted && 'rounded-lg border bg-card text-card-foreground shadow-xs',
          enableZoom && 'cursor-zoom-in',
          props.class,
        ]"
      />
    </DefineTemplate>

    <DialogRoot v-if="enableZoom">
      <DialogTrigger class="block w-full">
        <ReuseTemplate />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay
          class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
        />
        <DialogContent
          class="p-0 fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
        >
          <DialogClose>
            <img
              :src="refinedSrc"
              :alt="props.alt"
              :width="props.width"
              :height="props.height"
              class="md:rounded-lg cursor-zoom-out max-w-svw max-h-svh"
            >
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
    <ReuseTemplate v-else />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger } from 'reka-ui';
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo';

/**
 * ProseImg 元件屬性定義
 */
interface ProseImgProps {
  /** 圖片來源路徑 */
  src?: string;
  /** 圖片替代文字 */
  alt?: string;
  /** 圖片寬度 */
  width?: string | number;
  /** 圖片高度 */
  height?: string | number;
  /** 是否啟用提升效果（陰影邊框） */
  lifted?: boolean;
  /** 是否啟用縮放功能 */
  zoom?: boolean;
  /** 自訂 CSS 類別 */
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<ProseImgProps>(), {
  src: '',
  alt: '',
  lifted: false,
  zoom: undefined,
  class: '',
});

/**
 * 取得所有未定義的屬性（如 style、data-image-id 等）
 */
const attrs = useAttrs();

/**
 * 過濾出需要傳遞給根元素的屬性
 * 排除 class 屬性，因為已在內部圖片元素中處理
 */
const imageAttrs = computed(() => {
  const { class: _, ...rest } = attrs;
  return rest;
});

const config = useConfig();

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

/**
 * 處理圖片路徑，確保正確使用 baseURL
 */
const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL));
    if (_base !== '/' && !props.src.startsWith(_base))
      return joinURL(_base, props.src);
  }
  return props.src;
});

/**
 * 決定是否啟用圖片縮放功能
 * 如果未明確指定，則使用全域設定
 */
const enableZoom = computed(() => {
  if (props.zoom === undefined)
    return config.value.main.imageZoom;
  return props.zoom;
});
</script>
