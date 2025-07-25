import { Category } from '../types';
import { videos } from './videos';

export const categories: Category[] = [
  {
    id: 'amateur',
    name: 'Amateur',
    description: 'Real people, real passion',
    videoCount: videos.filter(v => v.category === 'Amateur').length
  },
  {
    id: 'college',
    name: 'College',
    description: 'Young adult adventures',
    videoCount: videos.filter(v => v.category === 'College').length
  },
  {
    id: 'milf',
    name: 'MILF',
    description: 'Experienced and confident',
    videoCount: videos.filter(v => v.category === 'MILF').length
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Professional encounters',
    videoCount: videos.filter(v => v.category === 'Office').length
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Adventures in nature',
    videoCount: videos.filter(v => v.category === 'Outdoor').length
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Workout and wellness',
    videoCount: videos.filter(v => v.category === 'Fitness').length
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Love and intimacy',
    videoCount: videos.filter(v => v.category === 'Romance').length
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gamer culture meets passion',
    videoCount: videos.filter(v => v.category === 'Gaming').length
  },
  {
    id: 'desi',
    name: 'Desi',
    description: 'South Asian passion and culture',
    videoCount: videos.filter(v => v.category === 'Desi').length
  },
  {
    id: 'teen',
    name: 'Teen',
    description: 'Young adult content (18+)',
    videoCount: videos.filter(v => v.category === 'Teen').length
  },
  {
    id: 'couple',
    name: 'Couple',
    description: 'Intimate moments between partners',
    videoCount: videos.filter(v => v.category === 'Couple').length
  },
  {
    id: 'asian',
    name: 'Asian',
    description: 'Asian beauty and passion',
    videoCount: videos.filter(v => v.category === 'Asian').length
  },
  {
    id: 'latin',
    name: 'Latin',
    description: 'Latin passion and fire',
    videoCount: videos.filter(v => v.category === 'Latin').length
  },
  {
    id: 'ebony',
    name: 'Ebony',
    description: 'Beautiful ebony performers',
    videoCount: videos.filter(v => v.category === 'Ebony').length
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Multiple participants having fun',
    videoCount: videos.filter(v => v.category === 'Group').length
  },
  {
    id: 'solo',
    name: 'Solo',
    description: 'Individual performances',
    videoCount: videos.filter(v => v.category === 'Solo').length
  },
  {
    id: 'bdsm',
    name: 'BDSM',
    description: 'Light bondage and domination',
    videoCount: videos.filter(v => v.category === 'BDSM').length
  },
  {
    id: 'roleplay',
    name: 'Roleplay',
    description: 'Fantasy scenarios and characters',
    videoCount: videos.filter(v => v.category === 'Roleplay').length
  },
  {
    id: 'massage',
    name: 'Massage',
    description: 'Sensual massage experiences',
    videoCount: videos.filter(v => v.category === 'Massage').length
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic and retro style content',
    videoCount: videos.filter(v => v.category === 'Vintage').length
  }
];