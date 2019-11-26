# [FFXIV-BeautiyTemplate](https://github.com/chenshiai/beautify-template)
![](https://img.shields.io/badge/ver-0.3.6-green) ![](https://img.shields.io/badge/state-developing-orange)  
![](https://img.shields.io/badge/依赖-live2d.js-red)
## 欢迎使用
欢迎使用我自制的美化插件。目前ACT国际版中自带的美化模板中，没有找到适合自己的界面布局的模板，所以就按照自己的意思来做了。
大部分的样式都是我自己的需求，所以并不是所有人都适合，如果你屏幕的分辨率小于`1600x900`，那么这个就会比较占用空间。

## 如何使用?
如果你没有获得别人分享的`html`文件的话，可以自己新建一个记事本，复制并粘贴以下内容。
```html
<!DOCTYPE html><html><head>
<meta http-equiv="refresh" content="0; url=https://chenshiai.github.io/beautify-template/dist/index.html">
</head><body></body></html>
```
保存时文件的名字自己取，注意后缀要带上`.html`。  
以上步骤完成后，打开你的ACT。  
在美化模板的文件选择里，找到你刚刚创建的这个文件就可以使用了。  
如果想推荐给别人，把你自己创建的文件分享出去既可。  

## 更新日志
### 2019-11-21
今天在掘金上看见有人分享了一个土味情话和毒鸡汤的接口，拿来试了一下，作为一个单身狗实在是受不了，就重置会之前的版本了。
优化：没有战斗数据时，新增妹妹说的话，表现更自然一点。
修改：注释了鼠标放置事件，放置和点击的效果是一样的，放置有点多余。

## 成为贡献者
> 本项目由 vue-cli3.0 + typescript 编写。如果你也有兴趣参与且会使用以上工具，欢迎加入。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
