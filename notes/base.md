## 基础概念

### 着色

着色是用来表示确定灯光对不同材质效果的整个过程；

着色过程分成两个阶段：

-   顶点着色器
-   片段着色器

在三维图形学中，着色的真正含义就是根据光照条件重建“物体各表面明暗不一的效果”的过程。

### 图元

drawArrays 和 drawElements 是绘制图元的两个可用方法之一，而图元则是作为这两个方法的第一个参数传入的图形对象，复杂的 3D 模型都是有以下 3 种基本几何图元构建的：

-   三角形

    从数学角度看，点是用来构建其他几何对象的最基本构建块，但是从 3D 图形硬件的角度来看，三角形才是最基本的构建块。并且当今大多数 3D 图形硬件经过高度优化处理，可以快速绘制三角形。

    -   gl.TRIANGLES 独立三角形

        绘制的三角形数量 = count / 3

    -   gl.TRIANGLE_STRIP 三角形带

        绘制的三角形数量 = count - 2

    -   gl.TRIANGLE_FAN 三角扇

        绘制的三角形数量 = count - 2

        > 三角形的一个重要属性就是顶点组绕顺序，它决定了三角形的面是否朝向观察者。通过 gl.frontFace、gl.enable、gl.cullFace 可以设置是否朝向观察者。

-   线

    3 种常用的线图元

    -   gl.LINES 独立线

        所绘制线数 = count / 2

    -   gl.LINE_STRIP 线带

        所绘制线数 = count - 1

    -   gl.LINE_LOOP 线环，线带的基础上首尾闭合

        所绘制线数 = count

-   点精灵

    点精灵通过 gl.POINTS 绘制得打，绘制点精灵时，一个点精灵的由顶点数组中的一个坐标来决定。在使用点精灵时，还需要在顶点着色器中设置点精灵的大小，即需要给内置的特殊变量 gl_PointSize 设置像素大小。

## 创建一个 WebGL 应用

-   编写基本的 `html` 代码，并插入 `canvas` 元素
-   编写顶点着色器和片段着色器的源代码

    ```javascript
    // 定义一个简单的顶点着色器
    const vertexshaderSource = `
        attribute vec3 aVertexPosition;                 \n  
        void main() {                                   \n
            gl_Position = vec4(aVertexPosition, 1.0);   \n
        }                                               \n
    `;
    ```

    首先定一个类型为 `vec3`、名为 `aVecterPosition` 的变量，`vec3` 是一个包含三个分量的向量；

    顶点着色器的下一条语句声明`main`函数，它是执行顶点着色器的入口点。其内容就是把顶点位置赋给一个名为`gl_Postion`的变量。

    ```javascript
    // 定义片段着色器
    const fragmentShaderSource = `
          precision mediump float;                        \n
          void main() {                                   \n
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);    \n
          }                                               \n
    `;
    ```

    与顶点着色器一样，在片段着色器中，`main` 函数定义了入口点，并且在这个例子中，使用 `vec4` 定义了白色

-   创建着色器对象

    ```javascript
    // 创建着色器
    const shader = gl.createShader(type);
    // 载入着色器
    gl.shaderSource(shader, shaderSource);
    // 编译着色器
    gl.compileShader(shader);
    ```

    通过 `createShader` 创建着色器对象，并把源代码载入到这个对象中，然后编译、链接这个着色器。

-   创建程序对象并将着色器对象插入到程序对象中

    ```javascript
    // 创建程序对象
    const shaderProgram = gl.createProgram();
    // 链接着色器
    gl.attachShader(shaderProgram, vertexshader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "Failed to setup shaders";
    }
    // 告诉WebGL可以用这个程序对象绘制图形
    gl.useProgram(shaderProgram);
    // 链接之后，WebGL实现把顶点着色器使用的属性绑定到通用属性索引上
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    ```

-   设置 `WebGL` 缓存对象，并把几何对象的顶点数据载入到顶点缓存

    建立缓冲，用来保存顶点数据

    ```javascript
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // prettier-ignore
    const triangleVertices = [
          0.0, 0.5, 0.0,
          -0.5, -0.5, 0.0,
          0.5, -0.5, 0.0,
      ];
    // 将顶点数据写入当前绑定的WebGLBuffer对象中
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(triangleVertices), // 用来把顶点数据传递给WebGL
        gl.STATIC_DRAW
    );
    vertexBuffer.itemSize = 3; // 定义每个属性有多少个分量
    vertexBuffer.numberOfItems = 3; // 定义这个缓冲中的项或顶点的个数
    ```

