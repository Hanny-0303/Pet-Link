import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import SubPageHeader from "@/components/sub-header";
import { pets, meetups, posts } from "@/lib/data";

const STACK = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Vercel"];

const STATS = [
  { n: "3", unit: "天", label: "从零到上线" },
  { n: "44", unit: "次", label: "提交记录" },
  { n: `${pets.length}`, unit: "只", label: "宠物档案" },
  { n: `${meetups.length}`, unit: "个", label: "线下活动" },
];

export default function AboutPage() {
  return (
    <>
      <SubPageHeader title="关于这个项目" subtitle="一个作品集项目" />

      <div className="space-y-3 px-5 pt-2 pb-8">
        <section className="rounded-block bg-surface p-4 shadow-card">
          <p className="text-page font-bold tracking-tight">遛遛</p>
          <p className="mt-1 text-body-lg font-medium text-accent">
            养宠人的聚集地
          </p>
          <p className="mt-2 text-body leading-relaxed text-ink-soft">
            狗找搭子，猫找人吸，异宠找懂的人。
          </p>
        </section>

        <section className="rounded-block bg-surface p-4 shadow-card">
          <h2 className="text-body font-semibold">这是什么</h2>
          <p className="mt-1.5 text-body leading-relaxed text-ink-soft">
            一个移动端优先的养宠人社区：给宠物建档案、刷到同城的小伙伴、
            报名线下活动、在圈子里分享饲养经验和就医经历。
          </p>
          <p className="mt-2 text-body leading-relaxed text-ink-soft">
            做了三个判断：<b className="text-ink">先做活动后做匹配</b>（活动单边成立，能绕开冷启动）；
            <b className="text-ink">按物种分玩法</b>（猫不上街、异宠身边没人）；
            <b className="text-ink">医疗做经历不做问诊</b>（没有评论区的问诊是死内容）。
          </p>
        </section>

        {/* 演示数据声明：访客最容易误解的地方 */}
        <section className="rounded-block bg-brand-soft p-4">
          <h2 className="text-body font-semibold text-accent">这是演示版本</h2>
          <ul className="mt-2 space-y-1.5 text-note leading-relaxed text-ink-soft">
            <li>· 宠物、活动、帖子都是<b className="text-ink">种子数据</b>，不是真实用户</li>
            <li>· 没有后端，刷新页面会还原到初始状态</li>
            <li>· 点赞数、报名人数为演示数据，用于呈现完整的产品形态</li>
          </ul>
        </section>

        <section className="rounded-block bg-surface p-4 shadow-card">
          <div className="grid grid-cols-2 gap-y-3">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-stat font-bold">
                  {s.n}
                  <span className="ml-0.5 text-note font-medium text-ink-mute">{s.unit}</span>
                </p>
                <p className="text-cap text-ink-mute">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-line/70 pt-3 text-cap text-ink-mute">
            {pets.length} 只宠物来自 7 个物种 · {posts.length} 条动态分布在 5 个话题
          </p>
        </section>

        <section className="rounded-block bg-surface p-4 shadow-card">
          <h2 className="text-body font-semibold">技术栈</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STACK.map((t) => (
              <span
                key={t}
                className="rounded-full bg-canvas px-2.5 py-[5px] text-cap text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <Link
          href="/about/log"
          className="tap flex items-center gap-3 rounded-block bg-ink p-4 text-canvas"
        >
          <Sparkles size={18} strokeWidth={2.2} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-body font-semibold">这是怎么做出来的</span>
            <span className="mt-0.5 block text-cap leading-relaxed opacity-70">
              和 AI 的分工、它犯的错、我改了哪些地方
            </span>
          </span>
          <ArrowRight size={16} strokeWidth={2.4} className="shrink-0" />
        </Link>

        <a
          href="https://github.com/Hanny-0303/Pet-Link"
          target="_blank"
          rel="noreferrer"
          className="tap flex items-center gap-3 rounded-block bg-surface p-4 shadow-card"
        >
          <ExternalLink size={18} strokeWidth={2.2} className="shrink-0 text-ink-soft" />
          <span className="min-w-0 flex-1">
            <span className="block text-body font-semibold">GitHub 仓库</span>
            <span className="mt-0.5 block text-cap text-ink-mute">
              全部源码和 44 次提交记录
            </span>
          </span>
          <ArrowRight size={16} strokeWidth={2.4} className="shrink-0 text-ink-mute" />
        </a>

        <p className="pt-2 text-center text-cap text-ink-mute">
          演示版本 v0.1 · 2026 年 11 月
        </p>
      </div>
    </>
  );
}
