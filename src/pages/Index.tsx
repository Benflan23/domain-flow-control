import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import DomainList from '@/components/DomainList';
import AddDomainModal from '@/components/AddDomainModal';
import BulkDomainManager from '@/components/BulkDomainManager';
import EvaluationSection from '@/components/EvaluationSection';
import ROIStatistics from '@/components/ROIStatistics';
import SalesHistory from '@/components/SalesHistory';
import Settings from '@/components/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  category: string;
  purchaseDate: string;
  expirationDate: string;
  status: 'actif' | 'vendu' | 'expire' | 'en-vente';
  purchasePrice?: number;
  salePrice?: number;
  saleDate?: string;
  buyer?: string;
}

export interface Evaluation {
  id: string;
  domainId: string;
  tool: string;
  date: string;
  estimatedValue: number;
}

export interface Sale {
  id: string;
  domainName: string;
  saleDate: string;
  salePrice: number;
  buyer: string;
}

const Index = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'exemple.com',
      registrar: 'GoDaddy',
      category: 'Business',
      purchaseDate: '2023-01-15',
      expirationDate: '2024-12-15',
      status: 'actif',
      purchasePrice: 15
    },
    {
      id: '2',
      name: 'monsite.fr',
      registrar: 'OVH',
      category: 'Personnel',
      purchaseDate: '2023-03-20',
      expirationDate: '2025-02-20',
      status: 'vendu',
      purchasePrice: 12,
      salePrice: 150,
      saleDate: '2024-01-10',
      buyer: 'Jean Dupont'
    }
  ]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: '1',
      domainId: '1',
      tool: 'GoDaddy',
      date: '2024-01-15',
      estimatedValue: 120
    }
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      domainName: 'monsite.fr',
      saleDate: '2024-01-10',
      salePrice: 150,
      buyer: 'Jean Dupont'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

  const [customLists, setCustomLists] = useState({
    registrars: ['GoDaddy', 'OVH', 'Namecheap', 'Gandi'],
    categories: ['Business', 'Personnel', 'E-commerce', 'Blog', 'Portfolio'],
    evaluationTools: ['Atom', 'DNRater', 'GoDaddy', 'Autre']
  });

  const addDomain = (domain: Omit<Domain, 'id'>) => {
    const newDomain: Domain = {
      ...domain,
      id: Date.now().toString()
    };
    setDomains([...domains, newDomain]);
  };

  const addMultipleDomains = (newDomains: Omit<Domain, 'id'>[]) => {
    const domainsWithIds: Domain[] = newDomains.map((domain, index) => ({
      ...domain,
      id: (Date.now() + index).toString()
    }));
    setDomains([...domains, ...domainsWithIds]);
  };

  const updateDomain = (updatedDomain: Domain) => {
    setDomains(domains.map(domain => 
      domain.id === updatedDomain.id ? updatedDomain : domain
    ));
  };

  const deleteDomain = (id: string) => {
    setDomains(domains.filter(domain => domain.id !== id));
    setEvaluations(evaluations.filter(evaluation => evaluation.domainId !== id));
  };

  const addEvaluation = (evaluation: Omit<Evaluation, 'id'>) => {
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now().toString()
    };
    setEvaluations([...evaluations, newEvaluation]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Gestion de Domaines
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            Gérez votre portefeuille de noms de domaine efficacement
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-0.5 p-1">
            <TabsTrigger value="dashboard" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="hidden sm:inline">Tableau de bord</span>
              <span className="sm:hidden truncate">Board</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="truncate">Domaines</span>
            </TabsTrigger>
            <TabsTrigger value="import-export" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="hidden sm:inline">Import/Export</span>
              <span className="sm:hidden truncate">Import/Export</span>
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="hidden sm:inline">Évaluation</span>
              <span className="sm:hidden truncate">Evaluation</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="hidden sm:inline">Statistiques</span>
              <span className="sm:hidden truncate">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="truncate">Ventes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-[10px] xs:text-xs sm:text-sm px-1 py-2 min-w-0">
              <span className="hidden sm:inline">Paramètres</span>
              <span className="sm:hidden truncate">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard domains={domains} sales={sales} />
          </TabsContent>

          <TabsContent value="domains">
            <DomainList
              domains={domains}
              onEdit={setEditingDomain}
              onDelete={deleteDomain}
              onAdd={() => setIsAddModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="import-export">
            <BulkDomainManager
              domains={domains}
              onImportDomains={addMultipleDomains}
              registrars={customLists.registrars}
              categories={customLists.categories}
            />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationSection
              domains={domains}
              evaluations={evaluations}
              onAddEvaluation={addEvaluation}
              evaluationTools={customLists.evaluationTools}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <ROIStatistics domains={domains} sales={sales} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesHistory sales={sales} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings
              customLists={customLists}
              onUpdateLists={setCustomLists}
            />
          </TabsContent>
        </Tabs>

        <AddDomainModal
          isOpen={isAddModalOpen || !!editingDomain}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingDomain(null);
          }}
          onSave={editingDomain ? updateDomain : addDomain}
          domain={editingDomain}
          registrars={customLists.registrars}
          categories={customLists.categories}
        />
      </div>
    </div>
  );
};

export default Index;
