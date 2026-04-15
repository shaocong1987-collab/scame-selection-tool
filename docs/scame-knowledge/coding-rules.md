# SCAME 编码规则系统

## 概述

SCAME产品编码是一个严密的"元素周期表"体系，通过订货号(Part Number)的每个字符精确传达产品类别、技术参数和兼容关系。掌握编码规则是开发智能选型工具的核心基础。

## 🔢 编码体系结构

### 订货号格式
```
    5   1   3   .   6   3   5   3   2   T
    │   │   │       │   │   │   │   │   │
    │   │   │       │   │   │   │   │   └── 变体标识 (T=斜式, P=穿孔端子)
    │   │   │       │   │   │   │   └────── 配置代码 (32=2P+E IP44)
    │   │   │       │   │   │   └───────── 电流值 (63=63A)
    │   │   │       │   │   └───────────── 系列细分 (1=OPTIMA-TOP, 8=SAFE-IN)
    │   │   │       │   └───────────────── 产品大类 (5=明装插座)
    │   │   │       └───────────────────── 小数点分隔符
    │   │   └───────────────────────────── 未知（可能表示电压或特殊属性）
    │   └───────────────────────────────── 品牌系列 (2=插头, 5=插座, 8=连接器)
    └───────────────────────────────────── 产品类别 (1-8类 + 899特例)
```

## 📊 首位数字大类映射

### 1. 标准产品类别 (1-8类)

| 首位数字 | 产品类别 | 典型前缀 | 示例产品 | 说明 |
|---------|---------|---------|---------|------|
| **1** | 民用面板及附件 | 101, 137, 146 | 101 (开关面板) | 民用级产品，防护要求较低 |
| **2** | 输入端/工业插头/器具插座 | 213, 218, 240 | 213.1632 (16A插头) | 工业插头，设备输入端 |
| **3** | 移动输出端/连接器 | 313, 318 | 313.3237 (32A连接器) | 移动设备连接，输出端 |
| **4** | 暗装输出端/面板插座 | 413, 423, 409 | 413.3267 (暗装插座) | 嵌入式安装，面板式 |
| **5** | 明装及高阶控制端 | 513, 504, 560 | 513.63532T (明装插座) | 表面安装，机械连锁 |
| **6** | 箱体与基座 | 686, 688, 656 | 686 (防水接线盒) | 防护外壳，安装基座 |
| **7** | 线缆盘与照明 | 745, 746, 770 | 745 (工业电缆盘) | 便携式供电，照明设备 |
| **8** | 安装辅材类 | 805, 815, 874 | 805 (防水电缆接头) | 安装配件，连接组件 |

### 2. 大电流产品特例 (899系列)

| 前缀 | 产品类型 | 外壳材料 | 电流范围 | 电压 | 电缆直径 |
|------|---------|---------|---------|------|----------|
| **899.AL** | 大电流插头插座 | 铝制 (Aluminum) | 160-800A | 1000V | 16-185mm² |
| **899.AS** | 大电流插头插座 | 不锈钢 (Stainless Steel) | 160-800A | 1000V | 16-185mm² |

## 🛡️ 防护等级编码规则

### 第三位数字编码
| 第三位数字 | 防护等级 | 应用环境 | 典型前缀 |
|-----------|---------|---------|---------|
| **3** | IP44/IP54 | 防溅型，室内一般工业 | 213, 413, 513 |
| **8** | IP66/IP67/IP69 | 防水型，户外恶劣环境 | 218, 418, 518 |

### 安装方式编码
| 前缀范围 | 安装方式 | 典型产品 | 说明 |
|---------|---------|---------|------|
| **41-42** | 暗装斜式 | 413.3267 | 嵌入式安装，接线口倾斜 |
| **42-43** | 暗装直式 | 423.3267 | 嵌入式安装，接线口垂直 |
| **51-52** | 明装式 | 513.63532T | 表面安装，外露式 |

## ⚡ 技术参数编码

