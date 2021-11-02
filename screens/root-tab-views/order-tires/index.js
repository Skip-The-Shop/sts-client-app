export {default as PlaceOrder} from './PlaceOrder';
export {default as OrderHistory} from './OrderHistory';

export const tireTypes = [
  {
    value: 'Winter',
    label: 'Winter',
  },
  {
    value: 'All Season',
    label: 'All Season',
  },
  {
    value: 'All Weather',
    label: 'All Weather',
  },
  {
    value: 'Summer',
    label: 'Summer',
  },
];

export const getIncrementalValuesUpToLimit = limit => {
  const arr = [];
  for (let i = 1; i <= limit; i++) {
    arr.push({
      value: i,
      label: i,
    });
  }
  return arr;
};
