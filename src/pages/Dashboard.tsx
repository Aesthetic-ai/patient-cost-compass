
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPatientsWithExpenses } from '../services/mockData';
import { Users, DollarSign, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';

const Dashboard = () => {
  const patientsWithExpenses = getPatientsWithExpenses();
  
  // Calculate total expenses
  const totalExpenses = patientsWithExpenses.reduce(
    (sum, patient) => sum + patient.totalExpense, 
    0
  );

  // Calculate average cost per patient
  const averageCostPerPatient = Math.round(totalExpenses / patientsWithExpenses.length);
  
  // Calculate smoker vs non-smoker expenses
  const smokerPatients = patientsWithExpenses.filter(patient => patient.isSmoker);
  const nonSmokerPatients = patientsWithExpenses.filter(patient => !patient.isSmoker);
  
  const averageSmokerExpense = Math.round(
    smokerPatients.reduce((sum, patient) => sum + patient.totalExpense, 0) / smokerPatients.length
  );
  
  const averageNonSmokerExpense = Math.round(
    nonSmokerPatients.reduce((sum, patient) => sum + patient.totalExpense, 0) / nonSmokerPatients.length
  );

  // Data for expense by age group chart
  const expensesByAgeGroup = [
    { name: '18-30', expenses: 0, patients: 0 },
    { name: '31-45', expenses: 0, patients: 0 },
    { name: '46-60', expenses: 0, patients: 0 },
    { name: '60+', expenses: 0, patients: 0 },
  ];

  patientsWithExpenses.forEach(patient => {
    if (patient.age <= 30) {
      expensesByAgeGroup[0].expenses += patient.totalExpense;
      expensesByAgeGroup[0].patients += 1;
    } else if (patient.age <= 45) {
      expensesByAgeGroup[1].expenses += patient.totalExpense;
      expensesByAgeGroup[1].patients += 1;
    } else if (patient.age <= 60) {
      expensesByAgeGroup[2].expenses += patient.totalExpense;
      expensesByAgeGroup[2].patients += 1;
    } else {
      expensesByAgeGroup[3].expenses += patient.totalExpense;
      expensesByAgeGroup[3].patients += 1;
    }
  });

  // Calculate average for each age group
  expensesByAgeGroup.forEach(group => {
    if (group.patients > 0) {
      group.expenses = Math.round(group.expenses / group.patients);
    }
  });

  // Data for smoker vs non-smoker comparison
  const smokerComparison = [
    { name: 'Smoker', value: averageSmokerExpense || 0 },
    { name: 'Non-Smoker', value: averageNonSmokerExpense || 0 }
  ];

  // Patient expenses data for the chart
  const patientExpensesData = patientsWithExpenses.map(patient => ({
    name: patient.name,
    expenses: patient.totalExpense,
    age: patient.age,
    isSmoker: patient.isSmoker
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold text-gray-900">{patientsWithExpenses.length}</h3>
            </div>
            <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-healthcare-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-healthcare-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Cost per Patient</p>
              <h3 className="text-2xl font-bold text-gray-900">${averageCostPerPatient.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-healthcare-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Smoker Cost Diff.</p>
              <h3 className="text-2xl font-bold text-gray-900">
                +${Math.max(0, averageSmokerExpense - averageNonSmokerExpense).toLocaleString()}
              </h3>
            </div>
            <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
              <LineChartIcon className="h-6 w-6 text-healthcare-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Data Visualization */}
      <Tabs defaultValue="expenses">
        <TabsList className="mb-4">
          <TabsTrigger value="expenses">Patient Expenses</TabsTrigger>
          <TabsTrigger value="age-group">Age Group Analysis</TabsTrigger>
          <TabsTrigger value="smoker">Smoker vs Non-Smoker</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Patient Expense Comparison</CardTitle>
              <CardDescription>Breakdown of expenses across all patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Expenses']}
                      labelFormatter={(label) => `Patient: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      name="Total Expenses" 
                      dataKey="expenses" 
                      fill="#0ea5e9" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="age-group">
          <Card>
            <CardHeader>
              <CardTitle>Average Expenses by Age Group</CardTitle>
              <CardDescription>How costs vary across different age demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={expensesByAgeGroup}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Avg Expense']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Average Expense" 
                      dataKey="expenses" 
                      stroke="#0ea5e9" 
                      strokeWidth={3} 
                      dot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="smoker">
          <Card>
            <CardHeader>
              <CardTitle>Smoker vs Non-Smoker Average Costs</CardTitle>
              <CardDescription>Cost comparison between smokers and non-smokers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={smokerComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Average Cost']}
                    />
                    <Legend />
                    <Bar
                      name="Average Treatment Cost" 
                      dataKey="value" 
                      fill="#0ea5e9" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
