/**
 * SCAME 产品匹配与兼容性验证模块
 *
 * 基于SCAME编码规则和IEC 60309标准，实现产品兼容性验证和匹配推荐。
 * 严格遵循SCAME技术规范，严禁技术参数幻觉。
 */

import {
  ProductCategory,
  ProtectionRating,
  CurrentRating,
  PolesConfiguration,
  ParsedPartNumber,
  ScameCodingParser,
  getParser
} from './coding';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 匹配验证结果
 */
export interface MatchValidationResult {
  /** 是否匹配成功 */
  valid: boolean;

  /** 匹配关系描述 */
  relationship: string;

  /** 匹配度分数 (0-1) */
  score: number;

  /** 错误信息 */
  errors: string[];

  /** 警告信息 */
  warnings: string[];

  /** 技术参数差异 */
  differences: Array<{
    parameter: string;
    source: string;
    target: string;
    severity: 'error' | 'warning' | 'info';
  }>;
}

/**
 * 配套套装接口
 */
export interface MatchingSet {
  /** 插头产品 */
  plug?: string;

  /** 插座产品 */
  socket?: string;

  /** 连接器产品 */
  connector?: string;

  /** 其他配件 */
  accessories: string[];

  /** 套装验证结果 */
  validation: MatchValidationResult;

  /** 套装描述 */
  description: string;

  /** 应用场景 */
  application: string[];
}

/**
 * 兼容性检查配置
 */
export interface CompatibilityConfig {
  /** 是否要求相同电流 */
  requireSameCurrent: boolean;

  /** 是否要求相同电压 */
  requireSameVoltage: boolean;

  /** 是否要求相同防护等级 */
  requireSameProtection: boolean;

  /** 是否允许升级防护等级 (IP44 → IP66) */
  allowUpgradeProtection: boolean;

  /** 是否允许降级防护等级 (IP66 → IP44) */
  allowDowngradeProtection: boolean;

  /** 是否验证IEC 60309标准 */
  verifyIEC60309: boolean;
}

/**
 * IEC 60309 标准配置
 */
export interface IEC60309Config {
  /** 时钟位置 */
  clockPosition: string;

  /** 颜色编码 */
  colorCode: string;

  /** 电压频率组合 */
  voltageFrequency: string;

  /** 接地配置 */
  earthConfiguration: string;
}

// ============================================================================
// 常量定义
// ============================================================================

/**
 * 默认兼容性配置
 */
export const DEFAULT_COMPATIBILITY_CONFIG: CompatibilityConfig = {
  requireSameCurrent: true,
  requireSameVoltage: true,
  requireSameProtection: false, // 防护等级可以向上兼容
  allowUpgradeProtection: true, // 允许IP44 → IP66
  allowDowngradeProtection: false, // 不允许IP66 → IP44
  verifyIEC60309: true
};

/**
 * IEC 60309 标准映射
 * 基于电压、频率、电流的时钟位置和颜色编码
 */
const IEC_60309_MAPPINGS: Record<string, IEC60309Config> = {
  // 50-250V 50/60Hz
  '50-250V_50/60Hz': {
    clockPosition: '6h',
    colorCode: 'Blue',
    voltageFrequency: '200-250V 50/60Hz',
    earthConfiguration: '2P+E, 3P+E'
  },

  // 380-415V 50Hz
  '380-415V_50Hz': {
    clockPosition: '4h',
    colorCode: 'Red',
    voltageFrequency: '346-415V 50Hz',
    earthConfiguration: '3P+E, 3P+N+E'
  },

  // 440-460V 60Hz
  '440-460V_60Hz': {
    clockPosition: '4h',
    colorCode: 'Red',
    voltageFrequency: '440-460V 60Hz',
    earthConfiguration: '3P+E, 3P+N+E'
  },

  // 480-500V 60Hz
  '480-500V_60Hz': {
    clockPosition: '4h',
    colorCode: 'Red',
    voltageFrequency: '480-500V 60Hz',
    earthConfiguration: '3P+E, 3P+N+E'
  },

  // 600-690V 50/60Hz
  '600-690V_50/60Hz': {
    clockPosition: '5h',
    colorCode: 'Black',
    voltageFrequency: '600-690V 50/60Hz',
    earthConfiguration: '3P+E, 3P+N+E'
  }
};

/**
 * 产品类别兼容性矩阵
 * 哪些产品类别可以互相匹配
 */
