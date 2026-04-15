# Requirements: SCAME 智能选型工具

**Defined:** 2026-04-15
**Core Value:** 工业安全底线优先：电气选型必须100%精准，零幻觉、零编造型号、零参数错位，彻底杜绝安全事故风险。

## v1 Requirements

### 数据基础 (DATA)

- [ ] **DATA-01**: 结构化 SCAME 12000行产品数据，建立完整产品数据库
- [ ] **DATA-02**: 实现100%精准的SCAME编码规则解析引擎
- [ ] **DATA-03**: 产品数据可加密存储、多租户隔离、实时更新
- [ ] **DATA-04**: 建立产品技术参数验证体系，禁止任何参数错位

### 选型核心 (SELECTION)

- [ ] **SEL-01**: 正向选型功能：型号 → 技术参数 + 价格 + 库存
- [ ] **SEL-02**: 反向选型功能：技术参数 → 匹配产品列表
- [ ] **SEL-03**: 模糊查询功能：自然语言 → 智能推荐（基于规则引擎）
- [ ] **SEL-04**: 配套推荐功能：自动推荐插头+插座+连接器完整套装
- [ ] **SEL-05**: 选型结果100%精准验证，杜绝任何LLM幻觉

### 商业闭环 (COMMERCE)

- [ ] **COM-01**: 库存管理模块，支持多仓库、多SKU管理
- [ ] **COM-02**: 智能报价功能，基于选型结果自动生成报价单
- [ ] **COM-03**: 报价单导出功能（PDF/Excel/Word格式）
- [ ] **COM-04**: 报价历史记录和客户管理

### 部署运维 (DEPLOYMENT)

- [ ] **DEP-01**: 网页版稳定部署，全流程操作零障碍
- [ ] **DEP-02**: 生产环境服务器配置和监控
- [ ] **DEP-03**: 数据备份和恢复机制
- [ ] **DEP-04**: 系统性能监控和告警

### 集成接入 (INTEGRATION)

- [ ] **INT-01**: 钉钉机器人集成，支持对话式选型
- [ ] **INT-02**: 飞书机器人集成，支持对话式选型
- [ ] **INT-03**: API接口服务，支持第三方系统集成
- [ ] **INT-04**: 企业微信集成（备选）

### 文档沉淀 (DOCUMENTATION)

- [ ] **DOC-01**: 产品技术单页完善，包含完整功能说明
- [ ] **DOC-02**: 用户操作手册和培训材料
- [ ] **DOC-03**: 标准化SOP文档，为跨品牌复制做准备
- [ ] **DOC-04**: API接口文档和集成指南

## v2 Requirements

### 跨品牌复制 (MULTIBRAND)

- **MULTI-01**: 适配施耐德产品体系，无缝迁移选型逻辑
- **MULTI-02**: 支持其他电气元器件品牌快速接入
- **MULTI-03**: 品牌间产品对比和替换建议
- **MULTI-04**: 多品牌统一管理界面

### 高级功能 (ADVANCED)

- **ADV-01**: 3D产品展示和装配演示
- **ADV-02**: 项目配置模板和批量选型
- **ADV-03**: 智能库存预警和补货建议
- **ADV-04**: 销售数据分析和报表

### 移动应用 (MOBILE)

- **MOB-01**: 移动端应用，支持扫码选型
- **MOB-02**: 离线选型功能（基础数据本地缓存）
- **MOB-03**: 拍照识别产品型号
- **MOB-04**: 移动端报价单查看和分享

## Out of Scope

| Feature | Reason |
|---------|--------|
| 生成式AI作为选型核心 | 工业安全要求100%准确，LLM幻觉风险不可接受 |
| 复杂的AI模型训练 | 成本过高，不符合轻资产创业模式 |
| 重后端微服务架构 | 过度工程化，不符合小微用户需求 |
| 一次性大额算力投入 | 违反成本约束，采用渐进式扩展策略 |
| 全自动化销售系统 | 超出选型工具核心定位，保留人工销售环节 |
| 实时多人协作编辑 | 用户场景不需要，增加复杂度 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| SEL-01 | Phase 2 | Pending |
| SEL-02 | Phase 2 | Pending |
| SEL-03 | Phase 2 | Pending |
| SEL-04 | Phase 2 | Pending |
| SEL-05 | Phase 2 | Pending |
| COM-01 | Phase 3 | Pending |
| COM-02 | Phase 3 | Pending |
| COM-03 | Phase 3 | Pending |
| COM-04 | Phase 3 | Pending |
| DEP-01 | Phase 4 | Pending |
| DEP-02 | Phase 4 | Pending |
| DEP-03 | Phase 4 | Pending |
| DEP-04 | Phase 4 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 5 | Pending |
| INT-04 | Phase 5 | Pending |
| DOC-01 | Phase 6 | Pending |
| DOC-02 | Phase 6 | Pending |
| DOC-03 | Phase 6 | Pending |
| DOC-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initial definition*