import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, CheckCircle, Factory, Search, Ship, Train, Zap } from 'lucide-react';

const QuickSelectPage: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<string>('data-center');

  const applications = [
    {
      id: 'data-center',
      title: '数据中心',
      description: '列头柜、UPS 配电和机柜供电，优先沉淀暗装插座及配套插头',
      icon: Building,
      recommendations: [
        {
          current: '32A',
          poles: '3P+N+E',
          protection: 'IP44/IP54',
          voltage: '346-415V',
          series: 'OPTIMA',
          model: '423.3267',
          companion: '213.3237',
          note: '列头柜常用暗装直式插座，客户暂不买插头也保留推荐',
        },
        {
          current: '63A',
          poles: '3P+N+E',
          protection: 'IP44/IP54',
          voltage: '346-415V',
          series: 'OPTIMA',
          model: '423.6367',
          companion: '213.6337',
          note: '413.6367 参数可匹配，后续接库存后再判断是否平替为 423.6367',
        },
      ],
    },
    {
      id: 'industrial',
      title: '工业制造',
      description: '生产线设备、机器人，需要机械连锁和防误操作',
      icon: Factory,
      recommendations: [
        { current: '16A', poles: '2P+E', protection: 'IP44', voltage: '200-250V', series: 'ADVANCE2', model: '待沉淀', companion: '待沉淀', note: '需结合设备类型继续沉淀' },
        { current: '32A', poles: '3P+E', protection: 'IP54', voltage: '380-415V', series: 'OPTIMA', model: '待沉淀', companion: '待沉淀', note: '需结合设备类型继续沉淀' },
      ],
    },
    {
      id: 'port',
      title: '港口码头',
      description: '户外起重机、集装箱设备，需要防水防腐蚀',
      icon: Ship,
      recommendations: [
        { current: '63A', poles: '3P+N+E', protection: 'IP66/IP67/IP69', voltage: '346-415V', series: 'OPTIMA-HD', model: '待沉淀', companion: '待沉淀', note: '户外场景优先确认防护等级和材质要求' },
        { current: '125A', poles: '3P+N+E', protection: 'IP66/IP67/IP69', voltage: '346-415V', series: 'EUREKA-HD', model: '待沉淀', companion: '待沉淀', note: '需结合项目历史报价继续沉淀' },
      ],
    },
    {
      id: 'railway',
      title: '轨道交通',
      description: '地铁、高铁站设备，需要认证和环境参数确认',
      icon: Train,
      recommendations: [
        { current: '32A', poles: '3P+N+E', protection: 'IP44/IP54', voltage: '346-415V', series: 'EUREKA-HD', model: '待沉淀', companion: '待沉淀', note: '需确认车站/车辆段/设备箱场景' },
        { current: '63A', poles: '3P+N+E', protection: 'IP66/IP67/IP69', voltage: '346-415V', series: 'XENIA', model: '待沉淀', companion: '待沉淀', note: '需结合认证和环境要求继续沉淀' },
      ],
    },
  ];

  const selectedApp = applications.find((app) => app.id === selectedApplication);

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] bg-white px-6 py-10 shadow-industrial sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Scenario Library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">快速选型</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#6e6e73]">
              按行业和场景沉淀常用系列、型号和必选配套。缺少场景时，回到详细选型追问关键字段。
            </p>
          </div>
          <Link
            to="/forward-selection"
            className="inline-flex w-fit items-center rounded-full border border-black/10 bg-[#f5f5f7] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            切换到详细选型
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {applications.map((app) => {
          const Icon = app.icon;
          const active = selectedApplication === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApplication(app.id)}
              className={`rounded-[28px] border p-6 text-left shadow-industrial transition duration-300 hover:-translate-y-1 ${
                active ? 'border-[#0066cc] bg-[#eef6ff]' : 'border-black/5 bg-white hover:border-black/10'
              }`}
            >
              <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl ${active ? 'bg-[#0066cc] text-white' : 'bg-[#f5f5f7] text-[#0066cc]'}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#111111]">{app.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6e6e73]">{app.description}</p>
            </button>
          );
        })}
      </div>

      {selectedApp ? (
        <section className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-industrial">
          <div className="flex flex-col gap-5 border-b border-black/5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <selectedApp.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#111111]">{selectedApp.title}</h2>
                <p className="mt-1 text-sm text-[#6e6e73]">{selectedApp.description}</p>
              </div>
            </div>
            <Link
              to="/reverse-selection"
              className="inline-flex w-fit items-center rounded-full bg-[#0066cc] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#004a99] hover:shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              进入报价复刻
            </Link>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {selectedApp.recommendations.map((rec, index) => (
                <div key={index} className="rounded-[24px] border border-black/5 bg-[#f5f5f7] p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1d9a6c]" />
                      <span className="font-semibold text-[#111111]">方案 {index + 1}</span>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#111111]">{rec.series}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['电流', rec.current],
                      ['极数配置', rec.poles],
                      ['防护等级', rec.protection],
                      ['电压范围', rec.voltage],
                      ['推荐型号', rec.model],
                      ['配套插头', rec.companion],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs text-[#86868b]">{label}</div>
                        <div className="mt-1 break-words font-semibold text-[#111111]">{value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-[#6e6e73]">{rec.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] bg-[#111111] p-6 text-sm leading-7 text-white/72">
              <div className="mb-3 text-base font-semibold text-white">选型说明</div>
              基于 SCAME 技术手册和真实应用案例沉淀；库存驱动平替暂未接入，后续通过上传库存表并使用可用数量判断。
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-[28px] border border-black/5 bg-white py-16 text-center shadow-industrial">
          <Search className="mx-auto mb-4 h-12 w-12 text-[#c7c7cc]" />
          <h3 className="text-lg font-semibold text-[#111111]">请选择应用场景</h3>
          <p className="mt-2 text-sm text-[#6e6e73]">系统会根据典型需求推荐合适的产品配置。</p>
        </div>
      )}
    </div>
  );
};

export default QuickSelectPage;
