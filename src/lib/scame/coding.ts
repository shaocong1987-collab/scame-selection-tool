/**
 * SCAME 产品编码规则解析器
 *
 * 基于SCAME官方编码规则，实现订货号解析、验证和替换功能。
 * 严格遵守SCAME编码规范，严禁技术参数幻觉。
 */

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 产品类别枚举
 */
export enum ProductCategory {
  CIVILIAN = '民用面板及附件',
  INPUT_PLUG = '输入端/工业插头/器具插座',
  MOBILE_CONNECTOR = '移动输出端/连接器',
  RECESSED_SOCKET = '暗装输出端/面板插座',
  SURFACE_MOUNT = '明装及高阶控制端',
  ENCLOSURE = '箱体与基座',
  CABLE_REEL = '线缆盘与照明',
  ACCESSORY = '安装辅材类',
  HIGH_CURRENT = '大电流产品'
}

/**
 * 防护等级枚举
 */
export enum ProtectionRating {
  IP44 = 'IP44',
  IP54 = 'IP54',
  IP66 = 'IP66',
  IP67 = 'IP67',
  IP69 = 'IP69',
  IP44_IP54 = 'IP44/IP54',
  IP66_IP67 = 'IP66/IP67',
  IP66_IP67_IP69 = 'IP66/IP67/IP69'
}

/**
 * 电流规格枚举
 */
export enum CurrentRating {
  A16 = '16A',
  A20 = '20A',
  A30 = '30A',
  A32 = '32A',
  A60 = '60A',
  A63 = '63A',
  A100 = '100A',
  A125 = '125A',
  A160 = '160A',
  A250 = '250A',
  A320 = '320A',
  A370 = '370A',
  A420 = '420A',
  A500 = '500A',
  A570 = '570A',
  A800 = '800A'
}

/**
 * 极数配置枚举
 */
export enum PolesConfiguration {
  P2E = '2P+E',
  P3E = '3P+E',
  P3NE = '3P+N+E',
  P4E = '4P+E',
  P4NE = '4P+N+E'
}

/**
 * 电压范围类型
 */
export type VoltageRange =
  | '24V'
  | '40-50V'
  | '100-130V'
  | '200-250V'
  | '208-250V'
  | '277V'
  | '346-415V'
  | '380-415V'
  | '440-460V'
  | '480-500V'
  | '600-690V'
  | '1000V'
  | '3Ø250'
  | '3Ø380-415'
  | '3Ø480'
  | '3Ø600'
  | '3ØY120/208'
  | '3ØY277/480'
  | '3ØY347/600';

/**
 * 产品系列枚举
 */
export enum ProductSeries {
  OPTIMA = 'OPTIMA',
  OPTIMA_TOP = 'OPTIMA-TOP',
  SAFE_IN = 'SAFE-IN',
  EUREKA = 'EUREKA',
  EUREKA_HD = 'EUREKA-HD',
  XENIA = 'XENIA',
  ADVANCE2 = 'ADVANCE2',
  ADVANCE_GRP = 'ADVANCE-GRP',
  PROXIMA = 'PROXIMA',
  OMNIA = 'OMNIA',
  DOMO = 'DOMO',
  IKONA = 'IKONA',
  PROTECTA = 'PROTECTA',
  OPTIMA_METAL_HDAL = 'OPTIMA-METAL[HDAL]',
  OPTIMA_METAL_HDAS = 'OPTIMA-METAL[HDAS]'
}

/**
 * 解析结果接口
 */
export interface ParsedPartNumber {
  /** 原始订货号 */
  partNumber: string;

  /** 前缀部分（小数点前） */
  prefix: string;

  /** 后缀部分（小数点后） */
  suffix: string;

  /** 产品类别 */
  category: ProductCategory;

  /** 产品系列 */
  series: ProductSeries | string;

  /** 防护等级 */
  protection: ProtectionRating;

  /** 电流规格 */
  current: CurrentRating;

  /** 极数配置 */
  poles: PolesConfiguration;

  /** 电压范围（如果可解析） */
  voltage?: VoltageRange;

  /** 变体标识 */
  variant?: string;

  /** 是否有效 */
  isValid: boolean;

  /** 验证错误信息 */
  errors: string[];

  /** 警告信息 */
  warnings: string[];
}

/**
 * 替换建议接口
 */
export interface ReplacementSuggestion {
  /** 原始订货号 */
  original: string;

  /** 替换订货号 */
  replacement: string;

  /** 替换关系 */
  relationship: string;

