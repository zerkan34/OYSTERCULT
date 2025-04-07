export interface Table {
  id: string;
  name: string;
  tableNumber: string;
  oysterType: string;
  temperature?: number;
  salinity?: number;
  lastUpdate: string;
  cells: TableCell[];
  history: HistoryEntry[];
  location: string;
  type: string;
  status: string;
  currentSize: string;
  targetSize: string;
  startDate: string;
  timeProgress: number;
  sizeProgress: number;
  layers: number;
  density: string;
  alert: boolean;
  value: number;
  exondation?: Exondation;
  sampling?: {
    lastCheckDate: string;
    nextCheckDate: string;
    mortalityRate: number;
    currentSize: string;
  };
  currentBatch?: {
    size: string;
    currentSize: string;
    quantity: number;
    startDate: string;
    estimatedHarvestDate: string;
    oysterType: string;
    caliber: string;
  };
}

export interface TableCell {
  id: string;
  filled: boolean | number;
  ropeCount?: number;
  spat?: {
    name: string;
    batchNumber: string;
    dateAdded: string;
  };
  exondation?: Exondation;
  history?: HistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  action: string;
  details: string;
  type?: string;
  naissain?: string;
  lotNumber?: string;
  mortalityRate?: number;
  notes?: string;
}

export interface Exondation {
  isExonded: boolean;
  startTime?: string;
  endTime?: string;
  exondationCount?: number;
}