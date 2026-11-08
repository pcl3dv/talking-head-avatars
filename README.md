# Speech-Driven 3D Talking Head · 论文研究系列展示

> 一个可直接部署到 **GitHub Pages** 的纯静态论文展示站点，系统梳理 **MeanTalker / PSTalker / SRP-Talker** 三篇语音驱动 3D 数字人方向论文的方法、贡献与实验结果。

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deploy-2088FF?logo=githubpages&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

---

## 项目简介

本项目围绕**语音驱动 3D 面部动画与数字人合成**，展示同一研究团队（北京大学（深圳）· 鹏城实验室）的三篇代表性论文。三项工作沿“**高效生成 → 几何可控 → 个性化真实感**”逐层递进：

| # | 论文 | 会议 | 核心问题 | 核心方案 | 关键结果 |
|---|------|------|----------|----------|----------|
| 1 | **MeanTalker** | ECCV | 扩散模型迭代采样慢，无法实时部署 | 基于 Mean Flow 的单步生成 + DTDT 双时间课程 + GATL 几何感知轨迹学习 | RTF **0.004**，NFE=1，较扩散模型加速 **200×+**，LVE 7.88 mm |
| 2 | **PSTalker** | ICASSP 2026 | 头-躯干接缝伪影、音唇错位、姿态不可控 | SAPS 语义感知点形状 + RFC 刚柔耦合（LBS） | 512×512 超 **30 FPS**，LMD 2.570，Sync-C 7.890，支持姿态控制 |
| 3 | **SRP-Talker** | ICME 2026 | 像素级监督不足导致个性化音唇错位与解耦伪影 | 语义一致重建先验 + 运动对齐 + 语义引导修复（三阶段） | **~31 FPS**，PSNR 31.887，Sync-C 8.106 逼近重建上限 8.150 |

### 研究脉络

```
MeanTalker (ECCV)                 PSTalker (ICASSP)                SRP-Talker (ICME)
高效运动生成                      几何可控建模                      个性化真实感
─────────────────                 ─────────────────                ─────────────────
Mean Flow 单步生成        →       点形状 + 刚柔耦合        →       重建先验 + 语义修复
解决“慢”                          解决“接缝/可控”                   解决“错位/伪影”
```

**共性技术底座**：HuBERT 音频特征 · FLAME 3D 形变模型 · 3D Gaussian Splatting · 语义感知建模。

---

## 目录结构

```
talking-head-papers/
├── index.html                  # 站点主页面（GitHub 风格导航 + 学术主页）
├── README.md                   # 本文件
├── LICENSE                     # MIT 许可证
├── .gitignore
└── assets/
    ├── css/
    │   └── style.css           # 全部样式（响应式、GitHub 风格主题）
    ├── js/
    │   └── main.js             # 数据驱动渲染 + 图片灯箱交互
    ├── data/
    │   ├── papers.json         # 三篇论文结构化数据（单一数据源）
    │   └── papers.js           # 同名 JS 包装，支持 file:// 双击直接预览
    └── img/                    # 从论文裁剪的架构图（高清）
        ├── meantalker-teaser.png
        ├── meantalker-arch.png
        ├── pstalker-arch.png
        └── srptalker-arch.png
```

所有论文内容均由 `assets/data/papers.json` 驱动，**修改内容只需编辑该 JSON**，页面自动渲染，无需改动 HTML。

---

## 本地预览

### 方式一：直接打开（零依赖）

双击 `index.html` 即可在浏览器中查看。页面通过 `papers.js` 读取数据，无需本地服务器。

### 方式二：本地服务器（推荐，与线上环境一致）

```bash
# Python 3
python -m http.server 8000

# 或 Node.js
npx serve .
```

然后访问 <http://localhost:8000>。

---

## 部署到 GitHub Pages

```bash
# 1. 在 GitHub 新建仓库，例如 talking-head-papers
git init
git add .
git commit -m "feat: speech-driven 3D talking head paper showcase"
git branch -M main
git remote add origin https://github.com/<your-username>/talking-head-papers.git
git push -u origin main

# 2. 开启 Pages
#    仓库 Settings → Pages → Source 选择 "Deploy from a branch"
#    Branch 选择 main / (root) → Save
# 3. 约 1 分钟后访问
#    https://<your-username>.github.io/talking-head-papers/
```

也可使用 GitHub Actions 的 **Pages: GitHub Pages Deployment** 工作流进行部署。

---

## 数据与素材说明

- 论文文字信息（摘要、方法、贡献、指标、对比表、数据集）均依据三篇论文原文整理，指标数值与论文表格一致。
- `assets/img/` 中的架构图由论文 PDF 对应页面裁剪渲染得到，版权归原论文作者所有，仅用于学术展示；如公开发布请遵循原论文与出版方的使用条款。
- PSTalker 论文 DOI：[10.1109/ICASSP55912.2026.11463938](https://doi.org/10.1109/ICASSP55912.2026.11463938)。
- 如需补充论文官方链接/代码仓库地址，编辑 `papers.json` 中对应论文的 `links` 字段即可。

## 自定义指南

| 需求 | 修改位置 |
|------|----------|
| 增删论文、修改摘要/指标 | `assets/data/papers.json`（同步更新 `papers.js`） |
| 主题配色 | `style.css` 顶部 `:root` CSS 变量 |
| 站点标题/导航 | `index.html` |
| 版权持有人 | `LICENSE` 与页脚 |

---

## License

本项目代码与站点结构基于 [MIT License](./LICENSE) 发布。论文图片与文字内容的版权归原作者所有。
