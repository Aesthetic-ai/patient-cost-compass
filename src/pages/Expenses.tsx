
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getPatientsWithExpenses, addExpense } from '../services/mockData';
import { formatDistance } from 'date-fns';
import { Plus, Filter } from 'lucide-react';

const Expenses = () => {
  const [patientsData, setPatientsData] = useState(getPatientsWithExpenses());
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newExpense, setNewExpense] = useState({
    patientId: '',
    amount: 0,
    date: '',
    description: '',
    treatmentType: 'Consultation'
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get all expenses from all patients
  const allExpenses = patientsData.flatMap(patient => 
    patient.expenses.map(expense => ({
      ...expense,
      patientName: patient.name
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter expenses by selected patient
  const filteredExpenses = selectedPatient 
    ? allExpenses.filter(expense => expense.patientId === selectedPatient)
    : allExpenses;

  const handleAddExpense = () => {
    addExpense({
      ...newExpense,
      date: newExpense.date || new Date().toISOString()
    });
    
    // Update the state with new data
    setPatientsData(getPatientsWithExpenses());
    
    // Reset form
    setNewExpense({
      patientId: '',
      amount: 0,
      date: '',
      description: '',
      treatmentType: 'Consultation'
    });
    
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={newExpense.patientId}
                  onValueChange={(value) => setNewExpense({...newExpense, patientId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientsData.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date ? new Date(newExpense.date).toISOString().slice(0, 10) : ''}
                  onChange={(e) => setNewExpense({...newExpense, date: new Date(e.target.value).toISOString()})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatmentType">Treatment Type</Label>
                <Select 
                  value={newExpense.treatmentType}
                  onValueChange={(value) => setNewExpense({...newExpense, treatmentType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                    <SelectItem value="Diagnostic Test">Diagnostic Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Expense details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddExpense} 
                disabled={!newExpense.patientId || !newExpense.amount}
              >
                Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Label htmlFor="patientFilter" className="whitespace-nowrap">Filter by patient:</Label>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger id="patientFilter" className="w-[200px]">
              <SelectValue placeholder="All patients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All patients</SelectItem>
              {patientsData.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Expenses table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Treatment Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.patientName}</TableCell>
                    <TableCell>{expense.treatmentType}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                      <span className="block text-xs text-gray-500">
                        {formatDistance(new Date(expense.date), new Date(), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
