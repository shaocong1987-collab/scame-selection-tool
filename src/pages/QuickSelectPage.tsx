import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Search, CheckCircle, Building, Factory, Ship, Train } from 'lucide-react';

const QuickSelectPage: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<string>('');

  const applications = [
    {
      id: 'data-center',
      title: '数据中心',
      description: '服务器机柜供电，UPS系统，需要高可靠性和冗余设计',
      icon: Building,
      color: 'bg-blue-100 text-blue-600',
      recommendations: [
        { current: '32A', poles: '3P+N+E', protection: 'IP44', voltage: '200-250V', series: 'OPTIMA' },
        { current: '63A', poles: '3P+N+E', protection: 'IP44', voltage: '200-250V', series: 'OPTIMA-TOP' }
      ]
    },
    {
      id: 'industrial',
      title: '工业制造',
      description: '生产线设备，机器人，需要机械连锁和防误操作',
      icon: Factory,
      color: 'bg-green-100 text-green-600',
      recommendations: [
        { current: '16A', poles: '2P+E', protection: 'IP44', voltage: '200-250V', series: 'ADVANCE2' },
        { current: '32A', poles: '3P+E', protection: 'IP54', voltage: '380-415V', series: 'OPTIMA' }
      ]
    },
    {
      id: 'port',
      title: '港口码头',
      description: '户外起重机，集装箱设备，需要防水防腐蚀',
      icon: Ship,
      color: 'bg-purple-100 text-purple-600',
      recommendations: [
        { current: '63A', poles: '3P+N+E', protection: 'IP66/67', voltage: '380-415V', series: 'OPTIMA-TOP' },
        { current: '125A', poles: '3P+N+E', protection: 'IP66/67', voltage: '380-415V', series: 'EUREKA-HD' }
      ]
    },
    {
      id: 'railway',
      title: '轨道交通',
      description: '地铁，高铁站设备，需要抗震和UL认证',
      icon: Train,
      color: 'bg-orange-100 text-orange-600',
      recommendations: [
        { current: '32A', poles: '3P+N+E', protection: 'IP44', voltage: '200-250V', series: 'EUREKA-HD' },
        { current: '63A', poles: '3P+N+E', protection: 'IP66', voltage: '380-415V', series: 'XENIA' }
      ]
    }
  ];

  const selectedApp = applications.find(app => app.id === selectedApplication);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">快速选型</h1>
          <p className="text-gray-600 mt-2">
            根据常见应用场景快速选择合适的产品配置
          </p>
        </div>
        <Link
          to="/forward-selection"
          className="flex items-center text-scame-blue hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          切换到详细选型
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {applications.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApplication(app.id)}
              className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all text-left ${
                selectedApplication === app.id
                  ? 'border-scame-blue shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`p-3 rounded-lg ${app.color} inline-block mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {app.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {app.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedApp && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${selectedApp.color} mr-4`}>
                  <selectedApp.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedApp.title}</h2>
                  <p className="text-gray-600">{selectedApp.description}</p>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Zap className="h-4 w-4 mr-2" />
                生成选型方案
              </button>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐配置</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedApp.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-gray-900">方案 {index + 1}</span>
                    </div>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {rec.series}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">电流</div>
                      <div className="text-lg font-semibold text-gray-900">{rec.current}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">极数配置</div>
                      <div className="text-lg font-semibold text-gray-900">{rec.poles}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">防护等级</div>
                      <div className="text-lg font-semibold text-gray-900">{rec.protection}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">电压范围</div>
                      <div className="text-lg font-semibold text-gray-900">{rec.voltage}</div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 text-center text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                    查看匹配产品
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">选型说明</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 bg-scame-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    基于SCAME官方技术手册和实际应用案例
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 bg-scame-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    考虑环境因素、使用频率和安全要求
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 bg-scame-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    推荐产品均为现货或常规交货期
                  </li>
                  <li className="flex items-start">
                    <div className="h-1.5 w-1.5 bg-scame-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    如需定制配置，请使用详细选型功能
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedApplication && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">请选择应用场景</h3>
          <p className="text-gray-600">
            选择一个应用场景，系统将根据典型需求推荐合适的产品配置
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickSelectPage;