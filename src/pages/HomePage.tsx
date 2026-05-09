import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  FileSearch,
  Layers3,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const HomePage: React.FC = () => {
  const modules = [
    {
      title: '正向查询',
      description: '输入型号或确认参数后，从测试样本结构化数据输出结果。',
      href: '/forward-selection',
      icon: Search,
    },
    {
      title: '产品详情',
      description: '查看完整字段、产品图片、技术说明书、配套和衍生型号。',
      href: '/products',
      icon: FileSearch,
    },
    {
      title: '反向选型',
      description: '按产品形式、电流、极数、h、电压和 IP 逐层收敛。',
      href: '/reverse-selection',
      icon: Layers3,
    },
    {
      title: '测试数据',
      description: '当前 MVP 只使用 47 个测试型号，不扩全量。',
      href: '/knowledge',
      icon: Database,
    },
  ];

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[36px] bg-[#fbfbfd] px-6 py-16 shadow-industrial sm:px-10 lg:px-16 lg:py-24">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-8 top-16 h-48 w-48 rounded-full bg-slate-200/70 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-[#6e6e73] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#0066cc]" />
            SCAME Selection Tool 1.0 MVP
          </div>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
            让工业电气选型，
            <span className="block text-[#0066cc]">清晰、可靠、可追溯。</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6e6e73] sm:text-xl">
            面向内部测试的高准确度选型工作台。自然语言负责理解需求，最终型号由结构化数据和规则引擎决定。
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/forward-selection"
              className="inline-flex items-center rounded-full bg-[#0066cc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#004a99]"
            >
              进入正向查询
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/reverse-selection"
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg"
            >
              查看报价复刻
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-black/10 bg-white/88 p-6 shadow-industrial backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-semibold text-[#111111]">
              <MessageSquare className="h-5 w-5 text-[#0066cc]" />
              聊天入口 + 参数确认卡
            </div>
            <div className="mt-5 rounded-2xl bg-[#f5f5f7] p-4 text-sm leading-6 text-[#6e6e73]">
              用户可以输入型号，例如 <span className="font-mono text-[#111111]">418.6367</span>；也可以描述
              <span className="font-medium text-[#111111]"> 63A 3P+N+E 6h 346-415 IP66/IP67/IP69 暗装插座</span>。
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['产品形式', '电流 / 极数', '电压 / IP'].map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-semibold text-[#111111]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white/88 p-6 shadow-industrial backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-semibold text-[#111111]">
              <Bot className="h-5 w-5 text-[#0066cc]" />
              输出原则
            </div>
            <div className="mt-6 space-y-4 text-sm leading-6 text-[#6e6e73]">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0066cc]" />
                LLM 只做理解、翻译、追问和解释。
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0066cc]" />
                最终型号只由规则和结构化数据决定。
              </div>
              <div className="rounded-2xl border border-black/5 bg-[#f5f5f7] p-4">
                <div className="text-3xl font-semibold tracking-tight text-[#111111]">47</div>
                <div className="mt-1 text-[#6e6e73]">个测试型号已接入 MVP 数据源</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86868b]">Workspace</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">清晰分层的选型模块</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#6e6e73]">先跑通 MVP，再逐步扩展反向选型、库存平替、配套推荐和报价闭环。</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                to={module.href}
                className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-industrial transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-industrial-lg"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#0066cc]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#86868b] transition group-hover:translate-x-1 group-hover:text-[#0066cc]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e6e73]">{module.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
