
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Domain } from '@/pages/Index';

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domain: Domain | Omit<Domain, 'id'>) => void;
  domain?: Domain | null;
  registrars: string[];
  categories: string[];
}

const AddDomainModal: React.FC<AddDomainModalProps> = ({
  isOpen,
  onClose,
  onSave,
  domain,
  registrars,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    registrar: '',
    category: '',
    purchaseDate: '',
    status: 'actif' as const,
    purchasePrice: 0
  });

  useEffect(() => {
    if (domain) {
      setFormData({
        name: domain.name,
        registrar: domain.registrar,
        category: domain.category,
        purchaseDate: domain.purchaseDate,
        status: domain.status,
        purchasePrice: domain.purchasePrice || 0
      });
    } else {
      setFormData({
        name: '',
        registrar: '',
        category: '',
        purchaseDate: '',
        status: 'actif',
        purchasePrice: 0
      });
    }
  }, [domain, isOpen]);

  const calculateExpirationDate = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    purchase.setMonth(purchase.getMonth() + 11);
    return purchase.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expirationDate = calculateExpirationDate(formData.purchaseDate);
    
    const domainData = {
      ...formData,
      expirationDate,
      ...(domain && { id: domain.id })
    };

    onSave(domainData as Domain);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {domain ? 'Modifier le domaine' : 'Ajouter un nouveau domaine'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de domaine</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="exemple.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="registrar">Registrar</Label>
            <Select value={formData.registrar} onValueChange={(value) => setFormData({ ...formData, registrar: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un registrar" />
              </SelectTrigger>
              <SelectContent>
                {registrars.map((registrar) => (
                  <SelectItem key={registrar} value={registrar}>
                    {registrar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purchaseDate">Date d'achat</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="purchasePrice">Prix d'achat (€)</Label>
            <Input
              id="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Domain['status'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="en-vente">En vente</SelectItem>
                <SelectItem value="vendu">Vendu</SelectItem>
                <SelectItem value="expire">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.purchaseDate && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Date d'expiration calculée :</strong> {calculateExpirationDate(formData.purchaseDate)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                (Date d'achat + 11 mois)
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {domain ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainModal;