const CATEGORY_COMPATIBILITY_MATRIX: Record<ProductCategory, ProductCategory[]> = {
  [ProductCategory.CIVILIAN]: [ProductCategory.CIVILIAN],
  [ProductCategory.INPUT_PLUG]: [
    ProductCategory.MOBILE_CONNECTOR,
    ProductCategory.RECESSED_SOCKET,
    ProductCategory.SURFACE_MOUNT
  ],
  [ProductCategory.MOBILE_CONNECTOR]: [
    ProductCategory.INPUT_PLUG,
    ProductCategory.RECESSED_SOCKET,
    ProductCategory.SURFACE_MOUNT
  ],
  [ProductCategory.RECESSED_SOCKET]: [
    ProductCategory.INPUT_PLUG,
    ProductCategory.MOBILE_CONNECTOR,
    ProductCategory.SURFACE_MOUNT
  ],
  [ProductCategory.SURFACE_MOUNT]: [
    ProductCategory.INPUT_PLUG,
    ProductCategory.MOBILE_CONNECTOR,
    ProductCategory.RECESSED_SOCKET
  ],
  [ProductCategory.ENCLOSURE]: [ProductCategory.ENCLOSURE],
  [ProductCategory.CABLE_REEL]: [ProductCategory.CABLE_REEL],
  [ProductCategory.ACCESSORY]: [ProductCategory.ACCESSORY],
  [ProductCategory.HIGH_CURRENT]: [ProductCategory.HIGH_CURRENT]
};

/**
 * 电流兼容性规则
 * 哪些电流值可以互相兼容（如：16A插头可以连接16A插座）
 */
const CURRENT_COMPATIBILITY: Record<CurrentRating, CurrentRating[]> = {
  [CurrentRating.A16]: [CurrentRating.A16],
  [CurrentRating.A20]: [CurrentRating.A20],
  [CurrentRating.A30]: [CurrentRating.A30],
  [CurrentRating.A32]: [CurrentRating.A32],
  [CurrentRating.A60]: [CurrentRating.A60],
  [CurrentRating.A63]: [CurrentRating.A63],
  [CurrentRating.A100]: [CurrentRating.A100],
  [CurrentRating.A125]: [CurrentRating.A125],
  [CurrentRating.A160]: [CurrentRating.A160],
  [CurrentRating.A250]: [CurrentRating.A250],
  [CurrentRating.A320]: [CurrentRating.A320],
  [CurrentRating.A370]: [CurrentRating.A370],
  [CurrentRating.A420]: [CurrentRating.A420],
  [CurrentRating.A500]: [CurrentRating.A500],
  [CurrentRating.A570]: [CurrentRating.A570],
  [CurrentRating.A800]: [CurrentRating.A800]
};

/**
 * 防护等级兼容性规则
 * IP44可以升级到IP66，但IP66不能降级到IP44
 */
const PROTECTION_COMPATIBILITY: Record<ProtectionRating, ProtectionRating[]> = {
  [ProtectionRating.IP44]: [ProtectionRating.IP44, ProtectionRating.IP54, ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP44_IP54, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP54]: [ProtectionRating.IP54, ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP66]: [ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP67]: [ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP69]: [ProtectionRating.IP69, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP44_IP54]: [ProtectionRating.IP44, ProtectionRating.IP54, ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP44_IP54, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP66_IP67]: [ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69],
  [ProtectionRating.IP66_IP67_IP69]: [ProtectionRating.IP66, ProtectionRating.IP67, ProtectionRating.IP69, ProtectionRating.IP66_IP67, ProtectionRating.IP66_IP67_IP69]
};

// ============================================================================
// 核心匹配器类
// ============================================================================

/**
 * SCAME产品匹配器
 */
export class ScameProductMatcher {
  private parser: ScameCodingParser;

  constructor() {
    this.parser = getParser();
  }

