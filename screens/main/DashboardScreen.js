import React from 'react';
import { Users2Icon, MessageSquareIcon, BarChart3Icon, TrendingUpIcon } from 'lucide-react';

// A reusable card component for displaying a metric
const MetricCard = ({ title, value, icon: Icon, description, color }) => {
  const cardClasses = `bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4`;
  const iconClasses = `p-3 rounded-full text-white bg-${color}-500`;
  const valueClasses = `text-3xl font-bold text-gray-800`;
  const titleClasses = `text-lg font-medium text-gray-500`;
  const descriptionClasses = `text-sm text-gray-400 mt-1`;

  return (
    <div className={cardClasses}>
      <div className={iconClasses}>
        <Icon size={24} />
      </div>
      <div>
        <div className={titleClasses}>{title}</div>
        <div className={valueClasses}>{value}</div>
        <p className={descriptionClasses}>{description}</p>
      </div>
    </div>
  );
};

const DashboardScreen = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value="1,254"
          icon={Users2Icon}
          description="+15% from last month"
          color="indigo"
        />
        <MetricCard
          title="New Conversations"
          value="345"
          icon={MessageSquareIcon}
          description="+8% from last month"
          color="teal"
        />
        <MetricCard
          title="Conversion Rate"
          value="4.5%"
          icon={TrendingUpIcon}
          description="Avg. daily conversion"
          color="rose"
        />
        <MetricCard
          title="Leads This Week"
          value="128"
          icon={BarChart3Icon}
          description="+22 from last week"
          color="sky"
        />
      </div>

      {/* Placeholder for more content */}
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[300px]">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <p className="text-gray-500">Placeholder for recent activities, quick links, or a chart.</p>
      </div>
    </div>
  );
};

export default DashboardScreen;
