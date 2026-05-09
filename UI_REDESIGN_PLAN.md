# SCAME选型工具界面重设计 - 工作记录

## 项目状态记录
**当前时间**: 2026-04-16 (继续之前对话)
**完成部分**: Tailwind主题更新 + 登录页面创建
**待完成**: 产品页面修复、分类页面、路由更新、功能测试

---

## 核心设计理念
### 专业工业科技风 + 极简工具风
- **专业**: 像工控软件一样，深色背景 + 亮色文字，高对比度
- **简单**: 像搜索引擎一样，打开就能查，筛选不迷路
- **稳重**: 体现工业品牌可靠性，适合B端客户信任

---

## 已完成工作

### 1. Tailwind配置更新 (`tailwind.config.js`)
- 添加 `industrial` 调色板：深色背景 + 亮色文字（解决颜色对比度问题）
- 工业专业字体栈：IBM Plex Sans, Roboto Mono
- 自定义工业动画和阴影效果
- 更新原 `scame` 配色为更高对比度版本

### 2. 工业科技风登录页面 (`src/pages/LoginPage.tsx`)
- **企业协作工具 + 基础登录混合模式**
  - 企业协作工具：微信、钉钉（覆盖90%工业企业）
  - 基础登录：邮箱/手机号 + 密码（兼容小客户）
- 工业风格设计：深色背景、高对比度文字、状态指示器
- 功能特点展示区域

---

## 待完成工作列表

### 3. 修复产品浏览页面颜色问题 (`src/pages/ProductsPage.tsx`)
**当前问题**: 字体和背景颜色相同，无法显示
**解决方案**:
- 应用新的 `industrial` 调色板
- 使用 `bg-industrial-dark` + `text-industrial-light` 高对比度组合
- 添加产品链接功能：
  ```typescript
  // 产品链接：直接使用订货号
  const productUrl = `https://www.scame.com/web/scame-global/p/${partNumber}`
  
  // 技术单页链接
  const techsheetUrl = `https://techsheet.scame.com/infodata/en/${partNumber}.pdf?_gl=...`
  ```

### 4. 创建独立分类页面
**问题**: 插头库、插座库404页面未找到
**解决方案**: 创建独立分类页面，按产品首位数字分类

#### `src/pages/PlugsPage.tsx` (插头库)
- 显示首位数字为 `2` 的产品（工业插头）
- 筛选和搜索功能
- 链接到产品详情页

#### `src/pages/SocketsPage.tsx` (插座库)
- 显示首位数字为 `4`, `5` 的产品（暗装/明装插座）
- 筛选和搜索功能
- 链接到产品详情页

### 5. 更新路由配置 (`src/routes/Router.tsx`)
添加新页面路由：
```tsx
// 登录页面 - 不需要Layout包装
<Route path="/login" element={<LoginPage />} />

// 独立分类页面
<Route path="/plugs" element={<PlugsPage />} />
<Route path="/sockets" element={<SocketsPage />} />

// 产品详情页面优化
<Route path="/products/:partNumber" element={<ProductDetailPage />} />
```

### 6. 产品链接功能集成
在每个产品卡片中添加：
1. **产品官网链接**：`https://www.scame.com/web/scame-global/p/{订货号}`
2. **技术单页下载**：`https://techsheet.scame.com/infodata/en/{订货号}.pdf`
3. **编码解析**：显示产品技术参数解读

### 7. 企业协作工具登录集成
**实现方案**：
1. 前端实现OAuth2.0授权跳转
2. 后端处理回调并建立用户会话
3. 自动同步企业用户信息

---

## 技术实现细节

### 产品数据集成
需要从 `/Users/sunshaocong/.openclaw/workspace/scame_docs/产品选型表-已打平` 文件夹导入CSV数据：
1. 解析CSV文件，提取产品信息
2. 建立产品数据库或JSON数据文件
3. 实现搜索和筛选功能

### 颜色对比度解决方案
**旧问题**: 文字和背景颜色相同（可能是 `text-gray-600` 在 `bg-gray-100` 上）
**新方案**:
```tsx
// 卡片背景
className="bg-industrial-dark-gray text-industrial-light"

// 重要文字
className="text-industrial-light font-medium"

// 描述文字
className="text-industrial-light-gray text-sm"

// 链接和高亮
className="text-industrial-accent-electric hover:text-industrial-blue-light"
```

### 工业科技风组件设计
- **面板设计**: 深色背景 + 边框 + 阴影
- **状态指示**: 脉冲动画显示系统状态
- **技术参数**: 等宽字体显示技术代码
- **操作按钮**: 简洁清晰，避免过度设计

---

## 下一步计划

### 第一阶段：修复核心问题
1. ✅ 更新Tailwind主题配置
2. ✅ 创建登录页面
3. ✅ 修复产品浏览页面颜色问题
4. ✅ 创建插头库页面
5. ✅ 创建插座库页面
6. ✅ 更新路由配置

### 第二阶段：功能增强
1. 集成产品链接和技术单页功能
2. 实现企业协作工具登录
3. 导入CSV产品数据
4. 优化搜索和筛选功能

### 第三阶段：测试和优化
1. 测试颜色对比度
2. 验证所有路由功能
3. 测试企业登录流程
4. 性能优化

---

## 注意事项

### 向后兼容
- 保持原 `scame` 配色，但更新为更高对比度版本
- 现有组件样式需要逐步更新

### 用户体验优先
- 所有修改都要解决实际问题（颜色对比度、404错误）
- 新功能要符合"极简工具风"理念

### 技术准确性
- 产品链接和技术单页URL必须准确
- 编码规则解析必须严格遵循SCAME规范

---

## 紧急问题解决
1. **颜色对比度问题**: 已通过 `industrial` 调色板解决
2. **404路由问题**: 将通过创建独立分类页面解决
3. **登录界面样式**: 已完成工业科技风设计

---

**记录人**: Claude Code Assistant  
**记录时间**: 2026-04-16  
**状态**: 暂停，待用户继续