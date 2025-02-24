export interface Batch {
  id: string;
  batchNumber: string;
  type: string;
  quantity: number;
  location: string;
  status: 'table1' | 'table2' | 'table3';
  perchNumber: number;
  startDate: string;
  harvestDate: string;
  supplier: string;
  qualityScore: number;
  lastCheck: string;
}
