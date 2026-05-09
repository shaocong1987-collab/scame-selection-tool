import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight text-[#111111]">SCAME Selector</div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6e6e73]">
              面向内部测试的工业电气智能选型工作台。LLM 负责理解需求，最终型号由结构化数据和规则引擎输出。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <FooterGroup title="工作台" links={[['正向查询', '/forward-selection'], ['反向选型', '/reverse-selection'], ['快速选型', '/quick-select']]} />
            <FooterGroup title="产品" links={[['产品库', '/products'], ['插头库', '/plugs'], ['插座库', '/sockets']]} />
            <FooterGroup title="支持" links={[['知识库', '/knowledge'], ['文档管理', '/knowledge/management'], ['帮助', '/help']]} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 text-xs text-[#86868b] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 北京韶聪泽明智能科技有限责任公司</span>
          <a href="mailto:support@scame-selector.com" className="inline-flex items-center gap-1 transition hover:text-[#111111]">
            <Mail className="h-3.5 w-3.5" />
            support@scame-selector.com
          </a>
        </div>
      </div>
    </footer>
  );
};

interface FooterGroupProps {
  title: string;
  links: Array<[string, string]>;
}

const FooterGroup: React.FC<FooterGroupProps> = ({ title, links }) => (
  <div>
    <div className="mb-3 font-semibold text-[#111111]">{title}</div>
    <div className="space-y-2">
      {links.map(([label, href]) => (
        <Link key={href} to={href} className="block text-[#6e6e73] transition hover:text-[#111111]">
          {label}
        </Link>
      ))}
    </div>
  </div>
);

export default Footer;
