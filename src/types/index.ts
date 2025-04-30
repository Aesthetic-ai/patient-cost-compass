
export interface Patient {
  id: string;
  name: string;
  age: number;
  isSmoker: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  description: string;
  treatmentType: string;
}

export interface PredictionResult {
  predictedCost: number;
  confidence: number;
}

export interface PatientWithExpenses extends Patient {
  expenses: Expense[];
  totalExpense: number;
}
