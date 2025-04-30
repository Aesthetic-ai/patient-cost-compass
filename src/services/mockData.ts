
import { Patient, Expense, PatientWithExpenses } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock patients data
const patients: Patient[] = [
  {
    id: uuidv4(),
    name: 'John Doe',
    age: 45,
    isSmoker: true,
    createdAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    age: 32,
    isSmoker: false,
    createdAt: new Date(2023, 2, 20).toISOString()
  },
  {
    id: uuidv4(),
    name: 'Robert Johnson',
    age: 58,
    isSmoker: true,
    createdAt: new Date(2023, 3, 5).toISOString()
  },
  {
    id: uuidv4(),
    name: 'Emily Wilson',
    age: 29,
    isSmoker: false,
    createdAt: new Date(2023, 4, 10).toISOString()
  },
  {
    id: uuidv4(),
    name: 'Michael Brown',
    age: 51,
    isSmoker: true,
    createdAt: new Date(2023, 5, 25).toISOString()
  }
];

// Treatment types
const treatmentTypes = ['Consultation', 'Medication', 'Surgery', 'Therapy', 'Diagnostic Test'];

// Generate random expenses for each patient
const expenses: Expense[] = [];
patients.forEach(patient => {
  const numExpenses = 3 + Math.floor(Math.random() * 5); // 3-7 expenses per patient
  
  for (let i = 0; i < numExpenses; i++) {
    const baseAmount = 100 + Math.floor(Math.random() * 900);
    const smokingMultiplier = patient.isSmoker ? 1.3 : 1;
    const ageMultiplier = patient.age > 50 ? 1.2 : 1;
    
    expenses.push({
      id: uuidv4(),
      patientId: patient.id,
      amount: Math.round(baseAmount * smokingMultiplier * ageMultiplier),
      date: new Date(2023, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString(),
      description: `Treatment for patient: ${patient.name}`,
      treatmentType: treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)]
    });
  }
});

// Get patients with their expenses
export const getPatientsWithExpenses = (): PatientWithExpenses[] => {
  return patients.map(patient => {
    const patientExpenses = expenses.filter(expense => expense.patientId === patient.id);
    const totalExpense = patientExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      ...patient,
      expenses: patientExpenses,
      totalExpense
    };
  });
};

// Export mock data
export const mockData = {
  patients,
  expenses,
  getPatientsWithExpenses
};

// Function to add a new patient
export const addPatient = (newPatient: Omit<Patient, 'id' | 'createdAt'>): Patient => {
  const patient: Patient = {
    id: uuidv4(),
    ...newPatient,
    createdAt: new Date().toISOString()
  };
  patients.push(patient);
  return patient;
};

// Function to add a new expense
export const addExpense = (newExpense: Omit<Expense, 'id'>): Expense => {
  const expense: Expense = {
    id: uuidv4(),
    ...newExpense,
  };
  expenses.push(expense);
  return expense;
};

// Mock prediction function (to simulate ML model)
export const predictTreatmentCost = (age: number, isSmoker: boolean): number => {
  // Simple linear formula for demonstration
  const baseCost = 500;
  const ageFactor = age * 10;
  const smokerFactor = isSmoker ? 1000 : 0;
  
  return Math.round(baseCost + ageFactor + smokerFactor);
};
