export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at?: string;
  status?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  zip?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  client_id?: string;
}

export interface Invoice {
  id: string;
  number: string;
  type: 'quote' | 'invoice';
  client: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'sent' | 'draft' | 'accepted';
  driveLink: string;
}

export interface Debt {
  id: string;
  type: 'receivable' | 'payable'; // receivable = on me doit, payable = je dois
  person: string;
  amount: number;
  dueDate: string;
  phone: string;
  reason: string;
}

export interface Recurring {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDate: string;
  category: string;
  active: boolean;
}

export type ViewState = 'dashboard' | 'clients' | 'expenses' | 'income' | 'settings' | 'invoices' | 'credits' | 'recurring' | 'agent-moussa';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (client: Client) => void;
}

export interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSave: (transaction: Transaction) => void;
}