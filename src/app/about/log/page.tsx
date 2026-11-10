import SubPageHeader from "@/components/sub-header";

const TIMELINE = [
  {
    day: "第 1 天",
    title: "把三个想法收敛成一个",
    body: "原始需求是「宠物交友 + 线下聚会 + 品牌活动」。三个一起做两周做不完，而且每个都浅。拆开看发现它们不是三个功能，是三层：活动是单边成立的，交友是双边成立的。于是先做活动。",
  },
  {
    day: "第 1 天",
    title: "搭出骨架",
    body: "首页卡片流、活动列表、圈子、我的，四个 Tab 先跑通。同一天接上 7 个物种和全国三级地区（31 省 / 342 市 / 3056 区县）。",
  },
  {
    day: "第 2 天",
    title: "筛选、推荐、还有一致性",
    body: "9 个筛选维度、按宠物算出的推荐理由。然后发现全站圆角有 7 种、字号 15 种、阴影 8 种——开始把设计值收敛成 token。",
  },
  {
    day: "第 3 天",
    title: "手感和结构",
    body: "动效曲线、44px 热区、面板重做（品种二级面板、距离滑块、一行一个维度）、标签体系改成唯一来源。最后补上这个页面。",
  },
];

const MISTAKES = [
  {
    title: "筛选面板点不开",
    symptom: "点「筛选」按钮没有任何反应，页面像卡住了。",
    cause:
      "我把 useMemo 写在了 「if (!open) return null」 之后。面板关着时执行 3 个 Hook，打开时变成 4 个，React 直接抛错，整块组件崩了。",
    found:
      "控制台看到 Rendered more hooks than during the previous render。但更值得记的是为什么没早发现——我截图时把面板默认设成「打开」，组件从挂载起就是开的，Hook 数量一直一致，绕过了真实路径。",
    fix: "计算移到提前返回之前。验证方式也改了：现在让面板延迟 600ms 自动打开，走一遍真实的关闭→打开。",
  },
  {
    title: "返回按钮凭空消失",
    symptom: "宠物主页左上角没有返回箭头，看起来像「进得去出不来」。",
    cause:
      "给图标按钮加 44×44 热区时写了 「.hit { position: relative }」。它和 Tailwind 的 「absolute」 都是单类选择器、优先级相同，而我的规则在文件末尾——于是覆盖了 absolute，按钮掉回文档流，被图片容器的 overflow 裁掉。",
    found:
      "编译通过、页面也能打开，肉眼只看到「少了个箭头」。用调试协议查按钮的 getBoundingClientRect，发现它在 top: 558px——在图片下方，根本不在屏幕上。",
    fix: "改成 `.hit:not(.absolute):not(.fixed):not(.sticky):not(.relative)`，只给没有定位的元素补 relative。",
  },
  {
    title: "两列瀑布流的顺序是乱的",
    symptom: "第一行左边是第 1 只宠物，右边是第 22 只。",
    cause:
      "用了 CSS 的 columns-2。它的逻辑是「先把左列填满，再填右列」，于是视觉顺序变成 1 → 22 → 2 → 23。",
    found:
      "排版看起来很整齐，所以一开始没觉得有问题。是对着数据核对第一行左右两只的名字才发现的。",
    fix: "按索引分两列、各自独立排列，再改成「谁矮往谁那放」。",
  },
  {
    title: "白字在橙色按钮上发虚",
    symptom: "主按钮的文字有点糊，说不清哪里不对。",
    cause:
      "白字在 #FFA62B 上的对比度只有 1.97:1，无障碍标准要求 4.5:1。这不是审美问题，是数学问题。",
    found: "算了一遍对比度才确认。浅色系天生不能承担白字。",
    fix: "改成深色文字（8.4:1），或者把底色压深。现在全站的按钮文字都按这条规则选色。",
  },
  {
    title: "滑动列表会误跳进详情页",
    symptom: "上下滑列表，松手后突然进了某只宠物的主页。",
    cause: "pointerup 没有区分「拖动」和「单击」，滚动结束也被当成点击。",
    found: "自己试着滑动时复现，日志里看到 lock 是 y 轴但 moved 还是 false。",
    fix: "只要手指移动超过 8px 就标记 moved，抬手不再触发点击。",
  },
];

const JUDGMENTS = [
  {
    ai: "AI 建议加「左滑跳过 / 右滑喜欢」的卡片交互",
    me: "否掉了。「打招呼」已经承担了表达意愿的作用，再加一套左右滑等于让用户用两种方式说同一件事。而且这个产品是「逛」不是「筛」，滑走式交互会把可选范围越用越窄。",
  },
  {
    ai: "AI 给了一版深蓝背景 + 饱和黄的主色方案",
    me: "做出来试了，深蓝确实高级，但我们有大段正文（就医经历），深色下长文阅读明显更累。退回暖色。",
  },
  {
    ai: "AI 把医疗话题设计成「问诊」",
    me: "改成「就医经历」。没有评论区的问诊就是死内容——发了没人答，比不发还伤。改成有正文就完整的形式。",
  },
  {
    ai: "AI 生成的样式是逐处写的，圆角 7 种、字号 15 种",
    me: "收敛成 4 档圆角、9 档字号、3 级阴影，全部定义成 token。单看每个组件都没错，累积起来才是「AI 味」。",
  },
];

