---
title: Naive UI 使用 Typescript 的一个小技巧
publishDate: Jan 19 2023
---

最近在看 Naive UI 的源码，看到一个挺有意思的函数，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbfde79d245e44a1bd32b37a6464b5dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如果我们把类型删掉，`createInjectionKey` 函数就变成下面这样：

```ts
export function createInjectionKey(key) {
  return key;
}
```

嗯？这不是在写废话吗？

那其实比较有意思的地方就在于 Ts 上。

## 分析函数 createInjectionKey

首先我们分析下 `createInjectionKey` 函数的作用：

```typescript
// InjectionKey 是 vue3 提供的类型，其定义如下
export declare interface InjectionKey<T> extends Symbol {}

function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}
```

从类型上看，函数 `createInjectionKey` 接受一个类型为 `string` 的值，返回一个类型为 `InjectionKey<T>` 类型的值。

我们先跳出 `createInjectionKey` 看一个例子：

一般我们写一个函数，Ts 都会帮我们推导函数的返回值，比如说：

```ts
function fakeStr(str: string) {
  return str;
}
```

此时 Ts 将会推导 `fakeStr` 函数的返回值为 `string` 类型。那为了防止函数帮我们推导类型，我们可以给函数写上声明。

```ts
interface Test {
  name: string;
  age: number;
}

// 这里我们希望让 fakeStr 的返回值为 Test 类型
function fakeStr(str: string): Test {
  return str;
}
```

但是这么写函数体内部会有问题

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d572923b766483393c8e01c23f3740f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

好在我们可以通过 `as any` 的手段去规避这个问题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afe56e3c5279442b91515d10c1b34d55~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

因此，`createInjectionKey` 在 Ts 上做的手脚便是：手动加上了函数的返回值，并且利用 `as any` 去使一个字符串的类型变为了 `InjectionKey<T>`。

```ts
// 和上面代码一样，方便你看
function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}
```

## 结合到 Naive UI 中

我们将以下图中，`messageProviderInjectionKey` 作为例子分析。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ff330b79a8a4b3eb210b665bb29387c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

首先 `messageProviderInjectionKey` 的**真实类型**应该是一个 `string` 类型。

因为函数 createInjectionKey 会直接返回函数入参，这里的入参是一个字符串

但我们通过 `createInjectionKey` 函数以及泛型，使 Ts 认为返回的类型为：

```ts
const messageProviderInjectionKey: InjectionKey<{
  props: MessageProviderSetupProps;
  mergedClsPrefixRef: Ref<string>;
}>;
```

此时我们再去看代码中调用 `messageProviderInjectionKey` 的地方

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66c9f6b335eb42be85fe33f9cf88355e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们将，`messageProviderInjectionKey` 作为 `provide` 的第一个参数传入，将一个对象作为第二个参数传入。

可能现在还是不明显，那现在我们改一下传入的对象再看看。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcb4d25bef9e4c62a88ab6e37a82781f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到飘红了，也就说 `provide` 检查出了 `props` 类型错误了。

没错，这其实就是重点，到这里我们可以看下 `provide` 的类型定义：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a40f69cef5274c13afcd43160b525c55~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到 key 可以传递三个类型的值 `InjectionKey<T> | string | number`。

如果我们传递 `string | number`，那么我们将无法约束 `value` 的类型（除非你在调用 `provide` 的时候传入了泛型）。

而如果我们传入了 `InjectionKey<T>` 便可以在编写 `value` 的时候获得良好的代码提示。

看完了 `provide`，我们再来看看 `inject`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/474492a265794018b2a36897c32d6286~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

`inject` 在调用的时候也会有类型提示，但是我们需要注意一个地方，在 `inject`函数后面，有一个感叹号。因为 `inject` 可能会返回一个 `undefined`，所以我们需要加上感叹号，否则在解构赋值的时候将无法获得类型提示。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7070829f6f94e10820890120b793514~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

总的来说，Naive UI 的作者，通过函数 `createInjectionKey` 创建一个 `key` 用于传入 `provide/inject`， 并且将一个返回值类型从 `string` 类型的值强行修改成了 `InjectionKey<T>`，这样就可以在使用 `provide/inject` 的时候获取一个良好的代码提示。

## 分析利弊

欲扬先抑，我先说弊端吧。

我认为 Ts 更多的作用是提供类型，而这里，我们为了去获得类型，创建了一个函数，增加了额外的调用成本，其实我们完全可以在 `provide/inject` 函数调用的时候通过泛型去达到类型提示。并且对不熟悉 Ts 的同学会带来更高的上手成本。

简单来说，我们为了获取类型，增加了一层在逻辑上毫无意义的代码。

缺点说完了（如果你觉得还有，可以补充），接下来说下优点。

优点是易于维护，如果我们只在代码中 `inject` 一次，那可能体现不出来优越性，那如果我们有十个地方都需要 `inject` 呢？换句话说，Naive UI 的这种写法算是提供了一种更加“工程化”的解决思路。

## 总结

这是我在阅读 Naive UI 源码的时候发现的一个小技巧，也算是 `as any` 这个用法的一个实践。

下面是一个 demo，完整的表达了 provide/inject 在 Naive UI 中的实践方式：

```ts
import { InjectionKey, provide, inject } from 'vue';

// 工具函数
function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}

// 创建一个 key，用于 provide/inject
const messageProviderInjectionKey = createInjectionKey<{
  props: string;
  index: number;
}>('message-provider');

// provide 的时候，直接传入 messageProviderInjectionKey 即可获得良好的类型提示
provide(messageProviderInjectionKey, {
  props: 'props',
  index: 1
});

// inject 也可以获得良好的类型提示
// 注意，需要在 inject 后面加 “!” 向 ts 保证 inject 返回值不为空
const { props, index } = inject(messageProviderInjectionKey)!;
```