  /**
   * 验证两个产品是否兼容
   */
  async validateCompatibility(
    productA: string,
    productB: string,
    config: Partial<CompatibilityConfig> = {}
  ): Promise<MatchValidationResult> {
    const mergedConfig = { ...DEFAULT_COMPATIBILITY_CONFIG, ...config };

    const parsedA = this.parser.parse(productA);
    const parsedB = this.parser.parse(productB);

    const result: MatchValidationResult = {
      valid: false,
      relationship: '',
      score: 0,
      errors: [],
      warnings: [],
      differences: []
    };

    // 检查基本有效性
    if (!parsedA.isValid) {
      result.errors.push(`产品A无效: ${parsedA.errors.join(', ')}`);
    }

    if (!parsedB.isValid) {
      result.errors.push(`产品B无效: ${parsedB.errors.join(', ')}`);
    }

    if (result.errors.length > 0) {
      return result;
    }

    // 确定匹配关系
    result.relationship = this.determineRelationship(parsedA, parsedB);

    // 验证技术参数兼容性
    this.validateTechnicalCompatibility(parsedA, parsedB, mergedConfig, result);

    // 验证IEC 60309标准
    if (mergedConfig.verifyIEC60309) {
      this.validateIEC60309(parsedA, parsedB, result);
    }

    // 计算匹配度分数
    result.score = this.calculateMatchScore(parsedA, parsedB, result.differences);

    // 如果没有错误，标记为有效
    result.valid = result.errors.length === 0;

    return result;
  }