  /** 置信度 (0-1) */
  confidence: number;

  /** 差异说明 */
  differences: string[];
}

// ============================================================================
// 常量定义
// ============================================================================

/**
 * 首位数字到产品类别的映射
 */
const CATEGORY_BY_FIRST_DIGIT: Record<string, ProductCategory> = {
  '1': ProductCategory.CIVILIAN,
  '2': ProductCategory.INPUT_PLUG,
  '3': ProductCategory.MOBILE_CONNECTOR,
  '4': ProductCategory.RECESSED_SOCKET,
  '5': ProductCategory.SURFACE_MOUNT,
  '6': ProductCategory.ENCLOSURE,
  '7': ProductCategory.CABLE_REEL,
  '8': ProductCategory.ACCESSORY
};

/**
 * 第三位数字到防护等级的映射
 */
const PROTECTION_BY_THIRD_DIGIT: Record<string, ProtectionRating> = {
  '3': ProtectionRating.IP44_IP54,
  '8': ProtectionRating.IP66_IP67_IP69
};

/**
 * 电流代码映射
 */
const CURRENT_BY_CODE: Record<string, CurrentRating> = {
  '16': CurrentRating.A16,
  '20': CurrentRating.A20,
  '30': CurrentRating.A30,
  '32': CurrentRating.A32,
  '60': CurrentRating.A60,
  '63': CurrentRating.A63,
  '100': CurrentRating.A100,
  '125': CurrentRating.A125,
  '160': CurrentRating.A160,
  '250': CurrentRating.A250,
  '320': CurrentRating.A320,
  '370': CurrentRating.A370,
  '420': CurrentRating.A420,
  '500': CurrentRating.A500,
  '570': CurrentRating.A570,
  '800': CurrentRating.A800
};

/**
 * 极数代码映射
 */
const POLES_BY_CODE: Record<string, PolesConfiguration> = {
  '32': PolesConfiguration.P2E,   // 2P+E
  '36': PolesConfiguration.P3E,   // 3P+E
  '37': PolesConfiguration.P3NE,  // 3P+N+E
  '46': PolesConfiguration.P4E,   // 4P+E
  '47': PolesConfiguration.P4NE   // 4P+N+E
};

/**
 * 系列代码映射
 */
const SERIES_BY_PREFIX: Record<string, ProductSeries> = {
  '213': ProductSeries.OPTIMA,
  '218': ProductSeries.OPTIMA,
  '221': ProductSeries.EUREKA_HD,
  '226': ProductSeries.EUREKA_HD,
  '214': ProductSeries.XENIA,
  '313': ProductSeries.OPTIMA,
  '318': ProductSeries.OPTIMA,
  '413': ProductSeries.OPTIMA,
  '418': ProductSeries.OPTIMA,
  '423': ProductSeries.OPTIMA,
  '428': ProductSeries.OPTIMA,
  '513': ProductSeries.OPTIMA_TOP,
  '518': ProductSeries.SAFE_IN,
  '560': ProductSeries.ADVANCE2,
  '562': ProductSeries.ADVANCE2,
  '567': ProductSeries.ADVANCE2,
  '402': ProductSeries.ADVANCE_GRP,
  '403': ProductSeries.ADVANCE_GRP,
  '899.AL': ProductSeries.OPTIMA_METAL_HDAL,
  '899.AS': ProductSeries.OPTIMA_METAL_HDAS
};

/**
 * 替换规则映射（黄金替换法则）
 */
const REPLACEMENT_RULES: Record<string, string[]> = {
  // 插头(2xx) → 连接器/暗装/明装
  '2': ['3', '4', '5'],
  // 连接器(3xx) → 插头/暗装/明装
  '3': ['2', '4', '5'],
  // 暗装(4xx) → 插头/连接器/明装
  '4': ['2', '3', '5'],
  // 明装(5xx) → 插头/连接器/暗装
  '5': ['2', '3', '4']
};

// ============================================================================
// 核心解析器类
// ============================================================================

/**
 * SCAME编码规则解析器
 */
export class ScameCodingParser {

