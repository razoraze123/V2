import { Client, Transaction, Invoice, Debt, Recurring } from '../types';

// --- UTILITY ---
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

// Initial Mock Data Clients (Orienté Petit Commerces / Particuliers)
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Boutique Salam',
    email: 'salam.boutique@gmail.com',
    phone: '90 12 34 56',
    company: 'Commerce Général',
    address: 'Quartier Plateau',
    city: 'Niamey',
    zip: 'BP 12'
  },
  {
    id: '2',
    name: 'Moussa Taxi',
    email: 'moussa.transport@yahoo.fr',
    phone: '99 88 77 66',
    company: 'Transport',
    address: 'Gare Wadata',
    city: 'Niamey',
    zip: ''
  },
  {
    id: '3',
    name: 'Sarah Coiffure',
    email: 'sarah.style@hotmail.com',
    phone: '80 20 30 40',
    company: 'Salon de Beauté',
    address: 'Avenue Mali Béro',
    city: 'Niamey',
    zip: '1000'
  },
  {
    id: '4',
    name: 'Ali Cyber',
    email: 'ali.cyber@gmail.com',
    phone: '92 00 11 22',
    company: 'Services Informatiques',
    address: 'Face Stade',
    city: 'Niamey',
    zip: ''
  },
  {
    id: '5',
    name: 'Tanty Cuisine',
    email: 'tanty.repas@gmail.com',
    phone: '98 76 54 32',
    company: 'Restauration',
    address: 'Petit Marché',
    city: 'Niamey',
    zip: ''
  },
];

// Initial Mock Data Transactions (Micro montants < 20.000)
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '101', type: 'expense', amount: 1500, description: 'Sandwich & Café', category: 'Repas', date: '2023-10-25' },
  { id: '102', type: 'expense', amount: 2000, description: 'Course Taxi Centre', category: 'Transport', date: '2023-10-24' },
  { id: '103', type: 'income', amount: 5000, description: 'Vente T-shirt', category: 'Vente', date: '2023-10-22', client_id: '1' },
  { id: '104', type: 'expense', amount: 10000, description: 'Réparation Ventilateur', category: 'Maintenance', date: '2023-10-20' },
  { id: '105', type: 'income', amount: 15000, description: 'Dépannage Windows', category: 'Prestation', date: '2023-10-18', client_id: '4' },
  { id: '106', type: 'expense', amount: 5000, description: 'Forfait Internet Mois', category: 'Internet', date: '2023-10-15' },
  { id: '107', type: 'expense', amount: 2000, description: 'Achat Crédit Appel', category: 'Autre', date: '2023-10-01' },
  { id: '108', type: 'income', amount: 12000, description: 'Vente Accessoires', category: 'Vente', date: '2023-10-05', client_id: '3' },
  { id: '109', type: 'expense', amount: 500, description: 'Eau Minérale', category: 'Repas', date: '2023-10-26' },
  { id: '110', type: 'income', amount: 8000, description: 'Remboursement Prêt', category: 'Autre', date: '2023-10-27' },
];

const DRIVE_LINK = "https://drive.google.com/file/d/1yc39orlQY_9BXpje-9Ip3sBb7-2zkXB1/view?usp=drive_link";

const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-001', number: 'FAC-001', type: 'invoice', client: 'Boutique Salam', date: '2023-10-25', amount: 15000, status: 'paid', driveLink: DRIVE_LINK },
  { id: 'quo-001', number: 'DEV-001', type: 'quote', client: 'Moussa Taxi', date: '2023-10-24', amount: 5000, status: 'pending', driveLink: DRIVE_LINK },
  { id: 'inv-002', number: 'FAC-002', type: 'invoice', client: 'Sarah Coiffure', date: '2023-10-20', amount: 8500, status: 'sent', driveLink: DRIVE_LINK },
  { id: 'quo-002', number: 'DEV-002', type: 'quote', client: 'Ali Cyber', date: '2023-10-18', amount: 20000, status: 'draft', driveLink: DRIVE_LINK },
  { id: 'inv-003', number: 'FAC-003', type: 'invoice', client: 'Tanty Cuisine', date: '2023-10-15', amount: 12000, status: 'paid', driveLink: DRIVE_LINK },
];