export default function MakingLogPage() {
  return (
    <>
      <SubPageHeader title="这是怎么做出来的" subtitle="3 天 · 44 次提交 · 6055 行代码" />

      <div className="px-5 pt-2 pb-8">
        {/* 分工 */}
        <section className="rounded-block bg-surface p-4 shadow-card">
          <h2 className="text-body font-semibold">我和 AI 怎么分工</h2>
          <div className="mt-2.5 space-y-2 text-body leading-relaxed text-ink-soft">
            <p>
              <b className="text-ink">我做</b>：决定做什么、不做什么，判断方案对不对，验收结果。
              所有「这个功能要不要」「这个颜色能不能用」「这里为什么点了没反应」都是我来定的。
            </p>
            <p>
              <b className="text-ink">AI 做</b>：写代码、查资料、生成文案、一次给几个方案让我挑。
            </p>
            <p className="rounded-chip bg-canvas px-3 py-2 text-note text-ink-soft">
              最重要的一条：<b className="text-ink">AI 不会主动说「这里有问题」</b>。
              它交付的代码能编译、页面能打开，但按钮可能已经掉出屏幕了。
              所以验收不能只看「能不能跑」。
            </p>
          </div>
        </section>

        {/* 时间线 */}
        <h2 className="mt-5 mb-2 px-1 text-note font-semibold text-ink-soft">三天里做了什么</h2>
        <div className="space-y-2.5 border-l-2 border-line pl-3.5">
          {TIMELINE.map((t) => (
            <div key={t.title} className="relative">
              <span className="absolute top-1.5 -left-[19px] h-2 w-2 rounded-full bg-accent" />
              <p className="text-micro font-semibold text-accent">{t.day}</p>
              <p className="mt-0.5 text-body font-semibold">{t.title}</p>
              <p className="mt-1 text-note leading-relaxed text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>

        {/* 犯的错 */}
        <h2 className="mt-6 mb-1 px-1 text-note font-semibold text-ink-soft">
          AI 犯的错，和我是怎么发现的
        </h2>
        <p className="mb-2.5 px-1 text-cap leading-relaxed text-ink-mute">
          这五个都不是「写错了」，而是「看起来对了，其实不对」。
        </p>
        <div className="space-y-2.5">
          {MISTAKES.map((m, i) => (
            <article key={m.title} className="rounded-block bg-surface p-4 shadow-card">
              <div className="flex items-baseline gap-1.5">
                <span className="text-micro font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-body font-semibold">{m.title}</h3>
              </div>
              <dl className="mt-2 space-y-1.5 text-note leading-relaxed">
                <div>
                  <dt className="inline font-medium text-ink-mute">现象　</dt>
                  <dd className="inline text-ink-soft">{m.symptom}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-ink-mute">原因　</dt>
                  <dd className="inline text-ink-soft">{m.cause}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-ink-mute">怎么发现　</dt>
                  <dd className="inline text-ink-soft">{m.found}</dd>
                </div>
              </dl>
              <p className="mt-2 rounded-chip bg-canvas px-2.5 py-1.5 text-note text-ink-soft">
                <span className="font-medium text-accent">修法　</span>
                {m.fix}
              </p>
            </article>
          ))}
        </div>

        {/* 判断 */}
        <h2 className="mt-6 mb-1 px-1 text-note font-semibold text-ink-soft">
          我没有听 AI 的时候
        </h2>
        <p className="mb-2.5 px-1 text-cap leading-relaxed text-ink-mute">
          会写代码只是及格线，能不能否掉一个「看起来合理」的方案才是分水岭。
        </p>
        <div className="space-y-2.5">
          {JUDGMENTS.map((j) => (
            <article key={j.ai} className="rounded-block bg-surface p-4 shadow-card">
              <p className="text-note leading-relaxed text-ink-mute">
                <span className="mr-1 font-semibold text-ink-mute">AI</span>
                {j.ai}
              </p>
              <p className="mt-2 text-body leading-relaxed text-ink-soft">
                <span className="mr-1 font-semibold text-accent">我</span>
                {j.me}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-cap leading-relaxed text-ink-mute">
          这个项目不是「AI 帮我写完的」，<br />
          是「我用 AI，把它做出来的」。
        </p>
      </div>
    </>
  );
}
