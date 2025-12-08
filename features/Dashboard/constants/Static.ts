import { MetricData, Product } from '../types/types';

export const metrics: MetricData[] = [
    {
      title: 'Monthly Product Cost',
      value: '$81,000',
      change: '+10.8%',
      isPositive: true,
      subtitle: 'From last month',
      bgColor: 'bg-indigo-600'
    },
    {
      title: 'Total Products',
      value: '5,000',
      change: '+1.5%',
      isPositive: true,
      subtitle: 'From last day',
    },
    {
      title: 'Weekly Product Cost',
      value: '12,000',
      change: '+3.6%',
      isPositive: true,
      subtitle: 'From last week',
    },
    {
      title: 'Daily Product Cost',
      value: '5,000',
      change: '-1.5%',
      isPositive: false,
      subtitle: 'From last day',
    },
  ];

  export const products: Product[] = [
    { id: '070121', name: 'Data Report', type: 'PDF', price: 2000.00, sales: 3000, status: 'Success' },
    { id: '070132', name: 'Store Data', type: 'DOC', price: 3021.00, sales: 2311, status: 'Success' },
    { id: '070133', name: 'Analytics', type: 'XLS', price: 1500.00, sales: 1850, status: 'Success' },
    { id: '070134', name: 'User Data', type: 'PDF', price: 2500.00, sales: 2100, status: 'Pending' },
  ];