### 电流规格编码
| 小数点后代码 | 电流值 | 典型产品 | 应用场景 |
|------------|-------|---------|---------|
| **.16** | 16A | 213.1632, 513.16532T | 轻型设备，控制回路 |
| **.32** | 32A | 213.3237, 513.32532T | 标准工业设备 |
| **.63** | 63A | 213.6332, 513.63532T | 中型动力设备 |
| **.125** | 125A | 213.12532, 513.125532T | 重工业设备 |
| **.16X** | 大电流 (160A+) | 899.AL2DE335 | 特大功率设备 |

### 极数配置编码
| 配置代码 | 极数配置 | 说明 | IEC 60309 时钟位置 |
|---------|---------|------|-------------------|
| **32** | 2P+E | 单相带接地 | 6h |
| **36** | 3P+E | 三相带接地 | 4h |
| **37** | 3P+N+E | 三相四线带接地 | 5h |
| **46** | 4P+E | 四相带接地 | 特殊配置 |

## 🔄 黄金替换法则

### 核心替换逻辑
```
插头 213.3237 → 替换首位数字即可匹配：
  213 → 313 = 移动连接器 (313.3237)
  213 → 413/423 = 暗装插座 (413.3267)  
  213 → 513 = 明装插座 (513.3257)
```

### 替换映射表
| 源产品类型 | 源前缀 | 可替换目标 | 目标前缀 | 关系说明 |
|-----------|-------|-----------|---------|---------|
| 工业插头 | **2**xx | 移动连接器 | **3**xx | 插头→连接器 |
| 工业插头 | **2**xx | 暗装插座 | **4**xx | 插头→暗装插座 |
| 工业插头 | **2**xx | 明装插座 | **5**xx | 插头→明装插座 |
| 移动连接器 | **3**xx | 工业插头 | **2**xx | 连接器→插头 |
| 暗装插座 | **4**xx | 工业插头 | **2**xx | 插座→插头 |
| 明装插座 | **5**xx | 工业插头 | **2**xx | 插座→插头 |

### 替换算法
```typescript
/**
 * SCAME编码替换算法
 * @param partNumber 原始订货号，如 "213.3237"
 * @param targetType 目标产品类型: 'connector' | 'recessed' | 'surface'
 * @returns 替换后的订货号数组
 */
function generateReplacements(partNumber: string, targetType: string): string[] {
  const [prefix, suffix] = partNumber.split('.');
  const firstDigit = prefix[0];
  const thirdDigit = prefix[2]; // 防护等级位
  
  let targetPrefixes: string[] = [];
  
  // 根据源类型和目标类型确定替换规则
  if (firstDigit === '2' && targetType === 'connector') {
    targetPrefixes = ['3' + prefix[1] + thirdDigit]; // 2→3
  } else if (firstDigit === '2' && targetType === 'recessed') {
    targetPrefixes = ['4' + '1' + thirdDigit, '4' + '2' + thirdDigit]; // 2→41/42
  } else if (firstDigit === '2' && targetType === 'surface') {
    targetPrefixes = ['5' + '1' + thirdDigit]; // 2→51
  }
  
  // 生成替换型号
  return targetPrefixes.map(p => `${p}.${suffix}`);
}
```

## 📁 特殊编码规则

### 1. 大电流产品编码 (899系列)
```
899.AL2DE335
├── 899        → 大电流产品系列
├── AL         → 铝制外壳 (AS=不锈钢)
├── 2          → 产品子类 (2=插座, 5=插头, 8=连接器)
├── DE         → 插座类型 (DE=插座, PR=插头, CE=连接器)
└── 335        → 技术参数代码
```

### 2. 机械连锁插座编码
```
560.16832 (ADVANCE2系列)
├── 560        → ADVANCE2机械连锁插座
├── 1          → 电流代码 (1=16A, 3=32A, 6=63A)
├── 6          → 极数代码 (6=3P+E, 8=4P+E)
├── 8          → 配置代码
└── 32         → 变体标识
```

