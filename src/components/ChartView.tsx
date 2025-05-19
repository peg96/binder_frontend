import { useMemo } from "react";
import { formatDateIt } from "@/lib/date";
import { formatCurrency } from "@/lib/currency";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId: number;
};

interface ChartViewProps {
  transactions: Transaction[];
}

export default function ChartView({ transactions }: ChartViewProps) {
  // Prepara i dati per il grafico - mostra le ultime 10 transazioni
  const chartData = useMemo(() => {
    // Ordina le transazioni per data (dalla più vecchia alla più recente)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Prendi le ultime 10 transazioni (o meno se non ce ne sono abbastanza)
    const recentTransactions = sortedTransactions.slice(-10);
    
    return recentTransactions.map(transaction => ({
      date: formatDateIt(transaction.date),
      amount: transaction.amount,
      description: transaction.description
    }));
  }, [transactions]);

  // Se non ci sono transazioni, mostra un messaggio
  if (transactions.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-neutral-dark/70">
        Nessuna transazione da visualizzare
      </div>
    );
  }

  // Formatta i valori per il tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-md shadow-sm border border-neutral-light">
          <p className="font-medium">{payload[0].payload.description}</p>
          <p className="text-sm">{payload[0].payload.date}</p>
          <p className={`text-sm font-bold ${payload[0].value >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            tickMargin={8}
          />
          <YAxis 
            hide 
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#e0e0e0" />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]}
            fill={(entry: any) => entry.amount >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
