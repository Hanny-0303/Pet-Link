# DESIGN.md 使用说明

> 这个文件夹是从 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 里挑出来的 4 套品牌设计规范，
> 用来给「遛遛」换一套视觉语言。先看 [选型预览.html](选型预览.html)，再决定用哪一套。

---

## 一、这到底是什么

`DESIGN.md` 是给 **AI 读**的设计规范文档（Google Stitch 提出的格式），不是 Figma 文件、不是 CSS 主题、也不是图片。

一份 DESIGN.md 里通常有这些内容：

| 部分 | 里面是什么 |
|---|---|
| Overview | 这套设计的气质、密度、为什么这么排 |
| Colors | 每个颜色的语义名 + 色值 + 用在哪（主行动 / 画布 / 描边…） |
| Typography | 字体家族 + 完整字号阶梯（字号、字重、行高、字距） |
| Components | 按钮、卡片、输入框、导航的各种状态 |
| Layout | 间距刻度、栅格、留白原则 |
| Elevation | 阴影层级、表面层次 |
| Do's and Don'ts | 能做什么、绝对不能做什么 |
| Responsive | 断点、触控尺寸、折叠策略 |

**关键点：它是约束，不是灵感。** AI 拿到它之后，颜色只能从里面取、圆角只能取那几档、按钮只有那几种状态。
你越明确地要求"只用 DESIGN.md 里的 token"，出来的东西越像那个品牌；你不提，AI 就会自由发挥，最后变成"AI 味"。

---

## 二、三步用法

### 第 1 步：挑一套

按顺序看这三个东西，30 秒能筛掉一半：

1. **看效果** → 打开 [选型预览.html](选型预览.html)。这是我把 4 套 token 套在你现有首页卡片骨架上渲染的对比板
2. **看气质** → 看 `design-md/<品牌>/DESIGN.md` 开头的 `description`（一两句话说明了这套设计是什么感觉）
3. **看规范** → 重点读 Colors / Typography / Components 三节，判断"落到别的页面还成不成立"

### 第 2 步：放到项目里

两种放法，选一种：

**A. 放项目根目录（推荐，agent 最容易注意到）**

```bash
cp design-md/airbnb/DESIGN.md ./DESIGN.md
```

**B. 留在 design-md/ 里，用路径引用**

```bash
# 什么都不用做，提示词里写 design-md/airbnb/DESIGN.md 即可
```

> 根目录只能有一份 DESIGN.md。换品牌 = 替换根目录那份文件，**不要**把两套都放根目录。

### 第 3 步：让 AI 用起来

关键是**把"用 DESIGN.md"和"只改哪一层"分开说**。一次改全站，diff 会大到没法 review。

**改一个组件（最稳）**

```
读根目录的 DESIGN.md，只改 src/app/page.tsx 里的宠物卡片（照片 + 信息 + 标签 + 打招呼按钮）。
只用 DESIGN.md 里出现的颜色、圆角、字号，不要新增第六种颜色。
改之前先给我一张 token 映射表：现有变量 → DESIGN.md token，我确认后再动代码。
```

**改一个页面**

```
按 DESIGN.md 重做首页，保持现有信息结构和交互不变，只换视觉。
要求：
1. 颜色、圆角、字号必须能追溯到 DESIGN.md 里的具体 token
2. 中文字体用系统字体栈；品牌专有字体只写进 font-family 的 fallback，不要下载字体文件
3. 改完输出：动了哪些文件、每个文件对应哪一节规范
```

**全站对齐**

```
分三轮做，每轮做完停下来给我看：
第一轮只换色板（@theme 里的颜色变量），第二轮只换圆角/间距刻度，第三轮只换字号阶梯与按钮形态。
每一轮都要保证能 `npm run build` 通过。
```

---

## 三、让它长期生效

在项目根目录的 `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/*.mdc` 里加一行，比每次手动提醒可靠：

```md
## 设计
- UI 一律遵循根目录 DESIGN.md。颜色、圆角、字号只能从其中取。
- 新增颜色前先停下来问我。
```

---

## 四、我这 4 套的判断（针对遛遛）

| 品牌 | 气质 | 最适合 | 要注意 |
|---|---|---|---|
| **Airbnb** | 暖珊瑚 + 纯白 + 大圆角，信任摄影 | 首页卡片流、活动、图集 | 大面积纯白要配足留白，否则显空 |
| **Intercom** | 米白纸感 + 炭黑 + 一点橘，像产品刊物 | 圈子长文、领养故事 | 太克制，首页卡片流会显冷 |
| **Zapier** | 奶油底 + 暖橙 + 12px 圆角 | 首页、表单、发起活动 | 只保留一个橙色，别再加第二个亮色 |
| **Notion** | 纸白 + 柔灰面 + 低饱和色块 | 宠物档案、健康记录、经验帖 | 首页没有品牌记忆点，容易"平" |

