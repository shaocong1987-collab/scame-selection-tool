# Codebase Concerns

**Analysis Date:** 2026-04-16

## Tech Debt

**RAG向量存储实现不完整:**
- Issue: `src/lib/rag/VectorStore.ts` 中的ChromaDB集成仅为存根实现，实际方法返回空数组
- Files: `src/lib/rag/VectorStore.ts`
- Impact: RAG系统无法实际检索文档，知识增强功能完全失效
- Fix approach: 实现真实的ChromaDB API集成，添加向量存储配置和连接管理

**产品数据生成功能缺失:**
- Issue: `src/lib/scame/matching.ts` 中的 `generatePartNumbers` 方法返回空数组，注释说明需要产品数据库
- Files: `src/lib/scame/matching.ts`
- Impact: 无法根据技术参数生成具体订货号，选型功能不完整
- Fix approach: 实现产品数据库查询逻辑，连接实际产品数据源

**测试基础设施缺失:**
- Issue: `tests/` 目录为空，package.json中配置了测试命令但无实际测试文件
- Files: `tests/`, `package.json`
- Impact: 无法保证代码质量，重构风险高，难以验证业务逻辑正确性
- Fix approach: 添加单元测试覆盖核心业务逻辑（编码解析、匹配验证），配置测试运行环境

## Performance Bottlenecks

**三重嵌套循环组合搜索:**
- Problem: `src/lib/scame/matching.ts` 中的 `findMatchingSets` 方法使用三重嵌套循环遍历所有产品组合
- Files: `src/lib/scame/matching.ts` (第476-492行)
- Cause: 算法复杂度为O(n³)，当产品数据量大时性能急剧下降
- Improvement path: 实现基于索引的匹配算法，使用预计算的产品兼容性矩阵，添加缓存机制

**大型文件处理缺乏流式处理:**
- Problem: `src/lib/rag/DocumentProcessor.ts` 处理大文档时可能内存占用过高
- Files: `src/lib/rag/DocumentProcessor.ts`
- Cause: 文档处理一次性加载整个文件内容
- Improvement path: 实现流式文档处理，分块读取和处理，添加内存使用监控

## Fragile Areas

**编码解析错误处理不完整:**
- Files: `src/lib/scame/coding.ts`
- Why fragile: 部分错误情况可能未正确处理，异常边界不清晰
- Safe modification: 添加更全面的输入验证，完善错误类型定义
- Test coverage: 无测试覆盖，修改风险高

**RAG服务依赖存根实现:**
- Files: `src/lib/rag/ScameRAGService.ts`, `src/lib/rag/VectorStore.ts`
- Why fragile: 核心依赖未实现，服务调用链可能中断
- Safe modification: 先实现VectorStore真实集成，再测试RAG服务完整性
- Test coverage: 无集成测试

## Missing Critical Features

**产品数据库集成:**
- Problem: 项目缺少实际产品数据源，所有产品数据为硬编码或模拟数据
- Blocks: 无法进行真实的产品选型和匹配验证
- Priority: High

**用户认证和权限系统:**
- Problem: 虽然设计了登录页面，但无实际认证实现
- Blocks: 无法实现企业级多用户管理
- Priority: Medium

**数据导入和同步机制:**
- Problem: 缺少从SCAME官方数据源同步产品信息的自动化流程
- Blocks: 产品信息可能过时或不准确
- Priority: High

## Test Coverage Gaps

**核心业务逻辑无测试:**
- What's not tested: 编码解析、产品匹配、兼容性验证等核心算法
- Files: `src/lib/scame/coding.ts`, `src/lib/scame/matching.ts`
- Risk: 业务逻辑错误可能导致错误的产品推荐，存在安全隐患
- Priority: High

**RAG系统无测试:**
- What's not tested: 文档处理、向量检索、知识增强生成
- Files: `src/lib/rag/`
- Risk: RAG系统不可靠，可能提供不准确的技术信息
- Priority: Medium

**UI组件无测试:**
- What's not tested: React组件交互、表单验证、状态管理
- Files: `src/components/`, `src/pages/`
- Risk: 用户界面可能包含交互错误或状态管理问题
- Priority: Low

## Security Considerations

**缺乏输入验证和清理:**
- Risk: 用户输入可能包含恶意内容或导致解析错误
- Files: `src/pages/ReverseSelectionPage.tsx`, `src/lib/scame/coding.ts`
- Current mitigation: 基本输入验证，但不够全面
- Recommendations: 添加Zod schema验证所有用户输入，实现输入清理和转义

**环境配置管理不完善:**
- Risk: 敏感配置可能硬编码或缺乏安全管理
- Files: 项目根目录
- Current mitigation: 无.env文件，但配置可能硬编码
- Recommendations: 添加.env.example模板，实现配置验证，避免硬编码敏感信息

## Dependencies at Risk

**测试框架配置但未使用:**
- Risk: Vitest、Playwright等测试框架已安装但未配置使用
- Impact: 开发工具链不完整，测试文化缺失
- Migration plan: 配置测试运行环境，添加示例测试，建立测试工作流

**RAG相关依赖未充分利用:**
- Risk: LangChain等RAG相关依赖可能未正确集成
- Impact: RAG系统功能受限
- Migration plan: 评估现有RAG实现，必要时重构或更换技术方案

## Scaling Limits

**内存使用无监控:**
- Current capacity: 未知
- Limit: 大文档处理可能导致内存溢出
- Scaling path: 添加内存使用监控，实现资源限制，优化大文件处理

**并发处理能力未知:**
- Current capacity: 单用户应用设计
- Limit: 多用户并发时性能可能下降
- Scaling path: 添加请求队列，实现异步处理，考虑水平扩展

---

*Concerns audit: 2026-04-16*