// Mock Credit Book (Carnet de dettes < 20.000)
const MOCK_DEBTS: Debt[] = [
  { id: 'd1', type: 'receivable', person: 'Jean le Voisin', amount: 2000, dueDate: '2023-11-15', phone: '90000001', reason: 'Dépannage essence' },
  { id: 'd2', type: 'payable', person: 'Boutiquier du coin', amount: 1500, dueDate: '2023-11-10', phone: '90000002', reason: 'Pain et Lait' },
  { id: 'd3', type: 'receivable', person: 'Cousine Amina', amount: 5000, dueDate: '2023-11-05', phone: '90000003', reason: 'Achat Tissu' },
  { id: 'd4', type: 'payable', person: 'Resto la Paix', amount: 3000, dueDate: '2023-11-01', phone: '90000004', reason: 'Déjeuner crédit' },
  { id: 'd5', type: 'receivable', person: 'Collègue Paul', amount: 10000, dueDate: '2023-11-20', phone: '90000005', reason: 'Avance fin de mois' },
];

// Mock Recurring Charges (Petites charges fixes)
const MOCK_RECURRING: Recurring[] = [
  { id: 'r1', name: 'Abonnement Netflix', amount: 4500, frequency: 'monthly', nextDate: '2023-11-01', category: '📺 Divertissement', active: true },
  { id: 'r2', name: 'Forfait Appel', amount: 2000, frequency: 'weekly', nextDate: '2023-11-05', category: '📱 Internet', active: true },
  { id: 'r3', name: 'Salle de Sport', amount: 10000, frequency: 'monthly', nextDate: '2023-11-10', category: '📝 Autre', active: true },
  { id: 'r4', name: 'Cotisation Tontine', amount: 5000, frequency: 'weekly', nextDate: '2023-11-08', category: '💰 Épargne', active: true },
  { id: 'r5', name: 'Facture Eau', amount: 3500, frequency: 'monthly', nextDate: '2023-11-15', category: '💧 Eau', active: true },
];

// Simulated Async Service Clients
export const clientService = {
  getClients: async (): Promise<Client[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_CLIENTS]), 600);
    });
  },

  upsertClient: async (client: Client): Promise<Client> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(client);
      }, 400);
    });
  },

  deleteClient: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_CLIENTS.findIndex(c => c.id === id);
        if (index !== -1) MOCK_CLIENTS.splice(index, 1);
        resolve();
      }, 400);
    });
  }
};

// Simulated Async Service Transactions
export const transactionService = {
  getTransactions: async (type: 'income' | 'expense'): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_TRANSACTIONS.filter(t => t.type === type);
        resolve(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }, 500);
    });
  },

  addTransaction: async (transaction: Transaction): Promise<Transaction> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(transaction), 400);
    });
  },

  getDashboardStats: async () => {
    return new Promise<{
      totalBalance: number;
      monthlyIncome: number;
      monthlyExpense: number;
      recentTransactions: Transaction[];
      expenseDistribution: { category: string; amount: number; percentage: number; color: string }[];
    }>((resolve) => {
      setTimeout(() => {
        const income = MOCK_TRANSACTIONS.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = MOCK_TRANSACTIONS.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        // Sort by date desc
        const sorted = [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Mock distribution data for Donut Chart (Données cohérentes avec les petites dépenses)
        const expenseDistribution = [
          { category: 'Repas', amount: 8500, percentage: 40, color: '#f97316' }, // Orange
          { category: 'Internet', amount: 5000, percentage: 25, color: '#06b6d4' }, // Cyan
          { category: 'Transport', amount: 4000, percentage: 20, color: '#8b5cf6' }, // Purple
          { category: 'Autre', amount: 3500, percentage: 15, color: '#10b981' }, // Emerald
        ];

        resolve({
          totalBalance: income - expense, // Should be positive in this scenario
          monthlyIncome: income,
          monthlyExpense: expense,
          recentTransactions: sorted.slice(0, 4),
          expenseDistribution
        });
      }, 600);
    });
  }
};

// Simulated Invoice Service
export const invoiceService = {
  getInvoices: async (type: 'quote' | 'invoice'): Promise<Invoice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_INVOICES.filter(inv => inv.type === type);
        resolve(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }, 500);
    });
  }
};

// Simulated Credit Service
export const creditService = {
  getDebts: async (type: 'receivable' | 'payable'): Promise<Debt[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_DEBTS.filter(d => d.type === type);
        resolve(filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      }, 500);
    });
  }
};

// Simulated Recurring Service
export const recurringService = {
  getRecurringCharges: async (): Promise<Recurring[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_RECURRING].sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()));
      }, 500);
    });
  },
  toggleActive: async (id: string): Promise<void> => {
     return new Promise((resolve) => {
        setTimeout(() => {
           const item = MOCK_RECURRING.find(r => r.id === id);
           if(item) item.active = !item.active;
           resolve();
        }, 300);
     })
  }
};