**我的建议**：门面（首页 / 活动）用 **Airbnb** 或 **Zapier**，内容层（圈子 / 档案 / 健康）用 **Notion** 的阅读排版。
真要二选一，**Zapier** 和现有色卡（柑橘 + 奶油 + 海蓝）是同一个温度，改动最小、风险最低；
**Airbnb** 更"产品化"，照片讲故事的能力最强，但和你现在的深蓝底差异最大。

> 两套混用是可以的：不同品牌用在不同页面层，但**同一屏只能有一种**。

---

## 五、再加一个别的品牌

仓库里有 84 个品牌，文件夹名就是网址 slug（注意带点的：`linear.app`、`x.ai`、`mistral.ai`）。

```bash
# 1. 建目录
mkdir -p design-md/linear.app

# 2. 下载（把 slug 换成想要的品牌）
curl -L -o design-md/linear.app/DESIGN.md \
  https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/linear.app/DESIGN.md

# 3. 看一眼
head -20 design-md/linear.app/DESIGN.md
```

不想用命令行：在 GitHub 打开 `design-md/<品牌>/DESIGN.md` → 点右上角 **Raw** → `⌘S` 保存成 `DESIGN.md`。

品牌 slug 列表：<https://github.com/VoltAgent/awesome-design-md/tree/main/design-md>

---

## 六、五个坑

1. **别把整份文件贴进对话。** 一份 20–35KB、300–550 行，贴进去会挤爆上下文。放到磁盘上，让 agent 按需读。
2. **品牌字体是专有的。** Airbnb Cereal、Saans、Degular、Notion Sans 都不能直接用（也不要去下盗版）。
   近似替代：`Inter` / `Manrope` / `Geist` / `思源黑体` / `MiSans`。中文一律回落到系统字体栈最稳。
3. **一次只改一层。** 色板 → 圆角/间距 → 字号 → 组件形态，分开做，每轮都能 `npm run build`、都能截图对比。
4. **不要混两套。** Airbnb 的圆角 + Intercom 的炭黑 + Notion 的紫，混出来一定土。要混就按页面分工混。
5. **别抄商标和插画。** 这些 DESIGN.md 是对公开 CSS 值的分析（文档本身 MIT），不授予品牌授权。
   Logo、品牌插画、专有字体都不在其中，生成 UI 时要换成自己的。

---

## 七、放进 Google Stitch 用

1. 打开 <https://stitch.withgoogle.com>
2. 新建项目，在项目的 design system / 说明入口里贴上 DESIGN.md 的内容
3. 用自然语言描述页面（"宠物社交 App 首页，附近宠物卡片流，底部四个 tab"），Stitch 会按这套规范出图
4. 出图后把截图 + DESIGN.md 一起丢回给编码 agent 落地成代码

---

## 八、示例：一份 token 映射表长什么样

真正动手时，第一步不是改代码，是**做映射**。拿 Airbnb 套到你现在的 `@theme` 上，大概是这样：

| 你现在的变量 | 现在 | Airbnb 对应 | 说明 |
|---|---|---|---|
| `--color-canvas` | `#f8e6a0` 奶油黄 | `#ffffff` | 画布从暖黄变纯白 |
| `--color-surface` | `#fffdf7` | `#ffffff` | 卡片和画布同色，靠描边/阴影分层 |
| `--color-ink` | `#15223b` 深蓝 | `#222222` | 正文改用中性炭黑 |
| `--color-ink-soft` | `#4c5b7a` | `#3f3f3f` | 同上，饱和度压掉 |
| `--color-line` | `#ecd9a1` | `#dddddd` | 暖描边换中性描边 |
| `--color-brand` | `#ffa62b` 柑橘 | `#ff385c` | 主行动色 |
| `--color-accent` | `#2e5aa7` 海蓝 | —（删掉） | **Airbnb 没有第二强调色** |
| `--radius-chip` | `12px` | `8px` | 取最近的 `rounded.sm` |
| `--radius-card` | `16px` | `14px` | 取 `rounded.md` |
| `--radius-block` | `20px` | `20px` | 取 `rounded.lg`，正好对上 |
| `--radius-hero` | `24px` | `32px` | 取 `rounded.xl` |
| 字号阶梯 | 10–26px | 11–28px | 别硬套，保留你的档位，只调字重与行高 |

两个要点：

1. **找不到对应项时，降级或删除，不要新造。** 上面 `--color-accent` 就是典型：硬塞一个蓝，Airbnb 的味道立刻没了。
2. **一次只换一类变量。** 先颜色 → 再看圆角 → 再看字号。每轮都能 build、能截图，出问题好回退。

---

## 目录

```
design-md/
├── 选型预览.html      ← 先看这个：4 套 token 渲染在同一张宠物卡上
├── README.md          ← 本文
├── airbnb/DESIGN.md
├── intercom/DESIGN.md
├── zapier/DESIGN.md
└── notion/DESIGN.md
```

来源文件均取自 awesome-design-md `main` 分支 `design-md/<slug>/DESIGN.md`，未做修改。
