# extend-acwing

tampermonkey
typescript

### 任务栏小说阅读器

#### 使用方法

| 快捷键  |            用途            |
| :-----: | :------------------------: |
| alt + \ |       从本地上传书籍       |
| alt + / |      开始阅读或老板键      |
| alt + , |           上一页           |
| alt + . |           下一页           |
| alt + ; | 从 localStorage 中选择书籍 |

上传时自动检测和转换编码 ( 可能要花费一点时间，可以本地转换成 **UTF-8** 后上传 )

### 自定义主题

暂时只更改 任务栏

#### API 

``` typescript
type fun = (style?: Style, run?: (ele: JQuery<HTMLElement>) => void) => void

declare interface ThemeAPI {
    root: fun
    taskbar: {
        taskbar: fun
        item: fun
        itemFocus: fun
        itemImg: fun
        homeMenu: fun
        context: fun
        searchBar: fun
        clock: fun
    }
    done(): true
}
```

Style 支持嵌套 (:hover 等选择器)

##### 用法

``` typescript
themeAPI.taskbar.item({
    "border": "none",
    ":hover": {
        "border": "2px",
    },
})
```
