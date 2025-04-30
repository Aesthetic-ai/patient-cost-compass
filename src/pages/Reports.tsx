
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { getPatientsWithExpenses, predictTreatmentCost } from '../services/mockData';
import { AlertCircle } from 'lucide-react';

const Reports = () => {
  const patientsWithExpenses = getPatientsWithExpenses();
  
  const [predictionParams, setPredictionParams] = useState({
    age: 35,
    isSmoker: false
  });
  
  const [predictedCost, setPredictedCost] = useState<number | null>(null);

  // Handle prediction
  const handlePredict = () => {
    const cost = predictTreatmentCost(predictionParams.age, predictionParams.isSmoker);
    setPredictedCost(cost);
  };

  // Calculate treatment types distribution
  const allExpenses = patientsWithExpenses.flatMap(patient => patient.expenses);
  const treatmentTypeData: { [key: string]: number } = {};

  allExpenses.forEach(expense => {
    if (treatmentTypeData[expense.treatmentType]) {
      treatmentTypeData[expense.treatmentType] += expense.amount;
    } else {
      treatmentTypeData[expense.treatmentType] = expense.amount;
    }
  });

  const treatmentChartData = Object.keys(treatmentTypeData).map(type => ({
    name: type,
    value: treatmentTypeData[type]
  }));

  // Calculate smoker vs non-smoker costs
  const smokerExpenses = patientsWithExpenses
    .filter(patient => patient.isSmoker)
    .reduce((sum, patient) => sum + patient.totalExpense, 0);

  const nonSmokerExpenses = patientsWithExpenses
    .filter(patient => !patient.isSmoker)
    .reduce((sum, patient) => sum + patient.totalExpense, 0);

  const smokerChartData = [
    { name: "Smokers", value: smokerExpenses },
    { name: "Non-Smokers", value: nonSmokerExpenses }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Predictions</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Treatment Cost Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Cost Prediction</CardTitle>
            <CardDescription>Estimate treatment costs based on patient attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Patient Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={predictionParams.age} 
                  onChange={(e) => setPredictionParams({...predictionParams, age: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="smoker-predict" 
                  checked={predictionParams.isSmoker}
                  onCheckedChange={(checked) => setPredictionParams({...predictionParams, isSmoker: checked})}
                />
                <Label htmlFor="smoker-predict">Patient is a smoker</Label>
              </div>
              
              <Button 
                onClick={handlePredict} 
                className="w-full bg-healthcare-600 hover:bg-healthcare-700"
              >
                Predict Cost
              </Button>
              
              {predictedCost !== null && (
                <div className="mt-6 p-4 bg-healthcare-50 border border-healthcare-200 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Predicted Treatment Cost</h3>
                  <p className="text-3xl font-bold text-healthcare-700">${predictedCost.toLocaleString()}</p>
                  <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                    <AlertCircle className="h-4 w-4" />
                    <p>This is an estimate based on patient attributes. Actual costs may vary based on specific treatments and conditions.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Types Distribution</CardTitle>
            <CardDescription>Breakdown of expenses by treatment category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {treatmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Expense']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Smoker vs Non-Smoker Costs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Smoker vs Non-Smoker Cost Analysis</CardTitle>
            <CardDescription>Comparison of total healthcare costs between smokers and non-smokers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={smokerChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      `${name}: $${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    <Cell fill="#FF8042" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Expense']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
