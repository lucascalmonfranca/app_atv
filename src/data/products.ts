export interface Product {
  id: string;
  name: string;
  category: 'impressoras' | 'materiais' | 'pecas' | 'downloads';
  description: string;
  image?: string;
  fileFormat?: 'STL' | '3MF' | 'PDF';
  fileSize?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Impressora 3D - H2D Combo Tri - 220V - Bambu Lab',
    category: 'impressoras',
    description: 'Treinamento Ao Vivo Grátis',
  },
  {
    id: '2',
    name: 'Impressora 3D Creality K2 Plus Combo',
    category: 'impressoras',
    description: '1002110032I High Precision',
  },
  {
    id: '3',
    name: 'Filamento Voolt3D PETG Outlet 1Kg',
    category: 'materiais',
    description: 'Para Impressora 3D - Alta Resistência',
  },
  {
    id: '4',
    name: 'Branco Pug Cachorro Impressão 3D Objeto Decorativo',
    category: 'pecas',
    description: 'Modelo decorativo detalhado estilo pug.',
    fileFormat: 'STL',
    fileSize: '12.4 MB',
  },
  {
    id: '5',
    name: 'Boneco Estátua Patolino 20cm Impressão 3D',
    category: 'downloads',
    description: 'Looney Tunes Gama - Ficheiro pronto para impressão.',
    fileFormat: '3MF',
    fileSize: '18.1 MB',
  },
];