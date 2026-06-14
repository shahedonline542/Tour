export interface RegistrationData {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  participation: 'yes' | 'no' | 'maybe';
  hasFamily: 'yes' | 'no';
  familyCount: number;
  emergencyPhone: string;
  notes: string;
  agreement: boolean;
  paidAlready?: 'yes' | 'no';
  paymentMethod?: 'bKash' | 'Nagad' | 'Upay' | 'Rocket' | '';
  paidAmount?: string;
  transactionId?: string;
  adminPaymentStatus?: 'Paid' | 'Pending' | 'Unpaid';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}
