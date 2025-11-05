<template>
  <template v-if="item.links">
    <UiCollapsible v-model:open="isOpen">
      <UiCollapsibleTrigger class="w-full p-2 text-left">
        <div class="flex w-full gap-1">
          {{ item.title }}
          <Icon
            :name="isOpen ? 'lucide:chevrons-down-up' : 'lucide:chevrons-up-down'"
            size="12"
            class="ml-auto self-center"
          />
        </div>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent>
        <ul class="pl-2">
          <li v-for="link in item.links" :key="link.title">
            <NuxtLinkLocale
              :to="link.to && localePath(link.to)"
              :target="link.target || '_self'"
              class="hover:bg-muted mb-1 flex w-full gap-2 rounded-md px-3 py-2 transition-all"
            >
              <template v-if="link?.icon">
                <img
                  v-if="link.icon.startsWith('http')"
                  :src="link.icon"
                  class="mt-1 min-w-5 h-4 w-4 object-contain"
                  :alt="link.title"
                >
                <SmartIcon
                  v-else
                  :name="link.icon"
                  :size="16"
                  class="mt-1 min-w-5"
                />
              </template>

              <div>
                <div v-if="link.title" class="font-semibold">
                  {{ link.title }}
                </div>
                <div v-if="link.description" class="text-muted-foreground text-sm">
                  {{ link.description }}
                </div>
              </div>
            </NuxtLinkLocale>
          </li>
        </ul>
      </UiCollapsibleContent>
    </UiCollapsible>
  </template>
  <NuxtLinkLocale
    v-else-if="item.to"
    :to="localePath(item.to)"
    :target="item.target || '_self'"
    class="flex w-full p-2"
  >
    {{ item.title }}
    <Icon
      v-if="item.showLinkIcon"
      name="lucide:arrow-up-right"
      class="text-muted-foreground ml-1"
      size="12"
    />
  </NuxtLinkLocale>
  <div v-else class="flex w-full p-2 cursor-default">
    {{ item.title }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any;
  index: number;
}>();
const { localePath } = useI18nDocs();

const collapsed = useCollapsedMap();
const isOpen = ref(collapsed.value.get(`mobile-header-nav${props.index}`) || false);
watch(isOpen, (v) => {
  collapsed.value.set(`mobile-header-nav${props.index}`, v);
});
</script>
