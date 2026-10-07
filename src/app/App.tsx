import { NotePage } from './pages/note/NotePage'

/**
 * 应用壳。
 *
 * 本轮只有一个页面,所以没有路由——加 router 是新依赖且无收益。
 * 等第二个页面出现时再引入,这里就是挂路由的地方(architecture/web.md: `app/` 管路由与布局)。
 */
export function App() {
  return <NotePage />
}
