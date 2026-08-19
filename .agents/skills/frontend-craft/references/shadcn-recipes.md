# Shadcn & Radix 风格常用核心组件组合规范

本参考手册提炼自 **shadcn/ui** 与 **Radix UI** 的最佳实践，适用于 React / Vue 或纯 HTML/Vanilla JS 环境。

---

## 1. 按钮体系 (Buttons)

```html
<!-- Primary (主行动点) -->
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
  <span>确认提交</span>
</button>

<!-- Secondary (次级按钮) -->
<button class="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-xs transition-all duration-150 hover:bg-zinc-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800/80">
  <span>取消</span>
</button>

<!-- Ghost / Subtle (轻量按钮) -->
<button class="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
  <span>添加</span>
</button>

<!-- Destructive (危险操作) -->
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-all duration-150 hover:bg-rose-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50">
  <span>删除记录</span>
</button>
```

---

## 2. 卡片与容器 (Cards & Panels)

```html
<div class="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:hover:border-zinc-700">
  <div class="flex items-center justify-between pb-4">
    <h3 class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">场景概览</h3>
    <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30">运行中</span>
  </div>
  <p class="text-sm text-zinc-500 dark:text-zinc-400">展示当前场景测试的实时指标与调用链。</p>
</div>
```

---

## 3. 表单输入与搜索框 (Inputs & Controls)

```html
<div class="relative flex items-center">
  <svg class="pointer-events-none absolute left-3 h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
  <input
    type="text"
    placeholder="搜索用例、步骤或接口..."
    class="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-150 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
  />
</div>
```

---

## 4. 骨架屏与加载动效 (Skeleton Loader)

```html
<div class="animate-pulse space-y-3">
  <div class="h-4 w-1/3 rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
  <div class="h-8 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60"></div>
  <div class="grid grid-cols-3 gap-3">
    <div class="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800/60"></div>
    <div class="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800/60"></div>
    <div class="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800/60"></div>
  </div>
</div>
```

---

## 5. 状态徽标 (Status Badges)

```html
<!-- 成功 / Success -->
<span class="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
  200 OK
</span>

<!-- 警告 / Warning -->
<span class="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
  <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
  Retry (2/3)
</span>

<!-- 失败 / Error -->
<span class="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
  <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
  Failed
</span>
```
