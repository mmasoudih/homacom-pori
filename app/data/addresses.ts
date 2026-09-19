export interface Address {
  id: string
  title: string
  address: string
  postalCode: string
}

function item(index: number): Address {
  return {
    id: `addr-${index}`,
    title: 'مازندران، آمل',
    address: 'مازندران، آمل، خیابان امام رضا',
    postalCode: '1130464768',
  }
}

/** Four identical demo addresses, ordered for the RTL stacked list. */
export const addresses: Address[] = [1, 2, 3, 4].map(item)
