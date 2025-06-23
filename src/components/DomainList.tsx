
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Domain } from '@/pages/Index';
import { Edit, Trash2, Plus } from 'lucide-react';

interface DomainListProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const DomainList: React.FC<DomainListProps> = ({ domains, onEdit, onDelete, onAdd }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'vendu': return 'bg-blue-100 text-blue-800';
      case 'expire': return 'bg-red-100 text-red-800';
      case 'en-vente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-lg sm:text-xl">Liste des Domaines</CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter un domaine</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        {/* Vue mobile - Cards */}
        <div className="block sm:hidden space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-semibold truncate">{domain.name}</h3>
                  <Badge className={`${getStatusColor(domain.status)} text-xs`}>
                    {domain.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Registrar: {domain.registrar}</div>
                  <div>Catégorie: {domain.category}</div>
                  <div>Expiration: {formatDate(domain.expirationDate)}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(domain)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(domain.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Vue desktop - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Nom de domaine</th>
                <th className="text-left p-4 font-medium">Registrar</th>
                <th className="text-left p-4 font-medium">Catégorie</th>
                <th className="text-left p-4 font-medium">Date d'expiration</th>
                <th className="text-left p-4 font-medium">Statut</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr key={domain.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{domain.name}</td>
                  <td className="p-4">{domain.registrar}</td>
                  <td className="p-4">{domain.category}</td>
                  <td className="p-4">{formatDate(domain.expirationDate)}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(domain.status)}>
                      {domain.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(domain)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(domain.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {domains.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun domaine enregistré. Cliquez sur "Ajouter un domaine" pour commencer.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainList;
