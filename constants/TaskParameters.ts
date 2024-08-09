import { MwlType } from '@/components/ui/DifficultyBadge';
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

export const MwlMap: Record<number, MwlType> = {
  5: {
    color: '#DA7979',
    text: 'Overload',
    icon: 'brain',
    iconColor: '#DC2626',
    feedbackText: 'Overload!',
  },
  4: {
    color: '#CCC46C',
    text: 'High Load',
    icon: 'brain',
    iconColor: '#FB7185',
    feedbackText: 'One of those tough days',
  },
  3: {
    color: '#34C51E',
    text: 'Medium Load',
    icon: 'brain',
    iconColor: '#F59E0B',
    feedbackText: 'Perfect balance',
  },
  2: {
    color: '#61B6DC',
    text: 'Light Load',
    icon: 'brain',
    iconColor: '#34D399',
    feedbackText: 'Breezier than usual',
  },
  1: {
    color: '#9E81DD',
    text: 'No Load',
    icon: 'brain',
    iconColor: '#BEF264',
    feedbackText: 'Not enough challenge',
  },
};

export const multipliersMap: Record<string, any> = {
  difficulty: { 1: 0.5, 2: 1, 3: 1.5, 4: 1.7, 5: 2 },
  priority: { 0: 0.7, 1: 1, 2: 1.2, 3: 1.5, 4: 1.7 },
  gap: { 0: 1.7, 1: 1, 2: 0.5 },
};
