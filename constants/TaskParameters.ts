import { PriorityMapType } from './types';

export const PriorityMap: Record<number, PriorityMapType> = {
  4: {
    color: 'bg-red-500',
    text: 'Urgent',
    icon: 'alert-circle',
  },
  3: {
    color: 'bg-orange-500',
    text: 'High',
    icon: 'chevrons-up',
  },
  2: {
    color: 'bg-yellow-500',
    text: 'Medium',
    icon: 'chevron-up',
  },
  1: {
    color: 'bg-green-500',
    text: 'Low',
    icon: 'chevron-down',
  },
  0: {
    color: 'bg-gray-300',
    text: 'No Priority',
    icon: 'minus',
  },
};
