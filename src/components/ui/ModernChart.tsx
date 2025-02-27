import { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface Series {
  name: string;
  color: string;
  data: DataPoint[];
}

interface ModernChartProps {
  series: Series[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

interface CombinedDataPoint {
  name: string;
  [key: string]: string | number;
}

export class ModernChart extends PureComponent<ModernChartProps> {
  static defaultProps = {
    height: 300,
    showGrid: true,
    showLegend: true,
  };

  render() {
    const { series, height, showGrid, showLegend } = this.props;

    // Vérifier si nous avons des données valides
    if (!series || series.length === 0 || !series[0].data) {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px] bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/60">Aucune donnée disponible</p>
        </div>
      );
    }

    // Combine all data points from all series
    const data = series[0].data.map((point, i) => {
      const combinedPoint: CombinedDataPoint = { name: point.name };
      series.forEach((s) => {
        if (s.data[i]) {
          combinedPoint[s.name] = s.data[i].value;
        }
      });
      return combinedPoint;
    });

    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(var(--color-border) / 0.5)"
            />
          )}
          <XAxis
            dataKey="name"
            stroke="rgb(var(--color-text-secondary))"
            fontSize={12}
          />
          <YAxis stroke="rgb(var(--color-text-secondary))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--color-background))',
              border: '1px solid rgb(var(--color-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: 'rgb(var(--color-text))' }}>{value}</span>
              )}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}