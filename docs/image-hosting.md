# 博客图床与图片使用说明

本博客（Hugo + Blowfish）支持两种配图方式，可按需选择、也可混用：

| 方式 | 免费 | 国内速度 | 是否实名 | 适合场景 |
|---|---|---|---|---|
| 本地图片（page bundle） | ✅ | 随 GitHub Pages | 否 | 常规博客配图（推荐） |
| GitHub + PicGo + jsDelivr | ✅ | 一般/偶不稳 | 否 | 图片多、体积大 |

---

## 方式一：本地图片（page bundle，推荐）

一篇文章一个文件夹，图片和 `index.md` 放在一起：

```text
content/posts/my-post/
├── index.md        # 文章
├── featured.png    # 封面图（自动识别 *feature* / *cover* / *thumbnail* 前缀）
└── image-1.png     # 正文图片
```

正文用相对路径引用：

```markdown
![架构图](image-1.png)
```

特点：

- 零配置，图片随文章一起提交，永不丢失、不怕图床挂掉。
- Blowfish 自动压缩、生成多尺寸缩略图，并支持点击放大。
- 不经过第三方 CDN，国内访问稳定。
- 注意：图片会进 Git 仓库，建议单图 < 100MB、仓库总量别太大。

> 参考示例：`content/posts/using-images/`（含封面图 + 正文图）。

---

## 方式二：GitHub + PicGo + jsDelivr 图床

### 第 1 步：建图床仓库

1. GitHub → 右上角 **+** → **New repository**
2. Repository name 填 `blog-images`（随意）
3. 一定要选 **Public**（公开），否则 jsDelivr 无法代理
4. 勾选 **Add a README file**
5. 点 **Create repository**，记住默认分支名（一般是 `main`）

### 第 2 步：生成 Token

1. GitHub → 头像 → **Settings** → 左侧底部 **Developer settings**
2. **Personal access tokens → Tokens (classic) → Generate new token (classic)**
3. Note 填 `picgo`
4. Expiration 按需选（图省事可选 No expiration）
5. Select scopes 只勾 **`public_repo`**
6. 点 **Generate token** 并复制 `ghp_xxx...`（只显示一次）

### 第 3 步：安装并配置 PicGo

1. 下载 Windows 版：<https://github.com/Molunerfinn/PicGo/releases>（选 `PicGo-Setup-x.x.x-x64.exe`）
2. 打开后：**图床设置 → GitHub**，填：

   | 配置项 | 值 |
   |---|---|
   | 仓库名 | `NGSJCBF/blog-images`（你的用户名/仓库名） |
   | 分支名 | `main`（仓库默认分支） |
   | Token | 第 2 步的 `ghp_xxx` |
   | 存储路径 | `img/` |
   | 自定义域名 | `https://cdn.jsdelivr.net/gh/`（结尾有斜杠） |

3. 点 **确定**，再点 **设为默认图床**

### 第 4 步：上传使用

1. 把图片拖进 PicGo 上传区，或用「剪贴板上传 / 截图上传」
2. 成功后自动复制 Markdown 链接，形如：

   ```markdown
   ![image](https://cdn.jsdelivr.net/gh/NGSJCBF/blog-images@main/img/xxx.png)
   ```

3. 粘进文章即可

### 第 5 步：国内访问慢的备用域名

`cdn.jsdelivr.net` 国内可能访问慢或受限，把 PicGo「自定义域名」改成以下备用节点后重新上传：

```
https://fastly.jsdelivr.net/gh/
https://gcore.jsdelivr.net/gh/
```

---

## 注意事项

- 图床仓库是 Public，图片永久公开，**别传敏感图**（截图注意打码）。
- jsDelivr 单文件限制 **20MB**，大图先压缩。
- Token 只用于 PicGo 推送，别贴进博客或公开文件；泄露了回 GitHub 删除重生成即可。
- 本地图片与图床图片可混用：少量图用本地，大量大图走图床。
