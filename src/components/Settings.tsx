
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Plus, X } from 'lucide-react';

interface SettingsProps {
  customLists: {
    registrars: string[];
    categories: string[];
    evaluationTools: string[];
  };
  onUpdateLists: (lists: {
    registrars: string[];
    categories: string[];
    evaluationTools: string[];
  }) => void;
}

const Settings: React.FC<SettingsProps> = ({ customLists, onUpdateLists }) => {
  const [newItems, setNewItems] = useState({
    registrar: '',
    category: '',
    evaluationTool: ''
  });

  const addItem = (listType: 'registrars' | 'categories' | 'evaluationTools', value: string) => {
    if (value.trim() && !customLists[listType].includes(value.trim())) {
      const newLists = {
        ...customLists,
        [listType]: [...customLists[listType], value.trim()]
      };
      onUpdateLists(newLists);
      
      const key = listType === 'registrars' ? 'registrar' : 
                  listType === 'categories' ? 'category' : 'evaluationTool';
      setNewItems({ ...newItems, [key]: '' });
    }
  };

  const removeItem = (listType: 'registrars' | 'categories' | 'evaluationTools', value: string) => {
    const newLists = {
      ...customLists,
      [listType]: customLists[listType].filter(item => item !== value)
    };
    onUpdateLists(newLists);
  };

  const ListManager: React.FC<{
    title: string;
    items: string[];
    listType: 'registrars' | 'categories' | 'evaluationTools';
    newValue: string;
    onNewValueChange: (value: string) => void;
  }> = ({ title, items, listType, newValue, onNewValueChange }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => onNewValueChange(e.target.value)}
              placeholder={`Nouveau ${title.toLowerCase()}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem(listType, newValue);
                }
              }}
            />
            <Button onClick={() => addItem(listType, newValue)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-2">
                {item}
                <button
                  onClick={() => removeItem(listType, item)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          {items.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun élément configuré</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Paramètres Personnalisables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Gérez vos listes personnalisées pour les registrars, catégories et outils d'évaluation.
            Ces listes seront utilisées dans les formulaires de l'application.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListManager
          title="Registrars"
          items={customLists.registrars}
          listType="registrars"
          newValue={newItems.registrar}
          onNewValueChange={(value) => setNewItems({ ...newItems, registrar: value })}
        />

        <ListManager
          title="Catégories"
          items={customLists.categories}
          listType="categories"
          newValue={newItems.category}
          onNewValueChange={(value) => setNewItems({ ...newItems, category: value })}
        />

        <ListManager
          title="Outils d'Évaluation"
          items={customLists.evaluationTools}
          listType="evaluationTools"
          newValue={newItems.evaluationTool}
          onNewValueChange={(value) => setNewItems({ ...newItems, evaluationTool: value })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Les éléments ajoutés via "Autre" dans les formulaires seront automatiquement sauvegardés ici</p>
            <p>• Vous pouvez supprimer les éléments en cliquant sur le X à côté de chaque badge</p>
            <p>• Ces paramètres sont conservés localement dans votre navigateur</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
