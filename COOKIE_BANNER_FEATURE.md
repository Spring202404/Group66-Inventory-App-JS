# Cookie Banner 和隐私政策实现

## 功能概述
本分支实现了以下功能：

### 1. **功能性 Cookie 横幅（Cookie Banner）**
   - 在用户首次访问应用时显示 Cookie 同意横幅
   - 支持"接受"和"拒绝"两个选项
   - 使用 localStorage 存储用户的选择
   - 多语言支持（英文和中文）
   - 响应式设计，适配各种屏幕尺寸

### 2. **隐私政策页面**
   - 独立的隐私政策页面（`privacy-policy.html`）
   - 详细的隐私条款，包括：
     - 个人信息收集说明
     - 数据使用方式
     - 安全措施
     - 用户权利
     - Cookie 使用说明
   - 多语言友好的结构
   - 从 Cookie Banner 中可以直接链接到该页面

## 文件结构

### 新增文件：
- `src/js/cookieBanner.js` - Cookie Banner 核心逻辑类
- `public/privacy-policy.html` - 隐私政策页面

### 修改文件：
- `src/js/app.js` - 添加 Cookie Banner 初始化
- `src/js/i18n.js` - 添加 Cookie Banner 的多语言翻译
- `webpack.config.js` - 添加 cookieBanner.js 到构建入口
- `package.json` - 添加 cookieBanner-babel 构建脚本

## Cookie Banner 功能详解

### CookieBanner 类方法：
- `init()` - 初始化横幅（如果未做出选择则显示）
- `acceptCookies()` - 接受 Cookie 并启用分析
- `rejectCookies()` - 拒绝 Cookie 并禁用分析
- `hasAcceptedCookies()` - 检查是否已接受 Cookie
- `hasRejectedCookies()` - 检查是否已拒绝 Cookie
- `resetConsent()` - 重置用户选择（用于测试）

### 存储：
- 使用 `localStorage` 的 `inventory-app-cookie-consent` 键
- 存储值：`accepted` 或 `rejected`

## 多语言支持

### 英文翻译：
- `cookieTitle`: "Cookie Settings"
- `cookieDescription`: "We use cookies to enhance your experience..."
- `privacyPolicy`: "privacy policy"
- `acceptCookies`: "Accept"
- `rejectCookies`: "Reject"

### 中文翻译：
- `cookieTitle`: "Cookie 设置"
- `cookieDescription`: "我们使用 Cookie 来增强您的体验..."
- `privacyPolicy`: "隐私政策"
- `acceptCookies`: "接受"
- `rejectCookies`: "拒绝"

## 构建和运行

### 必需的构建步骤：
```bash
# 编译 Cookie Banner 文件
npm run cookieBanner-babel

# 重新编译 app.js（因为它现在导入 cookieBanner）
npm run app-babel

# 构建最终的 webpack bundle
npm run build

# （可选）开发模式下监视 Tailwind CSS
npm run dev
```

## 用户流程

1. **首次访问应用**：
   - Cookie Banner 在屏幕底部显示
   - 用户可选择"接受"或"拒绝"

2. **用户选择后**：
   - 选择被保存到 localStorage
   - 横幅自动隐藏
   - 在该浏览器/设备上不会再显示

3. **隐私政策访问**：
   - 用户可以点击 Cookie Banner 中的"隐私政策"链接
   - 将在新标签页打开隐私政策页面

## 技术栈

- **前端框架**：Vanilla JavaScript (ES6+)
- **样式**：Tailwind CSS
- **构建工具**：Webpack, Babel
- **本地存储**：localStorage
- **国际化**：自定义 i18n 系统

## 隐私政策内容

隐私政策涵盖了以下主要部分：
1. 简介
2. 信息收集类型
3. 信息使用方式
4. 信息披露
5. 信息安全
6. 联系信息
7. Cookie 使用说明
8. 用户权利
9. 儿童隐私
10. 政策变更
11. 数据保留
12. 国际数据传输
13. 第三方链接

## 后续改进建议

- [ ] 添加更多 Cookie 类型选项（分析、营销等）
- [ ] 实现动态隐私政策更新通知
- [ ] 添加 Cookie 偏好管理界面
- [ ] 集成第三方分析服务（如 Google Analytics）
- [ ] 添加统计数据跟踪
- [ ] 本地化更多语言

## 合规性注意

此实现遵循以下标准：
- GDPR（欧盟通用数据保护条例）基本要求
- ePrivacy 指令要求
- 部分 CCPA（加州消费者隐私法）要求

---

**分支名称**：`feature/cookie-banner-privacy-policy`  
**创建日期**：2026-05-07
