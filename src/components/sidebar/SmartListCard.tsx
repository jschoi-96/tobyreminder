'use client';

import { useAppStore } from '@/store/useAppStore';
import type { SmartFilter } from '@/types';

interface SmartListCardProps {
  filter: SmartFilter;
  label: string;
  icon: string;
  iconBg: string;
  count: number;
}

export function SmartListCard({ filter, label, icon, iconBg, count }: SmartListCardProps) {
  const { selection, selectSmartFilter } = useAppStore();
  const isSelected = selection.type === 'smart' && selection.filter === filter;

  return (
    <button
      onClick={() => selectSmartFilter(filter)}
      className={`flex flex-col justify-between rounded-xl p-3 h-20 text-left transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } bg-white shadow-sm hover:brightness-95 active:scale-95`}
    >
      <div className="flex items-center justify-between w-full">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </span>
        <span className="text-xl font-bold text-gray-900">{count}</span>
      </div>
      <span className="text-xs font-semibold text-gray-500">{label}</span>
    </button>
  );
}
