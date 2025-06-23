
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Domain } from '@/pages/Index';
import { FileUp, FileDown, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface BulkDomainManagerProps {
  domains: Domain[];
  onImportDomains: (domains: Omit<Domain, 'id'>[]) => void;
  registrars: string[];
  categories: string[];
}

const BulkDomainManager: React.FC<BulkDomainManagerProps> = ({
  domains,
  onImportDomains,
  registrars,
  categories
}) => {
  const [bulkText, setBulkText] = useState('');
  const { toast } = useToast();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(domains.map(domain => ({
      'Nom de domaine': domain.name,
      'Registrar': domain.registrar,
      'Catégorie': domain.category,
      'Date d\'achat': domain.purchaseDate,
      'Date d\'expiration': domain.expirationDate,
      'Statut': domain.status,
      'Prix d\'achat': domain.purchasePrice || 0,
      'Prix de vente': domain.salePrice || 0,
      'Date de vente': domain.saleDate || '',
      'Acheteur': domain.buyer || ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Domaines');
    
    XLSX.writeFile(workbook, `domaines_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export réussi",
      description: `${domains.length} domaines exportés vers Excel`
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedDomains: Omit<Domain, 'id'>[] = jsonData.map((row: any) => {
          const calculateExpirationDate = (purchaseDate: string) => {
            if (!purchaseDate) return new Date().toISOString().split('T')[0];
            const date = new Date(purchaseDate);
            date.setFullYear(date.getFullYear() + 1);
            return date.toISOString().split('T')[0];
          };

          const purchaseDate = row['Date d\'achat'] || new Date().toISOString().split('T')[0];
          
          return {
            name: row['Nom de domaine'] || '',
            registrar: registrars.includes(row['Registrar']) ? row['Registrar'] : registrars[0] || 'GoDaddy',
            category: categories.includes(row['Catégorie']) ? row['Catégorie'] : categories[0] || 'Business',
            purchaseDate,
            expirationDate: row['Date d\'expiration'] || calculateExpirationDate(purchaseDate),
            status: ['actif', 'vendu', 'expire', 'en-vente'].includes(row['Statut']) ? row['Statut'] : 'actif',
            purchasePrice: parseFloat(row['Prix d\'achat']) || 0,
            salePrice: parseFloat(row['Prix de vente']) || 0,
            saleDate: row['Date de vente'] || '',
            buyer: row['Acheteur'] || ''
          };
        }).filter(domain => domain.name);

        onImportDomains(importedDomains);
        
        toast({
          title: "Import réussi",
          description: `${importedDomains.length} domaines importés depuis Excel`
        });
        
        // Reset input
        event.target.value = '';
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Impossible de lire le fichier Excel. Vérifiez le format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkTextImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split('\n');
    const importedDomains: Omit<Domain, 'id'>[] = lines.map(line => {
      const domain = line.trim();
      if (!domain) return null;

      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expirationDate = nextYear.toISOString().split('T')[0];

      return {
        name: domain,
        registrar: registrars[0] || 'GoDaddy',
        category: categories[0] || 'Business',
        purchaseDate: today,
        expirationDate,
        status: 'actif' as const,
        purchasePrice: 0,
        salePrice: 0,
        saleDate: '',
        buyer: ''
      };
    }).filter(Boolean) as Omit<Domain, 'id'>[];

    if (importedDomains.length > 0) {
      onImportDomains(importedDomains);
      setBulkText('');
      
      toast({
        title: "Import réussi",
        description: `${importedDomains.length} domaines ajoutés en bulk`
      });
    }
  };

  const downloadTemplate = () => {
    const template = [{
      'Nom de domaine': 'exemple.com',
      'Registrar': 'GoDaddy',
      'Catégorie': 'Business',
      'Date d\'achat': '2024-01-01',
      'Date d\'expiration': '2025-01-01',
      'Statut': 'actif',
      'Prix d\'achat': 15,
      'Prix de vente': 0,
      'Date de vente': '',
      'Acheteur': ''
    }];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    XLSX.writeFile(workbook, 'template_domaines.xlsx');
    
    toast({
      title: "Template téléchargé",
      description: "Utilisez ce fichier comme modèle pour l'import"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export des domaines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Exportez tous vos domaines vers un fichier Excel
          </p>
          <Button onClick={exportToExcel} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Exporter vers Excel ({domains.length} domaines)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import depuis Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Importez des domaines depuis un fichier Excel
          </p>
          <div className="space-y-2">
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <FileDown className="h-4 w-4 mr-2" />
              Télécharger le template Excel
            </Button>
            <div>
              <Label htmlFor="excel-file">Sélectionner un fichier Excel</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajout en bulk (texte)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Ajoutez plusieurs domaines en une fois (un domaine par ligne)
          </p>
          <div>
            <Label htmlFor="bulk-text">Liste des domaines</Label>
            <Textarea
              id="bulk-text"
              placeholder="exemple.com&#10;monsite.fr&#10;autredomaine.net"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleBulkTextImport} 
            disabled={!bulkText.trim()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Ajouter les domaines
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkDomainManager;