  /**
   * 解析订货号
   * @param partNumber 订货号，如 "513.63532T"
   * @returns 解析结果
   */
  parse(partNumber: string): ParsedPartNumber {
    const result: ParsedPartNumber = {
      partNumber,
      prefix: '',
      suffix: '',
      category: ProductCategory.CIVILIAN,
      series: '',
      protection: ProtectionRating.IP44,
      current: CurrentRating.A16,
      poles: PolesConfiguration.P2E,
      isValid: false,
      errors: [],
      warnings: []
    };

    try {
      // 基本格式验证
      if (!this.validateFormat(partNumber)) {
        result.errors.push('订货号格式不正确');
        return result;
      }

      // 分割前缀和后缀
      const [prefix, suffix] = partNumber.split('.');
      result.prefix = prefix;
      result.suffix = suffix;

      // 解析首位数字（产品类别）
      const firstDigit = prefix[0];
      if (firstDigit in CATEGORY_BY_FIRST_DIGIT) {
        result.category = CATEGORY_BY_FIRST_DIGIT[firstDigit];
      } else if (prefix.startsWith('899')) {
        result.category = ProductCategory.HIGH_CURRENT;
      } else {
        result.errors.push(`无效的首位数字: ${firstDigit}`);
      }

      // 解析防护等级（第三位数字）
      if (prefix.length >= 3) {
        const thirdDigit = prefix[2];
        if (thirdDigit in PROTECTION_BY_THIRD_DIGIT) {
          result.protection = PROTECTION_BY_THIRD_DIGIT[thirdDigit];
        } else {
          result.warnings.push(`无法识别的防护等级代码: ${thirdDigit}`);
        }
      }

      // 解析电流规格
      const currentCode = this.extractCurrentCode(suffix);
      if (currentCode in CURRENT_BY_CODE) {
        result.current = CURRENT_BY_CODE[currentCode];
      } else {
        result.errors.push(`无效的电流代码: ${currentCode}`);
      }

      // 解析极数配置
      const polesCode = this.extractPolesCode(suffix);
      if (polesCode in POLES_BY_CODE) {
        result.poles = POLES_BY_CODE[polesCode];
      } else {
        result.warnings.push(`无法识别的极数代码: ${polesCode}`);
      }

      // 解析产品系列
      const seriesPrefix = prefix.startsWith('899') ? prefix.substring(0, 6) : prefix;
      if (seriesPrefix in SERIES_BY_PREFIX) {
        result.series = SERIES_BY_PREFIX[seriesPrefix];
      } else {
        // 尝试推断系列
        const inferredSeries = this.inferSeries(prefix, suffix);
        if (inferredSeries) {
          result.series = inferredSeries;
          result.warnings.push(`系列为推断结果: ${inferredSeries}`);
        } else {
          result.warnings.push(`无法识别的产品系列前缀: ${prefix}`);
        }
      }

      // 解析变体标识
      const variant = this.extractVariant(suffix);
      if (variant) {
        result.variant = variant;
      }

      // 如果没有错误，标记为有效
      if (result.errors.length === 0) {
        result.isValid = true;
      }

    } catch (error) {
      result.errors.push(`解析过程中发生错误: ${error}`);
    }

    return result;
  }

  /**
   * 验证订货号格式
   */
  validateFormat(partNumber: string): boolean {
    // 标准产品格式: XXX.XXXXX
    const standardPattern = /^\d{3}\.\d{4,6}$/;

    // 大电流产品格式: 899.XXXXXXX
    const highCurrentPattern = /^899\.[A-Z]{2}\d{1}[A-Z]{2}\d{3}$/;

    // 包含变体标识的格式: XXX.XXXXXT
    const variantPattern = /^\d{3}\.\d{4,5}[A-Z]$/;

    return standardPattern.test(partNumber) ||
           highCurrentPattern.test(partNumber) ||
           variantPattern.test(partNumber);
  }

  /**
   * 提取电流代码
   */
  private extractCurrentCode(suffix: string): string {
    // 先尝试提取2位数字
    const twoDigitMatch = suffix.match(/^(\d{2})/);
    if (twoDigitMatch) {
      const twoDigits = twoDigitMatch[1];
      if (twoDigits in CURRENT_BY_CODE) {
        return twoDigits;
      }
    }

    // 如果2位数字不在映射中，尝试3位数字
    const threeDigitMatch = suffix.match(/^(\d{3})/);
    if (threeDigitMatch) {
      const threeDigits = threeDigitMatch[1];
      if (threeDigits in CURRENT_BY_CODE) {
        return threeDigits;
      }
    }

    // 都没有找到，返回空字符串
    return '';
  }

  /**
   * 提取极数代码
   */
  private extractPolesCode(suffix: string): string {
    // 极数代码通常是电流代码后的2位数字
    const currentCode = this.extractCurrentCode(suffix);
    if (currentCode && suffix.length > currentCode.length + 1) {
      const startIndex = currentCode.length;
      const polesCode = suffix.substring(startIndex, startIndex + 2);
      return polesCode;
    }
    return '';
  }

