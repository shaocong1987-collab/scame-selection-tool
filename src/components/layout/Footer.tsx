import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-scame-blue font-bold text-sm">S</span>
              </div>
              <h3 className="text-xl font-bold">SCAME选型工具</h3>
            </div>
            <p className="text-gray-400 text-sm">
              北京韶聪泽明智能科技有限责任公司
              <br />
              专业的SCAME工业电气产品智能选型解决方案
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">产品系列</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/series/optima" className="hover:text-white transition-colors">
                  OPTIMA系列
                </Link>
              </li>
              <li>
                <Link to="/series/eureka-hd" className="hover:text-white transition-colors">
                  EUREKA-HD系列
                </Link>
              </li>
              <li>
                <Link to="/series/xenia" className="hover:text-white transition-colors">
                  XENIA系列
                </Link>
              </li>
              <li>
                <Link to="/series/advance2" className="hover:text-white transition-colors">
                  ADVANCE2系列
                </Link>
              </li>
              <li>
                <Link to="/series/safe-in" className="hover:text-white transition-colors">
                  SAFE-IN系列
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">技术支持</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/docs" className="hover:text-white transition-colors">
                  技术文档
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-white transition-colors">
                  使用教程
                </Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-white transition-colors">
                  API接口
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">特点</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-scame-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  基于SCAME官方技术规范，100%准确
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Zap className="h-5 w-5 text-scame-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  智能匹配算法，支持正向/反向选型
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Globe className="h-5 w-5 text-scame-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  多平台集成：Web、企微、飞书、钉钉
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2026 北京韶聪泽明智能科技有限责任公司. 保留所有权利.
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <a
                href="mailto:support@scame-selector.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-1" />
                support@scame-selector.com
              </a>
              <div className="text-gray-400 text-sm">
                版本: v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;