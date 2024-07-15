import { PriorityMapType } from './types';

export const PriorityMap: Record<number, PriorityMapType> = {
  4: {
    color: '$red10',
    text: 'Urgent',
    icon: 'alert-circle',
  },
  3: {
    color: '$orange10',
    text: 'High',
    icon: 'chevrons-up',
  },
  2: {
    color: '$green10',
    text: 'Medium',
    icon: 'chevron-up',
  },
  1: {
    color: '$blue10',
    text: 'Low',
    icon: 'chevron-down',
  },
  0: {
    color: '$gray10',
    text: 'No Priority',
    icon: 'minus',
  },
};
