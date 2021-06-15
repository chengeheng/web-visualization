# 绘制方法

## drawArrays

drawArrays 根据启用的 WebGLBuffer 对象中的顶点数据，绘制由第一个参数定义的图元。

### 准备

### 语法

```C
// 原型
void drawArrays(GLenum mode, Glint first, GLsizei count);
```

- mode 定义所要渲染的图元的类型
- first 参数定义顶点数据数组中的哪个索引用作第一个索引
- count 定义了需要使用的顶点数

> drawArrays 方法的设计要求表示图元的顶点必须按照正确的顺序进行绘制，如果顶点之前存在共享，则使用 drawElements 方法可能会更好

## drawElements 索引绘图

drawElements 方法也利用了包含顶点数据的数组缓冲，但它还使用一个元素数组缓冲（即绑定到 gl.ELEMENT_ARRAY_BUFFER 目标上的 WebGLBuffer 对象），这个元素数组缓冲包含了带有顶点数据的数组缓冲的索引。

### 语法

```C
// 原型
void drawElements(GLenum mode,  GLsizei count, GLenum type, GLintptr offset);
```

- mode 定义所要渲染的图元的类型
- count 定义了绑定到 gl.ELEMENT_ARRAY_BUFFER 目标上的缓冲中的索引数
- type 定义了元素索引的类型，元素索引存储在绑定到 gl.ELEMENT_ARRAY_BUFFER 目标上的缓冲中
- offset 定义绑定到 gl.ELEMENT_ARRAY_BUFFER 目标的缓冲中的偏移量，索引从此处开始

## clear
