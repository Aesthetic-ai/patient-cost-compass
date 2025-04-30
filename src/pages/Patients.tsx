
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addPatient, getPatientsWithExpenses } from '../services/mockData';
import { Patient } from '../types';
import { UserPlus, Search, Cigarette } from 'lucide-react';

const Patients = () => {
  const [patientsData, setPatientsData] = useState(getPatientsWithExpenses());
  const [searchTerm, setSearchTerm] = useState('');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 30,
    isSmoker: false,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPatients = patientsData.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new patient
  const handleAddPatient = () => {
    const patient = addPatient(newPatient);
    setPatientsData([...getPatientsWithExpenses()]);
    
    // Reset form
    setNewPatient({
      name: '',
      age: 30,
      isSmoker: false,
    });
    
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700">
              <UserPlus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="smoker" 
                  checked={newPatient.isSmoker}
                  onCheckedChange={(checked) => setNewPatient({...newPatient, isSmoker: checked})}
                />
                <Label htmlFor="smoker">Smoker</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPatient} disabled={!newPatient.name}>
                Add Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          className="pl-10"
          placeholder="Search patients..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Patients table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Smoker</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>
                      {patient.isSmoker ? (
                        <div className="flex items-center">
                          <Cigarette className="h-4 w-4 mr-1 text-red-500" /> Yes
                        </div>
                      ) : 'No'}
                    </TableCell>
                    <TableCell className="text-right">${patient.totalExpense.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No patients found
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

export default Patients;
