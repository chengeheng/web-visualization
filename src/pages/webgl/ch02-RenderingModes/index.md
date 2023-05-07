# webgl rendering modes

```javascript
gl.drawElements(Mode, Count, Type, Offset);
```

第一个参数 Mode 决定我们要渲染的类型，一共有 7 种不同的类型可以选择：

1. TRIANGLES

```javascript
gl.drawElements(gl.TRIANGLES, ...)
```

TRIANGLES 模式用来表示绘制三角形，它会使用 indices 中前三个索引对应的坐标连成一个三角形，然后用第 4 到第 6 个索引对应的坐标连成第二个三角形，依次下去

2. LINES

```javascript
gl.drawElements(gl.LINES, ...)
```

LINES 模式则是用来绘制线，将索引数组中的线两两连接到一起，每次读取两个点的坐标

3. POINTS

```javascript
gl.drawElements(gl.POINTS, ...)
```

POINTS 模式则是用来绘制点，在索引数组中对应的坐标依次绘制相应的点

4. LINE_LOOP

```javascript
gl.drawElements(gl.LINE_LOOP, ...)
```

LINE_LOOP 模式和 LINES 类似，也是用来绘制线，但是 LINE_LOOP 是用来绘制闭合的线，并且 LINE_LOOP 对应索引数组每相邻的两个点就相连，而 LINES 则是第一个和第二个点相连，第三个和第四个点相连，依次下去

5. LINE_STRIP

```javascript
gl.drawElements(gl.LINE_STRIP, ...)
```

LINE_STRIP 和 LINE_LOOP 类似，但是 LINE_LOOP 是闭合的曲线，而 LINE_STRIP 则不是闭合的曲线，其第一个点和最后一个点不会相连

6. TRIANGLE_STRIP

```javascript
gl.drawElements(gl.TRIANGLE_STRIP, ...)
```

TRIANGLE_STRIP 用来绘制共用边线的三角形，其在索引数组中读取的三个点是每次往后面移动一个点位，比如数组`[0, 1, 2, 3, 4]`，通过 TRIANGLE_STRIP 模式可以绘制三个三角形`(0, 1, 2)`、`(1, 2, 3)`、`(2, 3, 4)`

7. TRIANGLE_FAN

```javascript
gl.drawElements(gl.TRIANGLE_FAN, ...)
```

TRIANGLE_FAN 模式是用来绘制类似扇形的图形，但是扇形的弧线不是曲线，而是一个个三角形拼接起来的多个线段。在索引数组中，第一个读取的点会被用来定义为扇形的顶点，然后依次读取两个顶点与扇形顶点共同绘制三角形，比如数组`[0, 1, 2, 3, 4]`，通过 TRIANGLE_FAN 模式可以绘制出两个三角形：`(0, 1, 2)`、`(0, 3, 4)`
