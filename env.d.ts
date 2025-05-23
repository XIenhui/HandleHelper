/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

// 如果你有 .vue 文件类型错误也加上：
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}