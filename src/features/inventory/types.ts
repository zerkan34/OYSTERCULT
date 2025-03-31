export interface Table {
  id: string;
  name: string;
  tableNumber: string;
  oysterType: string;
  temperature: number;
  salinity: number;
  lastUpdate: string;
  cells: TableCell[];
  history: HistoryEntry[];
  exondation?: {
    isExonded: boolean;
    startTime?: string;
    endTime?: string;
  };
}

export interface TableCell {
  id: string;
  filled: boolean;
  ropeCount?: number;
  spat?: {
    name: string;
    batchNumber: string;
    dateAdded: string;
  };
}

export interface HistoryEntry {
  date: string;
  naissain: string;
  lotNumber: string;
  mortalityRate: number;
  notes: string;
  action?: string;
  details?: string;
  spat?: {
    name: string;
    batchNumber: string;
  };
}