  /**
   * 推断产品系列
   */
  private inferSeries(prefix: string, suffix: string): string {
    const firstDigit = prefix[0];
    const thirdDigit = prefix[2];

    // 根据首位数字和防护等级推断
    if (firstDigit === '2' || firstDigit === '3' || firstDigit === '4') {
      if (thirdDigit === '3') {
        return 'OPTIMA';
      } else if (thirdDigit === '8') {
        return 'OPTIMA';
      }
    } else if (firstDigit === '5') {
      if (thirdDigit === '3') {
        return 'OPTIMA-TOP';
      } else if (thirdDigit === '8') {
        return 'SAFE-IN';
      }
    }

    return '';
  }

  /**
   * 提取变体标识
   */
  private extractVariant(suffix: string): string {
    // 变体标识通常是最后一个字符（如果是字母）
    const lastChar = suffix.slice(-1);
    if (lastChar.match(/[A-Z]/)) {
      return lastChar;
    }
    return '';
  }

  /**
   * 生成替换建议（黄金替换法则）
   */
  generateReplacements(partNumber: string): ReplacementSuggestion[] {
    const suggestions: ReplacementSuggestion[] = [];
    const parsed = this.parse(partNumber);

    if (!parsed.isValid) {
      return suggestions;
    }

    const firstDigit = parsed.prefix[0];
    const thirdDigit = parsed.prefix[2];

    // 只对2-5开头的产品生成替换建议
    if (!['2', '3', '4', '5'].includes(firstDigit)) {
      return suggestions;
    }

    // 获取目标前缀列表
    const targetFirstDigits = REPLACEMENT_RULES[firstDigit] || [];

    for (const targetFirstDigit of targetFirstDigits) {
      // 构建目标前缀
      const targetPrefix = targetFirstDigit + parsed.prefix[1] + thirdDigit;
      const targetPartNumber = `${targetPrefix}.${parsed.suffix}`;

      // 验证替换是否有效
      const targetParsed = this.parse(targetPartNumber);
      if (targetParsed.isValid) {
        const relationship = this.getRelationshipDescription(firstDigit, targetFirstDigit);

        suggestions.push({
          original: partNumber,
          replacement: targetPartNumber,
          relationship,
          confidence: this.calculateReplacementConfidence(parsed, targetParsed),
          differences: this.getReplacementDifferences(parsed, targetParsed)
        });
      }
    }

    return suggestions;
  }

  /**
   * 获取关系描述
   */
  private getRelationshipDescription(sourceDigit: string, targetDigit: string): string {
    const relationships: Record<string, Record<string, string>> = {
      '2': {
        '3': '插头 → 移动连接器',
        '4': '插头 → 暗装插座',
        '5': '插头 → 明装插座'
      },
      '3': {
        '2': '移动连接器 → 插头',
        '4': '移动连接器 → 暗装插座',
        '5': '移动连接器 → 明装插座'
      },
      '4': {
        '2': '暗装插座 → 插头',
        '3': '暗装插座 → 移动连接器',
        '5': '暗装插座 → 明装插座'
      },
      '5': {
        '2': '明装插座 → 插头',
        '3': '明装插座 → 移动连接器',
        '4': '明装插座 → 暗装插座'
      }
    };

    return relationships[sourceDigit]?.[targetDigit] || '未知关系';
  }

  /**
   * 计算替换置信度
   */
  private calculateReplacementConfidence(
    source: ParsedPartNumber,
    target: ParsedPartNumber
  ): number {
    let confidence = 0.8; // 基础置信度

    // 相同技术参数增加置信度
    if (source.current === target.current) confidence += 0.1;
    if (source.poles === target.poles) confidence += 0.05;
    if (source.protection === target.protection) confidence += 0.05;

    // 限制在0-1之间
    return Math.min(Math.max(confidence, 0), 1);
  }

  /**
   * 获取替换差异
   */
  private getReplacementDifferences(
    source: ParsedPartNumber,
    target: ParsedPartNumber
  ): string[] {
    const differences: string[] = [];

    if (source.category !== target.category) {
      differences.push(`产品类别: ${source.category} → ${target.category}`);
    }

    if (source.series !== target.series) {
      differences.push(`产品系列: ${source.series} → ${target.series}`);
    }

    // 技术参数相同，不列为差异

    return differences;
  }

