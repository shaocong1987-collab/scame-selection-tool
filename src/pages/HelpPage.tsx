import React from 'react';
import { HelpCircle, BookOpen, Video, Mail, MessageSquare, FileQuestion } from 'lucide-react';

const HelpPage: React.FC = () => {
  const faqs = [
    {
      question: '如何开始使用选型工具？',
      answer: '可以从"快速选型"开始，选择应用场景，或使用"正向选型"输入具体技术参数。',
      category: '入门'
    },
    {
      question: '订货号格式有什么要求？',
      answer: '标准格式为XXX.XXXXX（如213.3237），大电流产品为899.XXXXXXX（如899.AL2DE335）。',
      category: '技术'
    },
    {
      question: '选型结果不准确怎么办？',
      answer: '请检查输入的技术参数，或使用"知识库"检索相关技术文档确认要求。',
      category: '问题排查'
    },
    {
      question: '如何获取产品价格和库存？',
      answer: '需要相应的权限，查看产品详情页面或联系销售代表获取最新信息。',
      category: '商务'
    },
    {
      question: '可以导出选型方案吗？',
      answer: '是的，生成选型方案后可以导出为PDF或Excel格式。',
      category: '功能'
    },
    {
      question: '遇到技术问题如何联系支持？',
      answer: '可通过页面右下角的帮助按钮，或发送邮件至support@scame-selector.com。',
      category: '支持'
    }
  ];

  const helpResources = [
    {
      title: '用户手册',
      description: '完整的使用指南和功能介绍',
      icon: BookOpen,
      link: '#',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: '视频教程',
      description: '操作演示和最佳实践',
      icon: Video,
      link: '#',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: '在线咨询',
      description: '实时技术支持',
      icon: MessageSquare,
      link: '#',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: '技术文档',
      description: 'SCAME官方技术资料',
      icon: FileQuestion,
      link: '#',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">帮助中心</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          获取使用指导、技术支持和常见问题解答
        </p>
      </div>

      {/* 快速帮助 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {helpResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div key={resource.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <div className={`inline-flex p-3 rounded-lg ${resource.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              <button className="w-full py-2 text-center text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                查看
              </button>
            </div>
          );
        })}
      </div>

      {/* 常见问题 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">常见问题 (FAQ)</h2>
          <p className="text-gray-600 text-sm mt-1">
            查看其他用户经常遇到的问题
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {faq.category}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系支持 */}
      <div className="bg-gradient-to-r from-scame-blue to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold mb-4">需要更多帮助？</h2>
          <p className="opacity-90 mb-6">
            我们的技术支持团队随时准备为您服务。提供详细的问题描述和相关信息，我们将尽快回复。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-scame-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              发送邮件
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              在线聊天
            </button>
          </div>
          <div className="mt-6 text-sm opacity-80">
            技术支持邮箱: support@scame-selector.com | 服务时间: 工作日 9:00-18:00
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">使用提示</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-2">准确输入</div>
            <p className="text-sm text-gray-600">
              输入正确的技术参数，特别是电流和电压，确保选型准确
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-2">利用知识库</div>
            <p className="text-sm text-gray-600">
              不确定技术参数时，先查询知识库获取官方技术信息
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-2">验证结果</div>
            <p className="text-sm text-gray-600">
              重要项目选型结果建议由SCAME专家最终确认
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;