-   指示 `WebGL`，哪个缓存对应于着色器的属性

    最后就是绘制所有的对象：

    ```javascript
    // 定义了最终绘制的场景在绘制缓冲中的位置
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // 通过参数gl.COLOR_BUFFER_BIT指示WebGL把颜色缓冲清除为事先用gl.clearColor()函数定义的颜色
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.vertexAttribPointer()把绑定到gl.ARRAY_BUFFER目标上的WebGLBuffer对象赋给一个顶点属性，这个顶点属性作为一个索引传递给此方法的第一个参数。
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize,
        gl.FLOAT, // 表示把顶点缓冲对象中的值作为浮点数
        false, // 规范化标志，表示是否把非浮点数转化为浮点数
        0, // 步幅(size)，当这个参数为0时，表示数据在内存中顺序存放
        0 // 表示缓冲中的偏移值，由于数据从缓冲的开始位置存放，因此也设置为0
    );

    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
    ```

    WebGL 中的绘制是以定义在 WebGLBuffer 对象中的顶点数据为基础的。

## 使用缓冲区对象向顶点着色器传输多个顶点的步骤

-   创建缓冲区对象(gl.createBuffer())
-   绑定缓冲区对象(gl.bindBuffer())
-   将数据写入缓冲区对象(gl.bufferData())
-   将缓冲区对象分配给一个 attribute 变量(gl.vertexAttribPointer())
-   开启 attribute 变量(gl.enableVertexAttribArray())

## 隐藏面消除

webgl 加载图形的顺序是按照在缓冲区的顺序加载的，后绘制的图形会覆盖先绘制的图形，因为这样做很高效。

如果需要不断移动视点，从不同的角度看物体，则无法确定对象出现的顺序，这时候就需要使用 webgl 提供的隐藏面消除的功能。

步骤：

-   1.开启隐藏面清除功能： gl.enable(gl.DEPTH_TEST);
-   2.在绘制之前，清除深度缓冲区：gl.clear(gl.DEPTH_BUFFER_BIT);

隐藏面消除的前提是正确设置可视空间，否则就可能产生错误的结果。

## 多边形偏移

当几何图形或者物体的两个表面极为接近时，深度缓冲区有限的精度已经不能区分哪个在前，哪个在后了，这就是深度冲突。

WebGL 提供一种被成为多边形偏移的机制来解决这个问题，该机制将自动在 Z 值加上一个偏移量，偏移量的值由物体表面相对于观察者的角度来确定。

步骤：

-   1.启用多边形偏移：gl.enable(gl.POLYGON_OFFSET_FILL);
-   2.在绘制之前指定用来计算偏移量的参数：gl.polygonOffset(1.0, 1.0);

## 部分规范（待补充）

1. 在着色器源码中，属性名使用 `a` 前缀，可变变量使用 `v` 前缀，统一变量使用 `u` 前缀

attribute 变量传输的是那些与顶点相关的数据，而 uniform 变量传输的是那些对于所有顶点都相同（与顶点无关）的数据

-   **attribute 变量**

`attribute`关键字通常用来声明与顶点数据相关的变量，比如顶点位置坐标数据、顶点颜色数据、顶点法向量数据等

顶点着色器中通过`attribute`关键字声明的顶点变量，javascript 代码可以通过相关的 WebGL API 把顶点的数据传递给着色器中相应的顶点变量。因为 javascript 没有必要给片元着色器传递顶点数据，所以规定`attribute`关键字只能在顶点着色器中声明变量使用。

-   **uiniform 变量**

`uniform`关键字出现的目的就是为了 javascript 可以通过相关的 WebGL API 给着色器变量传递数据，比如传递一个光源的位置数据、一个光源的方向数据、一个光源的颜色数据、一个用于顶点变换的模型矩阵、一个用于顶点变换的视图矩阵等。

需要注意的是，如果是顶点相关的变量，比如顶点位置、顶点颜色等顶点数据相关变量不能使用关键字`uniform`去声明，主要是顶点的数据往往不是一个，通常有很多个顶点，而这些顶点都要逐顶点执行`main`函数中的程序，所以为了声明顶点数据相关的变量，着色器语言规定一个新的关键字`attribute`。

javascript 可以给顶点着色器的变量传递数据，也可以给片元着色器的变量传递数据，也就是说`uniform`关键字既可以在顶点着色器中使用，也可以在片元着色器中使用。

-   **varying 变量**

`varying`类型变量主要是为了完成顶点着色器和片元着色器之间的数据传递和插值计算。

比如在一个 WebGL 程序中通过三个顶点绘制一个彩色三角形，三个顶点的位置坐标定义了一个三角形区域，这个三角形区域经过片元着色器处理后会得到由一个个片元或者说像素组成的三角形区域，在片元化的过程中，顶点的颜色数据也会进行插值计算，插值计算之前每个顶点对应一个颜色，插值计算之后，每个片元对应一个颜色值，通过 `varying` 关键字就可以在片元着色器中获得插值后的颜色数据，然后赋值给片元。
