import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from './pinia'; // 引入配置好的Pinia
import 'virtual:windi.css'
import './styles/global.scss'
// import uviewPlus from 'uview-plus'
// @ts-ignore 忽略类型检查，因为pingpp.js没有类型声明文件
export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  // app.use(uviewPlus)
  return {
    app
  }
}
