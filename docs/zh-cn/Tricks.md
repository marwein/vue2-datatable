# § 技巧

> 在开始前，最好先来做一下预备功课，以便于您的理解

***

#### ⊙ 了解动态组件的用法
详情请参考文档：[Dynamic Components](https://vuejs.org/v2/guide/components.html#Dynamic-Components)

#### ⊙ 巧用 [`v-bind`](https://cn.vuejs.org/v2/api/#v-bind) 实现类似 JSX 中的 spread operator (`...`)
> 本技巧参考自 [vuejs/vue#4962](https://github.com/vuejs/vue/issues/4962)

```html
<template>
  <div>
    <hello-world
      :a="a"
      :b="b"
      :c="c"
      :d="d">
    </hello-world>
    <!-- 两种写法作用一致，但显然后者更优雅简洁 -->
    <hello-world v-bind="$data" />
  </div>
</template>
<script>
export default {
  data: () => ({
    a: 1,
    b: 2,
    c: 3,
    d: 4
  })
}
</script>
```

#### ⊙ `propType: Boolean` 的模板简写

若 `HelloWorld` 组件中定义：

```js
props: {
  test: Boolean
}
```

那么下面两种写法是等价的，但显然后者更优雅简洁

```html
<hello-world
  :test="true">
</hello-world>

<hello-world test />
```

#### ⊙ 巧用逗号运算符

```js
cols.map(col => {
  col.weight = col.weight || 0
  return col
})

// 利用逗号运算符，可以把上面的代码缩写为一行：
cols.map(col => ((col.weight = col.weight || 0), col))
```

#### ⊙ 了解 Vue 组件实例所包含的属性

利用 [vue-devtools](https://github.com/vuejs/vue-devtools) 或在组件中 `console.log(this)` 打印出当前实例，了解实例属性有哪些，分别作何用

例如，源码 [`lib/HeaderSettings/ColumnGroup.vue`](https://github.com/OneWayTech/vue2-datatable/blob/master/lib/HeaderSettings/ColumnGroup.vue) 中使用了 `$vm._uid`  
实际上就是利用了该为全局唯一的组件 ID，避免了自行实现  

> 先前采用的是 `setTimeout(() => {})` 这种最简单的方式去生成全局唯一 ID
