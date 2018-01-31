## 使用方法

#### 进入项目目录

~~~
$ cd assets/mobile
~~~

#### 构建
- 开发环境构建  
执行命令：`npm run dev -- <direcotry>`   
`direcotry` 为需要构建的项目名称（文件夹名称），如`assets/mobile/app` 下的`demo1`。  
开发环境下构建只在内存中进行，不会生成物理文件，同时自动启用 watch 动态构建，方便开发时快速预览。  
初次构建完成之后会自动打开本地`locahost`预览地址。

- 正式环境构建  
执行命令：`npm run build -- <direcotry>`   
构建完成在产出目录(默认为`app/<direcotry>/dist`)生成生产环境需要的最终文件。

完整示例：  

```
$ cd assets/mobile
$ npm run build -- demo1
```

#### 几点说明：
1. 日常开发不需要修改 `bin`下的执行文件，也不需要修改`config.json`文件。
2. 业务目录内文件架构需要手动生成，参照 `demo1`。
3. 业务目录下的`appconfig.json`为业务级配置

	> `alias` 为业务内 `alias` [可选];   
	> `watch` 表示正式环境构建(`npm run build -- xx`)时是否同时开启 `watch` 指令，默认不开启 [可选]  
	> `home` 为开发环境构建完成打开的预览地址，默认打开`localhost:<port>` [可选]  
	> `open` 开发环境构建使用，标记构建完成是否自动打开预览页面 [可选]  

4. `snapshoot.json`为调试文件，正式环境和开发环境构建的时候会写入完整的webpack构建配置，供调试使用。开发没遇到问题直接无视即可。
5. 一级共用模块 `libs`内的js 模块alias 为自动生成。业务使用直接引用即可。如：`import fastclick from "libs/xx/xx/falstclick"`
	
