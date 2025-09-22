
// --- Member 5 START ---
// File: StockDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) navigate("/signup");

    if (symbol) {
      const mockStock = {
        symbol: symbol.toUpperCase(),
        name: ${symbol} Ltd.,
        price: Math.floor(Math.random() * 5000) + 100,
        change: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000) + 100000,
      };
      setStockData(mockStock);

      // Fake chart data
      const data = [];
      const basePrice = mockStock.price - mockStock.change;
      for (let i = 0; i < 50; i++) {
        const time = ${i}:00;
        const price = Math.max(basePrice + (Math.random() - 0.5) * (mockStock.price * 0.02), basePrice * 0.8);
        data.push({ time, price });
      }
      setChartData(data);
    }
  }, [symbol, navigate]);

  const handleBuySell = (action) => {
    if (!stockData) return;
    const portfolio = JSON.parse(localStorage.getItem("portfolio") || "[]");
    portfolio.push({ id: Date.now(), symbol: stockData.symbol, name: stockData.name, action, price: stockData.price, quantity: 1 });
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    toast({ title: ${action.toUpperCase()} Order, description: ${action} 1 share of ${stockData.symbol} at ₹${stockData.price} });
  };

  if (!stockData) return <div className="min-h-screen flex items-center justify-center"><Activity className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{stockData.symbol} - {stockData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>₹{stockData.price} ({stockData.change.toFixed(2)}, {stockData.changePercent.toFixed(2)}%)</p>
          <Badge>{stockData.volume} Vol</Badge>
          <div className="flex space-x-2 mt-4">
            <Button onClick={() => handleBuySell("buy")}>Buy</Button>
            <Button variant="destructive" onClick={() => handleBuySell("sell")}>Sell</Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Price Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#2563eb" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

