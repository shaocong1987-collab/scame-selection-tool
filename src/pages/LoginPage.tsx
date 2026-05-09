import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  LogIn,
  Eye,
  EyeOff,
  Shield,
  HardDrive,
  Zap,
  Building,
  Smartphone,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'enterprise' | 'basic'>('enterprise');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟登录请求
    setTimeout(() => {
      console.log('登录提交:', { loginMethod, formData });
      setIsLoading(false);
      // 实际应用中这里会跳转到主页
    }, 1500);
  };

  const handleEnterpriseLogin = (provider: 'wechat' | 'dingtalk') => {
    setIsLoading(true);
    console.log(`企业${provider === 'wechat' ? '微信' : '钉钉'}登录`);

    // 模拟企业登录流程
    setTimeout(() => {
      setIsLoading(false);
      // 实际应用中这里会跳转到OAuth授权页面
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-industrial-gradient flex flex-col">
      {/* 工业顶部状态栏 */}
      <div className="w-full bg-industrial-dark py-3 px-6 border-b border-industrial-dark-steel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-industrial-accent-electric rounded-industrial flex items-center justify-center">
              <Zap className="h-5 w-5 text-industrial-light" />
            </div>
            <div>
              <h1 className="text-industrial-light font-display font-bold text-lg tracking-tight">
                SCAME 智能选型系统
              </h1>
              <p className="text-industrial-light-gray text-xs font-mono tracking-wide">
                工业电气专业选型平台 v2.1
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-industrial-status-active rounded-full animate-status-pulse"></div>
              <span className="text-industrial-light-gray text-xs font-mono">系统在线</span>
            </div>
            <div className="hidden md:block">
              <span className="text-industrial-accent-electric text-xs font-mono px-2 py-1 border border-industrial-accent-electric rounded">
                INDUSTRIAL MODE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 主登录区域 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">

          {/* 左侧 - 工业说明区域 */}
          <div className="bg-industrial-dark-gray rounded-industrial-lg p-8 border border-industrial-dark-steel shadow-industrial-lg">
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1.5 bg-industrial-accent-electric/10 border border-industrial-accent-electric rounded-industrial mb-4">
                <HardDrive className="h-4 w-4 text-industrial-accent-electric mr-2" />
                <span className="text-industrial-accent-electric text-sm font-mono">工业电气专业平台</span>
              </div>
              <h2 className="text-industrial-light font-display font-bold text-2xl mb-4">
                工业级智能选型解决方案
              </h2>
              <p className="text-industrial-light-gray leading-relaxed">
                SCAME官方授权的工业插头插座智能选型系统。为电气工程师、采购专员提供精准、高效的产品匹配服务。
              </p>
            </div>

            {/* 功能特点 */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-industrial-accent-safety mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-industrial-light font-medium mb-1">技术参数零幻觉</h3>
                  <p className="text-industrial-light-gray text-sm">基于SCAME官方技术手册，确保选型准确</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-industrial-accent-safety mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-industrial-light font-medium mb-1">RAG增强选型</h3>
                  <p className="text-industrial-light-gray text-sm">知识库检索，提供选型依据和合规建议</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-industrial-accent-safety mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-industrial-light font-medium mb-1">企业级安全</h3>
                  <p className="text-industrial-light-gray text-sm">工业数据加密传输，符合企业安全标准</p>
                </div>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-industrial-dark p-4 rounded-industrial border border-industrial-dark-steel">
                <div className="text-industrial-accent-electric text-2xl font-bold font-mono">15,000+</div>
                <div className="text-industrial-light-gray text-sm">产品型号</div>
              </div>
              <div className="bg-industrial-dark p-4 rounded-industrial border border-industrial-dark-steel">
                <div className="text-industrial-accent-electric text-2xl font-bold font-mono">2,300+</div>
                <div className="text-industrial-light-gray text-sm">企业用户</div>
              </div>
            </div>
          </div>

          {/* 右侧 - 登录表单区域 */}
          <div className="bg-industrial-dark-gray rounded-industrial-lg p-8 border border-industrial-dark-steel shadow-industrial-lg">
            <div className="mb-8">
              <h2 className="text-industrial-light font-display font-bold text-2xl mb-2">系统登录</h2>
              <p className="text-industrial-light-gray">选择登录方式访问智能选型平台</p>
            </div>

            {/* 登录方式切换 */}
            <div className="mb-8">
              <div className="flex border-b border-industrial-dark-steel">
                <button
                  onClick={() => setLoginMethod('enterprise')}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    loginMethod === 'enterprise'
                      ? 'text-industrial-accent-electric border-b-2 border-industrial-accent-electric'
                      : 'text-industrial-light-gray hover:text-industrial-light'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Building className="h-4 w-4 mr-2" />
                    企业协作工具
                  </div>
                </button>
                <button
                  onClick={() => setLoginMethod('basic')}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    loginMethod === 'basic'
                      ? 'text-industrial-accent-electric border-b-2 border-industrial-accent-electric'
                      : 'text-industrial-light-gray hover:text-industrial-light'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Key className="h-4 w-4 mr-2" />
                    账号密码登录
                  </div>
                </button>
              </div>
            </div>

            {/* 企业协作工具登录 */}
            {loginMethod === 'enterprise' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-industrial-accent-safety mr-2" />
                    <h3 className="text-industrial-light font-medium">推荐企业用户使用</h3>
                  </div>
                  <p className="text-industrial-light-gray text-sm mb-6">
                    使用企业协作工具登录，无需记忆额外账号，自动关联企业权限
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleEnterpriseLogin('wechat')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center p-4 bg-industrial-dark border border-industrial-dark-steel rounded-industrial hover:bg-industrial-dark-steel transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#07C160] rounded-lg flex items-center justify-center mr-4">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-industrial-light font-medium">企业微信登录</div>
                        <div className="text-industrial-light-gray text-sm">推荐：覆盖90%工业企业</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleEnterpriseLogin('dingtalk')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center p-4 bg-industrial-dark border border-industrial-dark-steel rounded-industrial hover:bg-industrial-dark-steel transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#0075FF] rounded-lg flex items-center justify-center mr-4">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-industrial-light font-medium">钉钉登录</div>
                        <div className="text-industrial-light-gray text-sm">阿里巴巴生态企业</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-industrial-dark-steel">
                  <div className="text-center">
                    <button
                      onClick={() => setLoginMethod('basic')}
                      className="text-industrial-accent-electric hover:text-industrial-blue-light text-sm font-medium transition-colors"
                    >
                      ← 切换至账号密码登录
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 账号密码登录 */}
            {loginMethod === 'basic' && (
              <div className="animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-industrial-light-gray text-sm font-medium mb-2">
                      邮箱 / 手机号
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-industrial-light-gray" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-industrial-dark border border-industrial-dark-steel rounded-industrial text-industrial-light placeholder-industrial-light-gray focus:outline-none focus:ring-2 focus:ring-industrial-accent-electric focus:border-transparent transition-colors"
                        placeholder="请输入邮箱或手机号"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-industrial-light-gray text-sm font-medium mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-industrial-light-gray" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-industrial-dark border border-industrial-dark-steel rounded-industrial text-industrial-light placeholder-industrial-light-gray focus:outline-none focus:ring-2 focus:ring-industrial-accent-electric focus:border-transparent transition-colors"
                        placeholder="请输入密码"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-industrial-light-gray hover:text-industrial-light transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="h-4 w-4 text-industrial-accent-electric bg-industrial-dark border-industrial-dark-steel rounded focus:ring-industrial-accent-electric focus:ring-offset-industrial-dark"
                      />
                      <span className="ml-2 text-industrial-light-gray text-sm">记住登录状态</span>
                    </label>
                    <button
                      type="button"
                      className="text-industrial-accent-electric hover:text-industrial-blue-light text-sm font-medium transition-colors"
                    >
                      忘记密码？
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 bg-industrial-accent-electric text-industrial-light font-medium rounded-industrial hover:bg-industrial-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-industrial-light border-t-transparent rounded-full animate-spin mr-2"></div>
                        登录中...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        登录系统
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-industrial-light-gray text-sm">
                      还没有账号？{' '}
                      <button
                        type="button"
                        className="text-industrial-accent-electric hover:text-industrial-blue-light font-medium transition-colors"
                      >
                        申请试用
                      </button>
                    </p>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-industrial-dark-steel">
                  <div className="text-center">
                    <button
                      onClick={() => setLoginMethod('enterprise')}
                      className="text-industrial-accent-electric hover:text-industrial-blue-light text-sm font-medium transition-colors"
                    >
                      ← 切换至企业协作工具登录
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 工业底部状态栏 */}
      <div className="w-full bg-industrial-dark py-4 px-6 border-t border-industrial-dark-steel">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="text-industrial-light-gray text-sm font-mono">
              © 2026 SCAME智能选型系统 • 北京韶聪泽明智能科技
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-industrial-light-gray hover:text-industrial-light text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-industrial-light-gray hover:text-industrial-light text-sm transition-colors">
                服务条款
              </a>
              <a href="#" className="text-industrial-light-gray hover:text-industrial-light text-sm transition-colors">
                技术支持
              </a>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-industrial-status-active rounded-full mr-2"></div>
                <span className="text-industrial-light-gray text-xs">SSL加密连接</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;