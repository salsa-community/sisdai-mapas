/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

//import "dai-maps/dist/dai-maps.css"
// import "../../src/styles/main.scss";
// import 'sisdai-css/src/eni.scss'

//import SisdaiMapas from "dai-maps"
import SisdaiMapas from '../../src/index.js'

// import './styles/general.scss'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  Vue.use(SisdaiMapas)
  // ...apply enhancements for the site.
}
