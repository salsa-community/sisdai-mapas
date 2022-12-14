const { description, version, repository } = require('./../../package')
const navbar = require('./navbar')
const sidebarDoc = require('./sidebarDoc')

module.exports = {
  /**
   * @see https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'SISDAI-MAPAS',

  /**
   * @see https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * @see https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://file.myfontastic.com/JS4TgqY9L4s8WsKQDkt5qA/icons.css',
      },
    ],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
  ],

  base: '/sisdai-mapas/',

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * @see https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    version: version,
    repo: repository['url'],
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: true,
    nav: navbar,
    sidebar: {
      '/doc/': sidebarDoc,
    },
  },

  /**
   * Apply plugins
   * @see https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],

  // Comando para construir sin el SSR
  extendCli(cli) {
    cli
      .command('buildnossr [targetDir]', 'Build without ssr')
      .action(async (sourceDir = '.', commandOptions) => {
        const { path } = require('@vuepress/shared-utils')
        const CopyPlugin = require('copy-webpack-plugin')
        const fs = require('fs')
        const App = require('@vuepress/core/lib/node/App')
        const DevProcess = require('@vuepress/core/lib/node/dev')
        const webpack = require('webpack')

        const app = new App({
          sourceDir: path.resolve(sourceDir),
          ...{ theme: '@vuepress/default' },
          ...commandOptions,
        })
        await app.process()
        app.resolveCacheLoaderOptions()

        const devProcess = new DevProcess(app)
        devProcess.prepareWebpackConfig()

        const publicDir = path.resolve(sourceDir, '.vuepress/public')
        const { outDir } = app
        if (fs.existsSync(publicDir)) {
          devProcess.webpackConfig.plugins.push(
            new CopyPlugin([{ from: publicDir, to: outDir }])
          )
        }
        await new Promise((resolve, reject) => {
          webpack(devProcess.webpackConfig, (err, stats) => {
            if (err) {
              return reject(err)
            }
            resolve(stats.toJson({ modules: false }))
          })
        })
      })
  },
}