### 3. UL认证产品编码
```
221.1630 (EUREKA-HD UL系列)
├── 221        → EUREKA-HD系列，UL认证
├── 16         → 16A电流
└── 30         → 配置代码
```

## 🧪 编码解析示例

### 示例1: 标准工业插头
```
订货号: 213.3237
解析:
┌─ 2 → 输入端/工业插头类
├─ 1 → OPTIMA系列
├─ 3 → IP44/IP54防护等级
├─ .3237 → 技术参数代码
   ├─ 32 → 32A电流
   └─ 37 → 3P+N+E极数配置

结果: OPTIMA系列 32A 3P+N+E IP44工业插头
```

### 示例2: 明装插座
```
订货号: 513.63532T
解析:
┌─ 5 → 明装及高阶控制端
├─ 1 → OPTIMA-TOP系列
├─ 3 → IP44/IP54防护等级  
├─ .63532 → 技术参数代码
   ├─ 63 → 63A电流
   ├─ 53 → 配置代码
   └─ 2 → 2P+E极数
└─ T → 斜式变体

结果: OPTIMA-TOP系列 63A 2P+E IP44斜式明装插座
```

### 示例3: 大电流产品
```
订货号: 899.AL2DE335
解析:
┌─ 899 → 大电流产品系列
├─ AL → 铝制外壳
├─ 2 → 插座类型
├─ DE → 插座
├─ 3 → 电流代码 (3≈160A)
├─ 3 → 极数代码 (3=3P+E)
└─ 5 → 配置变体

结果: 铝制外壳 160A 3P+E IP67大电流插座
```

## 🔍 编码验证规则

### 1. 格式验证
```typescript
function validatePartNumberFormat(partNumber: string): boolean {
  // 基本格式：XXX.XXXXX 或 899.XXXXXXX
  const pattern = /^(\d{3}\.\d{4,6}|899\.[A-Z]{2}\d{1}[A-Z]{2}\d{3})$/;
  return pattern.test(partNumber);
}
```

### 2. 逻辑验证
```typescript
function validatePartNumberLogic(partNumber: string): ValidationResult {
  const [prefix, suffix] = partNumber.split('.');
  const firstDigit = prefix[0];
  const thirdDigit = prefix[2];
  
  const errors: string[] = [];
  
  // 验证首位数字有效性
  if (!['1','2','3','4','5','6','7','8'].includes(firstDigit) && !prefix.startsWith('899')) {
    errors.push(`无效的首位数字: ${firstDigit}`);
  }
  
  // 验证防护等级位
  if (['2','3','4','5'].includes(firstDigit) && !['3','8'].includes(thirdDigit)) {
    errors.push(`无效的防护等级代码: ${thirdDigit}`);
  }
  
  // 验证电流代码（针对标准产品）
  if (firstDigit !== '8') {
    const currentCode = suffix.substring(0, 2);
    if (!['16','32','63','125'].some(code => suffix.startsWith(code))) {
      errors.push(`无效的电流代码: ${currentCode}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: errors.length > 0 ? ['请检查订货号格式'] : []
  };
}
```

## 📚 编码规则数据表

### 完整映射表 (CSV格式)
```csv
字段,描述,示例,规则说明
first_digit,首位数字大类,2,1-8分别对应不同产品类别
second_digit,系列细分,1,不同系列有不同的编码
third_digit,防护等级,3,3=IP44/IP54, 8=IP66/IP67
current_code,电流代码,32,.32=32A, .63=63A
poles_code,极数代码,37,32=2P+E, 36=3P+E, 37=3P+N+E
variant,变体标识,T,T=斜式, P=穿孔端子
```

### 特殊字符表
| 字符 | 含义 | 出现位置 | 示例 |
|------|------|---------|------|
| **T** | 斜式 | 订货号末尾 | 513.63532T |
| **P** | 穿孔端子 | 订货号末尾 | 213.1630P |
| **TR** | 透明手柄 | 订货号末尾 | 213.1630.TR |
| **K** | 黑色 | 订货号末尾 | 213.1630.K |
| **F** | 法兰定制 | 订货号末尾 | 402.16832-F |

## 🚨 常见错误编码

### 1. 格式错误
- `51363532T` ❌ 缺少小数点
- `51.363532T` ❌ 前缀应为3位数字
- `513.63` ❌ 后缀过短

### 2. 逻辑错误
- `219.3237` ❌ 第三位9不是有效防护等级代码
- `513.1637` ❌ 16A产品使用37(3P+N+E)可能不匹配
- `213.3237T` ❌ 变体标识位置错误

### 3. 已停产型号
- 某些旧型号可能已停产
- 需要参考最新产品目录验证
- 提供替代型号建议

## 🔧 编码工具函数

### TypeScript实现
```typescript
// 编码解析器
class ScamePartNumberParser {
  parse(partNumber: string): ParsedPartNumber {
    const [prefix, suffix] = partNumber.split('.');
    
    return {
      partNumber,
      prefix,
      suffix,
      category: this.getCategory(prefix),
      series: this.getSeries(prefix),
      protection: this.getProtection(prefix),
      current: this.getCurrent(suffix),
      poles: this.getPoles(suffix),
      variant: this.getVariant(partNumber),
      isValid: this.validate(partNumber)
    };
  }
  
