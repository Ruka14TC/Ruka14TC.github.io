export default defineNuxtConfig({
    ssr: true,
    nitro: {
        output: {
            dir: 'www/.output'  // 輸出到 www/.output
        },
        prerender: {
            routes: ['/']
        }
    },
    app: {
        head: {
            meta: [
                { 'http-equiv': 'refresh', content: '0;url=https://ruka14.web.app/' }
            ],
            link: [
                { rel: 'canonical', href: 'https://ruka14.web.app/' }
            ]
        }
    }
})