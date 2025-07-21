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
  }
];