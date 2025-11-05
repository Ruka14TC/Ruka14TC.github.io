export default defineNuxtPlugin(() => {
  const { enable, dataWebsiteId, src } = useConfig().value.site.umami;
  const { initializeMenu } = useMenu();
  if (enable && !import.meta.dev) {
    // 初始化選單資料
    initializeMenu();
    useScriptUmamiAnalytics({
      scriptInput: {
        src,
        defer: true,
      },
      websiteId: dataWebsiteId,
    });
  }
});
