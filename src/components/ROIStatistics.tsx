
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain, Sale } from '@/pages/Index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ROIStatisticsProps {
  domains: Domain[];
  sales: Sale[];
}

const ROIStatistics: React.FC<ROIStatisticsProps> = ({ domains, sales }) => {
  const totalPurchased = domains.reduce((sum, d) => sum + (d.purchasePrice || 0), 0);
  const totalSold = sales.reduce((sum, s) => sum + s.salePrice, 0);
  const roi = totalPurchased > 0 ? ((totalSold - totalPurchased) / totalPurchased) * 100 : 0;
  const averageValue = domains.length > 0 ? totalPurchased / domains.length : 0;

  const chartData = [
    {
      name: 'Total Acheté',
      value: totalPurchased,
      color: '#ef4444'
    },
    {
      name: 'Total Vendu',
      value: totalSold,
      color: '#22c55e'
    },
    {
      name: 'Profit',
      value: Math.max(0, totalSold - totalPurchased),
      color: '#3b82f6'
    }
  ];

  const statusData = [
    {
      name: 'Actifs',
      value: domains.filter(d => d.status === 'actif').length,
      color: '#22c55e'
    },
    {
      name: 'En vente',
      value: domains.filter(d => d.status === 'en-vente').length,
      color: '#f59e0b'
    },
    {
      name: 'Vendus',
      value: domains.filter(d => d.status === 'vendu').length,
      color: '#3b82f6'
    },
    {
      name: 'Expirés',
      value: domains.filter(d => d.status === 'expire').length,
      color: '#ef4444'
    }
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Acheté</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalPurchased.toFixed(0)}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vendu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalSold.toFixed(0)}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Valeur Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{averageValue.toFixed(0)}€</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyse Financière</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`, '']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROIStatistics;
