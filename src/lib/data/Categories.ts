import { type Category, type FixedCategory } from '$lib/interfaces/Category';

export const CATEGORY_REGISTRY: Readonly<Record<number, FixedCategory>> = Object.freeze<
  Record<number, FixedCategory>
>({
  1: { color: '#D7B456', name: 'Food', z_index: 43 },
  2: { color: '#5A8E00', name: 'Drinks', z_index: 42 },
  3: { color: '#529CFF', name: 'Activities', z_index: 41 },
  4: { color: '#8354CF', name: 'Partners', z_index: 40 },
  5: { color: '#580025', name: 'Stages', z_index: 38 },
  6: { color: '#016752', name: 'Camping Grounds', z_index: 7 },
  7: { color: '#A32828', name: 'Emergency Exits', z_index: 25 },
  8: { color: '#57D7E7', name: 'Free Tap Water', z_index: 34 },
  9: { color: '#FFFFFF', name: 'First Aid', z_index: 36 },
  10: { color: '#1BA5D1', name: 'Toilets', z_index: 35 },
  11: { color: '#7A91AC', name: 'Parking', z_index: 32 },
  12: { color: '#37A85E', name: 'Festitent', z_index: 3 },
  13: { color: '#ABA083', name: 'Check-in', z_index: 29 },
  14: { color: '#5AD8FF', name: 'Showers', z_index: 33 },
  15: { color: '#FDDA27', name: 'Charging Station', z_index: 28 },
  16: { color: '#5A8E21', name: 'Disabled Facilities', z_index: 39 },
  17: { color: '#B99946', name: 'VIP', z_index: 27 },
  18: { color: '#4CC0C7', name: 'Info Point', z_index: 26 },
  19: { color: '#8E0900', name: 'Entrance', z_index: 22 },
  20: { color: '#BBC200', ground_layer: true, name: 'Festival Grounds', z_index: 2 },
  21: { color: '#D0BE94', name: 'Walkway', z_index: 12 },
  22: { color: '#6A8F71', name: 'GMM Tokens', z_index: 24 },
  23: { color: '#FFA44E', name: 'Wristbands', z_index: 23 },
  24: { color: '#8DAA9D', name: 'Bike Parking', z_index: 31 },
  25: { color: '#C58EE2', name: 'Lost & Found', z_index: 21 },
  26: { color: '#D04D4D', name: 'Ticketing', z_index: 20 },
  27: { color: '#505D6D', name: 'Disability Parking', z_index: 19 },
  28: { color: '#1F66B8', name: 'Cashless Helpdesk', z_index: 18 },
  29: { color: '#F86274', name: 'Kiss & Ride', z_index: 17 },
  30: { color: '#AA5E1B', name: 'Shops', z_index: 16 },
  31: { color: '#7AA54F', name: 'Recycle Point', z_index: 15 },
  32: { color: '#C94959', name: 'Lockers', z_index: 37 },
  33: { color: '#04052E', name: 'WiFi Zone', z_index: 13 },
  34: { color: '#9AACAB', name: 'Festihut', z_index: 8 },
  35: { color: '#8D8D8D', ground_layer: true, name: 'Grounds', z_index: 1 },
  36: { color: '#919600', name: 'Food Area Underground', z_index: 4 },
  37: { color: '#D0BE94', name: 'Wooden Plates', z_index: 6 },
  38: { color: '#6E8126', name: 'Metal Market', z_index: 5 },
  39: { color: '#D24905', name: 'Shuttles', z_index: 14 },
  40: { color: '#9E9E9E', name: 'Fences', z_index: 30 },
  41: { color: '#D0D5E5', name: 'Foodcorner', z_index: 10 },
  42: { color: '#7D767E', name: 'Tribune', z_index: 9 },
  43: { color: '#000000', name: 'Crosses', z_index: 11 },
  44: { color: '#CADC8C', ground_layer: true, name: 'Light Green Camping Grounds', z_index: 0 }
});

export const CATEGORY_LIST = Object.freeze(
  Object.entries(CATEGORY_REGISTRY).map<Category>(([fixed_id, data]) => ({
    id: fixed_id,
    fixed_id: fixed_id,
    ...data
  }))
);
