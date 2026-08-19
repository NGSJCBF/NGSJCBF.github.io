---
title: "博客配图指南"
date: 2026-08-18
draft: false
tags: ["教程"]
categories: ["教程"]
description: "演示如何在博客中使用本地图片与图床图片，以及封面图的设置。"
---

这篇用来演示博客里怎么放图片。你现在看到的**封面图**（`featured.png`）就是一张本地图片，放在文章同一目录下被自动识别为封面。

## 本地图片（推荐）

把图片和文章 `index.md` 放在同一个文件夹（page bundle），正文用相对路径引用即可：

![本地示例图](sample.jpg)

对应的目录结构：

```text
content/posts/using-images/
├── index.md      # 本篇文章
├── featured.png  # 封面图（文件名含 feature 即自动识别）
└── sample.jpg    # 正文图片
```

## 图床图片

也可以直接用图床返回的绝对地址：

```markdown
![描述](https://cdn.jsdelivr.net/gh/你的用户名/仓库名@main/img/xxx.png)
```

## 怎么选

- 常规配图：用**本地图片**最省心，随文章一起提交、永不丢失，国内访问也稳定。
- 图片多、体积大：用 **GitHub + PicGo + jsDelivr** 图床，避免仓库臃肿。

两种方式可以混着用。详细的图床搭建步骤见仓库 `docs/image-hosting.md`。
