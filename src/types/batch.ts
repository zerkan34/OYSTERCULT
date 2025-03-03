export type BatchStatus = 'table1' | 'table2' | 'table3' | 'stockage' | 'expedition';

export interface Batch {
  id: string;
  batchNumber: string;
  type: string;
  status: BatchStatus;
  startDate: string;
  quantity: number;
  notes?: string;
}