  private getCategory(prefix: string): string {
    const firstDigit = prefix[0];
    const categories = {
      '1': '民用面板及附件',
      '2': '输入端/工业插头/器具插座',
      '3': '移动输出端/连接器',
      '4': '暗装输出端/面板插座',
      '5': '明装及高阶控制端',
      '6': '箱体与基座',
      '7': '线缆盘与照明',
      '8': prefix.startsWith('899') ? '大电流产品' : '安装辅材类'
    };
    
    return categories[firstDigit] || '未知类别';
  }
  
  // ... 其他解析方法
}

// 替换生成器
class ReplacementGenerator {
  generateReplacements(partNumber: string): Replacement[] {
    const parser = new ScamePartNumberParser();
    const parsed = parser.parse(partNumber);
    
    const replacements: Replacement[] = [];
    
    // 基于首位数字生成替换
    if (['2','3','4','5'].includes(parsed.prefix[0])) {
      const targetPrefixes = this.getTargetPrefixes(parsed.prefix);
      
      for (const targetPrefix of targetPrefixes) {
        const targetPartNumber = `${targetPrefix}.${parsed.suffix}`;
        
        // 验证替换是否有效
        if (this.validateReplacement(partNumber, targetPartNumber)) {
          replacements.push({
            original: partNumber,
            replacement: targetPartNumber,
            relationship: this.getRelationship(parsed.prefix[0], targetPrefix[0]),
            confidence: this.calculateConfidence(parsed, targetPrefix)
          });
        }
      }
    }
    
    return replacements;
  }
}
```

## 📖 学习资源

### 官方文档
1. **SCAME编码规则.docx** - 核心编码规则
2. **产品选型表_简化无图.xlsx** - 实际应用编码
3. **SCAME产品手册** - 完整技术规格

### 实践练习
1. 解析10个不同类型产品的订货号
2. 为给定产品生成配套替换型号
3. 验证用户输入的订货号有效性
4. 根据技术参数反向生成订货号

### 测试题库
```typescript
// 测试案例
const testCases = [
  { input: '213.3237', expected: '32A 3P+N+E IP44工业插头' },
  { input: '513.63532T', expected: '63A 2P+E IP44斜式明装插座' },
  { input: '899.AL2DE335', expected: '160A 3P+E IP67大电流插座' },
  { input: '560.16832', expected: '16A 2P+E IP44机械连锁插座' }
];
```

---

**文档版本**: 1.0  
**更新日期**: 2026-04-14  
**维护者**: SCAME编码专家团队  
**重要性**: ⭐⭐⭐⭐⭐ (核心业务逻辑)