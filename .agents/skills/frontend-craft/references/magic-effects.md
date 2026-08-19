# 现代高级视觉效果与微交互 (Magic UI & Aceternity UI 规范)

本手册收录顶级现代 Web 界面（如 Linear, Vercel, Supabase）常用的质感特效实现。

---

## 1. Bento Grid (便当盒信息栅格)
将杂乱的信息按优先级以不对称网格组织，主信息占大格，次要信息占小格。

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <!-- 大卡片 (占用 2 列) -->
  <div class="md:col-span-2 relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
    <div class="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
    <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">核心执行引擎</h4>
    <p class="mt-1 text-sm text-zinc-500">毫秒级响应与完整的调用链路还原。</p>
  </div>

  <!-- 小卡片 (占用 1 列) -->
  <div class="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">断言成功率</h4>
    <p class="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">99.8%</p>
  </div>
</div>
```

---

## 2. Gradient Border (渐变光泽边框)
无需繁琐的 JS，利用 CSS 伪元素或双层容器实现随暗色调呼应的精致微光边框。

```html
<div class="relative rounded-xl p-[1px] bg-gradient-to-b from-zinc-300 via-zinc-200 to-transparent dark:from-zinc-700 dark:via-zinc-800 dark:to-transparent">
  <div class="rounded-[11px] bg-white p-5 dark:bg-zinc-950">
    <h5 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">高质感卡片</h5>
    <p class="text-xs text-zinc-500 mt-1">顶部具有细腻的下落光源反射效果。</p>
  </div>
</div>
```

---

## 3. 悬浮光标追随与微动效 (Hover Lift & Glow)

```html
<div class="group relative rounded-xl border border-zinc-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-black/40">
  <div class="flex items-center gap-3">
    <div class="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-2 2.5h3L11 8h3L9 14l2-2.5H8l3-3.5H8L13 2z"/></svg>
    </div>
    <div>
      <h5 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">极速执行</h5>
      <p class="text-xs text-zinc-500">已启用本地沙箱缓存加速</p>
    </div>
  </div>
</div>
```