  /**
   * 根据技术参数生成可能的订货号
   */
  generatePartNumberByParams(params: {
    category: ProductCategory;
    current: CurrentRating;
    poles: PolesConfiguration;
    protection: ProtectionRating;
    series?: ProductSeries;
  }): string[] {
    const suggestions: string[] = [];

    // 构建前缀
    let prefix = '';
    let thirdDigit = '';

    // 根据防护等级确定第三位数字
    if (params.protection === ProtectionRating.IP44_IP54) {
      thirdDigit = '3';
    } else if (params.protection === ProtectionRating.IP66_IP67_IP69) {
      thirdDigit = '8';
    }

    // 根据产品类别确定首位数字
    if (params.category === ProductCategory.INPUT_PLUG) {
      prefix = '2' + (params.series === ProductSeries.EUREKA_HD ? '2' : '1') + thirdDigit;
    } else if (params.category === ProductCategory.SURFACE_MOUNT) {
      prefix = '5' + (params.protection === ProtectionRating.IP66_IP67_IP69 ? '1' : '1') + thirdDigit;
    } else if (params.category === ProductCategory.RECESSED_SOCKET) {
      prefix = '4' + '1' + thirdDigit;
    } else if (params.category === ProductCategory.MOBILE_CONNECTOR) {
      prefix = '3' + '1' + thirdDigit;
    }

    // 构建电流代码
    const currentCode = Object.entries(CURRENT_BY_CODE).find(
      ([, value]) => value === params.current
    )?.[0] || '16';

    // 构建极数代码
    const polesCode = Object.entries(POLES_BY_CODE).find(
      ([, value]) => value === params.poles
    )?.[0] || '32';

    // 构建后缀
    const suffix = currentCode + polesCode + '0'; // 最后一位为占位符

    if (prefix && suffix) {
      suggestions.push(`${prefix}.${suffix}`);
    }

    return suggestions;
  }

  /**
   * 批量解析订货号
   */
  parseBatch(partNumbers: string[]): ParsedPartNumber[] {
    return partNumbers.map(partNumber => this.parse(partNumber));
  }

  /**
   * 获取解析统计信息
   */
  getParseStats(parsedResults: ParsedPartNumber[]): {
    total: number;
    valid: number;
    invalid: number;
    categories: Record<string, number>;
    commonErrors: string[];
  } {
    const stats = {
      total: parsedResults.length,
      valid: 0,
      invalid: 0,
      categories: {} as Record<string, number>,
      commonErrors: [] as string[]
    };

    const errorCounts: Record<string, number> = {};

    for (const result of parsedResults) {
      if (result.isValid) {
        stats.valid++;

        // 统计类别
        const category = result.category.toString();
        stats.categories[category] = (stats.categories[category] || 0) + 1;
      } else {
        stats.invalid++;

        // 统计常见错误
        for (const error of result.errors) {
          errorCounts[error] = (errorCounts[error] || 0) + 1;
        }
      }
    }

    // 获取最常见的错误
    stats.commonErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([error]) => error);

    return stats;
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建解析器单例
 */
let parserInstance: ScameCodingParser | null = null;

export function getParser(): ScameCodingParser {
  if (!parserInstance) {
    parserInstance = new ScameCodingParser();
  }
  return parserInstance;
}

/**
 * 快速解析函数（便捷接口）
 */
export function parsePartNumber(partNumber: string): ParsedPartNumber {
  return getParser().parse(partNumber);
}

/**
 * 快速生成替换建议
 */
export function getReplacements(partNumber: string): ReplacementSuggestion[] {
  return getParser().generateReplacements(partNumber);
}

/**
 * 验证订货号是否有效
 */
export function isValidPartNumber(partNumber: string): boolean {
  return getParser().parse(partNumber).isValid;
}

/**
 * 获取产品类别
 */
export function getProductCategory(partNumber: string): ProductCategory | null {
  const parsed = getParser().parse(partNumber);
  return parsed.isValid ? parsed.category : null;
}

/**
 * 获取技术参数摘要
 */
export function getTechnicalSummary(partNumber: string): string {
  const parsed = getParser().parse(partNumber);
  if (!parsed.isValid) {
    return '无效的订货号';
  }

  return `${parsed.current} ${parsed.poles} ${parsed.protection} ${parsed.series}`;
}

// ============================================================================
// 测试用例（只在Node.js测试环境中运行）
// ============================================================================

// 测试代码已移动到专门的测试文件中
// 请运行: npm test 执行单元测试