  /**
   * 验证插头-插座-连接器套装
   */
  async validateMatchingSet(set: {
    plug?: string;
    socket?: string;
    connector?: string;
  }): Promise<MatchingSet> {
    const validationResults: MatchValidationResult[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证插头-插座配对
    if (set.plug && set.socket) {
      const validation = await this.validateCompatibility(set.plug, set.socket);
      validationResults.push(validation);

      if (!validation.valid) {
        errors.push(`插头-插座不兼容: ${validation.errors.join(', ')}`);
      }

      warnings.push(...validation.warnings);
    }

    // 验证插头-连接器配对
    if (set.plug && set.connector) {
      const validation = await this.validateCompatibility(set.plug, set.connector);
      validationResults.push(validation);

      if (!validation.valid) {
        errors.push(`插头-连接器不兼容: ${validation.errors.join(', ')}`);
      }

      warnings.push(...validation.warnings);
    }

    // 验证插座-连接器配对
    if (set.socket && set.connector) {
      const validation = await this.validateCompatibility(set.socket, set.connector);
      validationResults.push(validation);

      if (!validation.valid) {
        errors.push(`插座-连接器不兼容: ${validation.errors.join(', ')}`);
      }

      warnings.push(...validation.warnings);
    }

    // 计算总体匹配度
    const overallScore = validationResults.length > 0
      ? validationResults.reduce((sum, r) => sum + r.score, 0) / validationResults.length
      : 0;

    const overallValid = errors.length === 0;

    const overallValidation: MatchValidationResult = {
      valid: overallValid,
      relationship: '完整配套套装',
      score: overallScore,
      errors,
      warnings: [...new Set(warnings)], // 去重
      differences: validationResults.flatMap(r => r.differences)
    };

    // 生成套装描述
    const description = this.generateSetDescription(set);

    // 确定应用场景
    const application = this.determineApplication(set);

    return {
      ...set,
      accessories: this.suggestAccessories(set),
      validation: overallValidation,
      description,
      application
    };
  }

  /**
   * 根据技术参数查找匹配产品
   */
  async findMatchingProducts(
    baseProduct: string,
    targetCategory?: ProductCategory
  ): Promise<Array<{ partNumber: string; validation: MatchValidationResult }>> {
    const parsedBase = this.parser.parse(baseProduct);

    if (!parsedBase.isValid) {
      throw new Error(`基础产品无效: ${parsedBase.errors.join(', ')}`);
    }

    // 获取可能的替换产品（黄金替换法则）
    const replacements = this.parser.generateReplacements(baseProduct);

    const results: Array<{ partNumber: string; validation: MatchValidationResult }> = [];

    for (const replacement of replacements) {
      // 如果指定了目标类别，则过滤
      if (targetCategory) {
        const parsedTarget = this.parser.parse(replacement.replacement);
        if (parsedTarget.category !== targetCategory) {
          continue;
        }
      }

      const validation = await this.validateCompatibility(
        baseProduct,
        replacement.replacement
      );

      results.push({
        partNumber: replacement.replacement,
        validation
      });
    }

    // 按匹配度排序
    return results.sort((a, b) => b.validation.score - a.validation.score);
  }

  /**
   * 根据参数生成完整套装建议
   */
  async generateCompleteSet(params: {
    current: CurrentRating;
    poles: PolesConfiguration;
    protection: ProtectionRating;
    voltage?: string;
    application?: string;
  }): Promise<MatchingSet[]> {
    // 生成可能的插头、插座、连接器组合
    const suggestions: MatchingSet[] = [];

    // 根据应用场景选择产品系列
    const series = this.selectSeriesByApplication(params.application);

    // 生成插头
    const plugCandidates = this.generateProductCandidates({
      category: ProductCategory.INPUT_PLUG,
      ...params,
      series
    });

    // 生成插座
    const socketCandidates = this.generateProductCandidates({
      category: ProductCategory.RECESSED_SOCKET,
      ...params,
      series
    });

    // 生成连接器
    const connectorCandidates = this.generateProductCandidates({
      category: ProductCategory.MOBILE_CONNECTOR,
      ...params,
      series
    });

    // 尝试所有组合
    for (const plug of plugCandidates) {
      for (const socket of socketCandidates) {
        for (const connector of connectorCandidates) {
          const set = { plug, socket, connector };
          const matchingSet = await this.validateMatchingSet(set);

          if (matchingSet.validation.valid) {
            suggestions.push(matchingSet);
          }

          // 限制返回数量
          if (suggestions.length >= 10) {
            return suggestions;
          }
        }
      }
    }

    return suggestions;
  }

  // ==========================================================================
  // 私有方法
  // ==========================================================================

  /**
   * 确定产品关系
   */
  private determineRelationship(
    productA: ParsedPartNumber,
    productB: ParsedPartNumber
  ): string {
    const catA = productA.category;
    const catB = productB.category;

    if (catA === catB) {
      return '同类型产品';
    }

    const relationships: Record<string, Record<string, string>> = {
      [ProductCategory.INPUT_PLUG]: {
        [ProductCategory.MOBILE_CONNECTOR]: '插头 → 连接器',
        [ProductCategory.RECESSED_SOCKET]: '插头 → 暗装插座',
        [ProductCategory.SURFACE_MOUNT]: '插头 → 明装插座'
      },
      [ProductCategory.MOBILE_CONNECTOR]: {
        [ProductCategory.INPUT_PLUG]: '连接器 → 插头',
        [ProductCategory.RECESSED_SOCKET]: '连接器 → 暗装插座',
        [ProductCategory.SURFACE_MOUNT]: '连接器 → 明装插座'
      },
      [ProductCategory.RECESSED_SOCKET]: {
        [ProductCategory.INPUT_PLUG]: '暗装插座 → 插头',
        [ProductCategory.MOBILE_CONNECTOR]: '暗装插座 → 连接器',
        [ProductCategory.SURFACE_MOUNT]: '暗装插座 → 明装插座'
      },
      [ProductCategory.SURFACE_MOUNT]: {
        [ProductCategory.INPUT_PLUG]: '明装插座 → 插头',
        [ProductCategory.MOBILE_CONNECTOR]: '明装插座 → 连接器',
        [ProductCategory.RECESSED_SOCKET]: '明装插座 → 暗装插座'
      }
    };

    return relationships[catA]?.[catB] || '不同类型产品';
  }

  /**
   * 验证技术参数兼容性
   */
  private validateTechnicalCompatibility(
    productA: ParsedPartNumber,
    productB: ParsedPartNumber,
    config: CompatibilityConfig,
    result: MatchValidationResult
  ): void {
    // 验证产品类别兼容性
    const compatibleCategories = CATEGORY_COMPATIBILITY_MATRIX[productA.category] || [];
    if (!compatibleCategories.includes(productB.category)) {
      result.errors.push(`产品类别不兼容: ${productA.category} 与 ${productB.category}`);
      result.differences.push({
        parameter: '产品类别',
        source: productA.category.toString(),
        target: productB.category.toString(),
        severity: 'error'
      });
    }

    // 验证电流兼容性
    if (config.requireSameCurrent) {
      const compatibleCurrents = CURRENT_COMPATIBILITY[productA.current] || [];
      if (!compatibleCurrents.includes(productB.current)) {
        result.errors.push(`电流不匹配: ${productA.current} 与 ${productB.current}`);
        result.differences.push({
          parameter: '电流',
          source: productA.current.toString(),
          target: productB.current.toString(),
          severity: 'error'
        });
      }
    } else {
      // 如果不要求相同电流，检查降级使用是否安全
      if (this.isCurrentDowngradeUnsafe(productA.current, productB.current)) {
        result.warnings.push(`电流降级使用可能不安全: ${productA.current} → ${productB.current}`);
        result.differences.push({
          parameter: '电流',
          source: productA.current.toString(),
          target: productB.current.toString(),
          severity: 'warning'
        });
      }
    }

    // 验证防护等级兼容性
    const compatibleProtections = PROTECTION_COMPATIBILITY[productA.protection] || [];

    if (compatibleProtections.includes(productB.protection)) {
      // 兼容
      if (productA.protection !== productB.protection) {
        const severity = this.isProtectionUpgrade(productA.protection, productB.protection)
          ? 'info'
          : 'warning';

        result.differences.push({
          parameter: '防护等级',
          source: productA.protection.toString(),
          target: productB.protection.toString(),
          severity
        });

        if (severity === 'warning') {
          result.warnings.push(`防护等级降级: ${productA.protection} → ${productB.protection}`);
        }
      }
    } else {
      // 不兼容
      if (config.allowUpgradeProtection && this.isProtectionUpgrade(productA.protection, productB.protection)) {
        result.warnings.push(`防护等级升级可能导致安装问题: ${productA.protection} → ${productB.protection}`);
        result.differences.push({
          parameter: '防护等级',
          source: productA.protection.toString(),
          target: productB.protection.toString(),
          severity: 'warning'
        });
      } else {
        result.errors.push(`防护等级不兼容: ${productA.protection} 与 ${productB.protection}`);
        result.differences.push({
          parameter: '防护等级',
          source: productA.protection.toString(),
          target: productB.protection.toString(),
          severity: 'error'
        });
      }
    }

    // 验证极数配置
    if (productA.poles !== productB.poles) {
      result.errors.push(`极数配置不匹配: ${productA.poles} 与 ${productB.poles}`);
      result.differences.push({
        parameter: '极数配置',
        source: productA.poles.toString(),
        target: productB.poles.toString(),
        severity: 'error'
      });
    }

    // 验证系列兼容性（可选）
    if (productA.series !== productB.series) {
      result.differences.push({
        parameter: '产品系列',
        source: productA.series.toString(),
        target: productB.series.toString(),
        severity: 'info'
      });
    }
  }

  /**
   * 验证IEC 60309标准
   */
  private validateIEC60309(
    productA: ParsedPartNumber,
    productB: ParsedPartNumber,
    result: MatchValidationResult
  ): void {
    // 这里实现IEC 60309标准验证逻辑
    // 检查时钟位置、颜色编码、接地配置等

    // 示例验证：确保两者都是IEC 60309标准产品
    const isIEC60309A = this.isIEC60309Product(productA);
    const isIEC60309B = this.isIEC60309Product(productB);

    if (isIEC60309A !== isIEC60309B) {
      result.warnings.push(`IEC 60309标准不一致: 产品A ${isIEC60309A ? '符合' : '不符合'}, 产品B ${isIEC60309B ? '符合' : '不符合'}`);
    }
  }

  /**
   * 计算匹配度分数
   */
  private calculateMatchScore(
    productA: ParsedPartNumber,
    productB: ParsedPartNumber,
    differences: MatchValidationResult['differences']
  ): number {
    let score = 1.0;

    // 根据差异扣分
    for (const diff of differences) {
      switch (diff.severity) {
        case 'error':
          score -= 0.3;
          break;
        case 'warning':
          score -= 0.1;
          break;
        case 'info':
          score -= 0.05;
          break;
      }
    }

    // 相同系列加分
    if (productA.series === productB.series) {
      score += 0.1;
    }

    // 相同防护等级加分
    if (productA.protection === productB.protection) {
      score += 0.05;
    }

    // 确保分数在0-1之间
    return Math.max(0, Math.min(1, score));
  }

  /**
   * 生成套装描述
   */
  private generateSetDescription(set: { plug?: string; socket?: string; connector?: string }): string {
    const parts: string[] = [];

    if (set.plug) parts.push(`插头: ${set.plug}`);
    if (set.socket) parts.push(`插座: ${set.socket}`);
    if (set.connector) parts.push(`连接器: ${set.connector}`);

    return `${parts.join(' + ')} 配套套装`;
  }

  /**
   * 确定应用场景
   */
  private determineApplication(set: { plug?: string; socket?: string; connector?: string }): string[] {
    const applications: string[] = [];

    // 根据产品类型推断应用场景
    if (set.plug || set.socket || set.connector) {
      applications.push('工业设备供电');
    }

    if (set.plug && set.connector) {
      applications.push('移动设备连接');
    }

    if (set.socket) {
      applications.push('固定安装');
    }

    return applications;
  }

  /**
   * 建议配件
   */
  private suggestAccessories(set: { plug?: string; socket?: string; connector?: string }): string[] {
    const accessories: string[] = [];

    // 根据产品类型建议配件
    if (set.plug || set.socket || set.connector) {
      accessories.push('805.016 (防水电缆接头)');
    }

    if (set.socket) {
      accessories.push('686.001 (安装盒)');
    }

    return accessories;
  }

  /**
   * 根据应用场景选择产品系列
   */
  private selectSeriesByApplication(application?: string): string {
    if (!application) return 'OPTIMA';

    const seriesByApp: Record<string, string> = {
      '数据中心': 'OPTIMA',
      '港口码头': 'OPTIMA-TOP',
      '轨道交通': 'EUREKA-HD',
      '工业制造': 'ADVANCE2',
      '户外恶劣环境': 'SAFE-IN',
      '高防护要求': 'XENIA'
    };

    return seriesByApp[application] || 'OPTIMA';
  }

  /**
   * 生成产品候选列表
   */
  private generateProductCandidates(params: {
    category: ProductCategory;
    current: CurrentRating;
    poles: PolesConfiguration;
    protection: ProtectionRating;
    series?: string;
    voltage?: string;
  }): string[] {
    // 这里应该实现根据参数生成具体订货号的逻辑
    // 暂时返回空数组，实际实现需要产品数据库
    return [];
  }

  /**
   * 判断是否为IEC 60309标准产品
   */
  private isIEC60309Product(product: ParsedPartNumber): boolean {
    // 根据产品系列和参数判断
    const iecSeries = ['OPTIMA', 'OPTIMA-TOP', 'EUREKA-HD', 'XENIA', 'ADVANCE2'];
    return iecSeries.includes(product.series.toString());
  }

  /**
   * 判断电流降级是否不安全
   */
  private isCurrentDowngradeUnsafe(source: CurrentRating, target: CurrentRating): boolean {
    // 将电流字符串转换为数字比较
    const sourceA = parseInt(source.toString().replace('A', ''));
    const targetA = parseInt(target.toString().replace('A', ''));

    return sourceA > targetA;
  }

  /**
   * 判断是否为防护等级升级
   */
  private isProtectionUpgrade(source: ProtectionRating, target: ProtectionRating): boolean {
    const protectionLevels: Record<ProtectionRating, number> = {
      [ProtectionRating.IP44]: 1,
      [ProtectionRating.IP54]: 2,
      [ProtectionRating.IP66]: 3,
      [ProtectionRating.IP67]: 4,
      [ProtectionRating.IP69]: 5,
      [ProtectionRating.IP44_IP54]: 1.5,
      [ProtectionRating.IP66_IP67]: 3.5,
      [ProtectionRating.IP66_IP67_IP69]: 4
    };

    return (protectionLevels[target] || 0) > (protectionLevels[source] || 0);
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建匹配器单例
 */
let matcherInstance: ScameProductMatcher | null = null;

export function getMatcher(): ScameProductMatcher {
  if (!matcherInstance) {
    matcherInstance = new ScameProductMatcher();
  }
  return matcherInstance;
}

/**
 * 快速验证两个产品是否兼容
 */
export async function validateCompatibility(
  productA: string,
  productB: string,
  config?: Partial<CompatibilityConfig>
): Promise<MatchValidationResult> {
  return getMatcher().validateCompatibility(productA, productB, config);
}

/**
 * 快速验证套装
 */
export async function validateMatchingSet(set: {
  plug?: string;
  socket?: string;
  connector?: string;
}): Promise<MatchingSet> {
  return getMatcher().validateMatchingSet(set);
}

/**
 * 查找匹配产品
 */
export async function findMatchingProducts(
  baseProduct: string,
  targetCategory?: ProductCategory
): Promise<Array<{ partNumber: string; validation: MatchValidationResult }>> {
  return getMatcher().findMatchingProducts(baseProduct, targetCategory);
}

/**
 * 生成完整套装建议
 */
export async function generateCompleteSet(params: {
  current: CurrentRating;
  poles: PolesConfiguration;
  protection: ProtectionRating;
  voltage?: string;
  application?: string;
}): Promise<MatchingSet[]> {
  return getMatcher().generateCompleteSet(params);
}

// ============================================================================
// 测试用例（只在Node.js测试环境中运行）
// ============================================================================

// 测试代码已移动到专门的测试文件中
// 请运行: npm test 执行单元测试