import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'coffee_shop',
    name: 'Кофейня формата «to-go»',
    description: 'Небольшая точка кофе с собой в проходном месте',
    icon: '☕',
    values: {
      revenue: 650000,
      rent: 120000,
      salaries: 180000,
      ads: 45000,
      other: 140000, // сырье, стаканчики, хозтовары
    },
  },
  {
    id: 'marketplace_pickup',
    name: 'Пункт выдачи (ПВЗ)',
    description: 'Пункт выдачи заказов с фиксированной комиссией от оборота',
    icon: '📦',
    values: {
      revenue: 380000,
      rent: 95000,
      salaries: 130000,
      ads: 10000,
      other: 35000, // связь, пакеты, коммуналка
    },
  },
  {
    id: 'beauty_salon',
    name: 'Студия красоты / Барбершоп',
    description: 'Небольшой салон на 3 рабочих места',
    icon: '✂️',
    values: {
      revenue: 520000,
      rent: 110000,
      salaries: 220000,
      ads: 55000,
      other: 40000,
    },
  },
  {
    id: 'ecommerce',
    name: 'Интернет-магазин одежды',
    description: 'Продажи через соцсети и маркетплейсы',
    icon: '🛍️',
    values: {
      revenue: 1250000,
      rent: 40000, // мини-склад
      salaries: 190000,
      ads: 310000, // существенный рекламный бюджет
      other: 480000, // закупка товара, логистика
    },
  },
  {
    id: 'unprofitable_case',
    name: 'Кризисный проект (убыток)',
    description: 'Пример бизнеса с дефицитом выручки ниже точки безубыточности',
    icon: '⚠️',
    values: {
      revenue: 290000,
      rent: 130000,
      salaries: 150000,
      ads: 50000,
      other: 30000,
    },
  },
];
