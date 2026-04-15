import React from 'react';
import { Settings, Bell, User, Shield, Database, Download, Upload } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600 mt-2">
          配置选型工具的各项参数和偏好设置
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要设置区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 账户设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">账户设置</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  用户名
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入用户名"
                  defaultValue="SCAME工程师"
                />
              </div>

              <div>
                <label className="label">
                  邮箱地址
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="请输入邮箱"
                  defaultValue="engineer@scame.com"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  更新账户信息
                </button>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">通知设置</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">产品更新通知</div>
                  <div className="text-sm text-gray-500">新产品发布或技术参数变更</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">兼容性提醒</div>
                  <div className="text-sm text-gray-500">产品替换时的兼容性警告</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">知识库同步通知</div>
                  <div className="text-sm text-gray-500">文档更新和知识库同步状态</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Database className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">数据管理</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">本地缓存</div>
                  <div className="text-sm text-gray-500">已使用 124MB / 500MB</div>
                </div>
                <button className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:border-red-400 transition-colors">
                  清空缓存
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    导出数据
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    导入数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 侧边栏：快捷设置 */}
        <div className="space-y-6">
          {/* 偏好设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">偏好设置</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  语言
                </label>
                <select className="input">
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>

              <div>
                <label className="label">
                  单位制
                </label>
                <select className="input">
                  <option>公制 (mm, A, V)</option>
                  <option>英制 (in, A, V)</option>
                </select>
              </div>

              <div>
                <label className="label">
                  主题
                </label>
                <select className="input">
                  <option>浅色主题</option>
                  <option>深色主题</option>
                  <option>自动</option>
                </select>
              </div>
            </div>
          </div>

          {/* 安全设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">安全设置</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  自动登出时间
                </label>
                <select className="input">
                  <option>30分钟</option>
                  <option>1小时</option>
                  <option>2小时</option>
                  <option>从不</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:border-red-400 transition-colors">
                  重置所有设置
                </button>
              </div>
            </div>
          </div>

          {/* 关于 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">关于选型工具</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <div className="font-medium">版本</div>
                <div>v1.0.0</div>
              </div>
              <div>
                <div className="font-medium">开发者</div>
                <div>北京韶聪泽明智能科技有限责任公司</div>
              </div>
              <div>
                <div className="font-medium">知识库版本</div>
                <div>2026-04-15</div>
              </div>
              <div className="pt-3">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  检查更新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;