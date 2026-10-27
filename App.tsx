import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  MessageCircle,
  Camera,
  Phone,
  Download,
  ChevronRight,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  FolderDown,
  Plus,
  Minus,
} from 'lucide-react-native';

// Importação das configurações da empresa
import { COMPANY_CONFIG } from './src/config/company';

// Interface para Itens do Carrinho
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

// Interface para Downloads Efetuados
interface DownloadedFile {
  id: string;
  name: string;
  date: string;
  size: string;
  image: any;
}

// Mapeamento dos Produtos com Imagens Reais do Projeto
const LOCAL_PRODUCTS = [
  // --- IMPRESSORAS ---
  {
    id: 'imp-1',
    name: 'Impressora 3D - H2D Combo Tri - 220V - Bambu Lab',
    category: 'impressoras',
    description: 'Treinamento Ao Vivo Grátis',
    image: require('./assets/impre1.webp'),
    price: 8500,
  },
  {
    id: 'imp-2',
    name: 'Impressora 3D Creality K2 Plus Combo',
    category: 'impressoras',
    description: '1002110032I High Precision',
    image: require('./assets/impre2.webp'),
    price: 7900,
  },
  {
    id: 'imp-3',
    name: 'Impressora 3D Filamento Flashforge Guider 3 Ultra',
    category: 'impressoras',
    description: 'Estrutura fechada de alta precisão industrial.',
    image: require('./assets/impre5.webp'),
    price: 12500,
  },
  {
    id: 'imp-4',
    name: 'IMPRESSORA 3D SNAPMAKER U1',
    category: 'impressoras',
    description: 'Tecnologia modular avançada para múltiplos materiais.',
    image: require('./assets/imre4.webp'),
    price: 9400,
  },

  // --- MATERIAIS ---
  {
    id: 'mat-1',
    name: 'Filamento Voolt3D PETG Outlet 1Kg para Impressora 3D',
    category: 'materiais',
    description: 'Filamento Roxo - Alta resistência mecânica.',
    image: require('./assets/mat1.webp'),
    price: 89.9,
  },
  {
    id: 'mat-2',
    name: 'Filamento Voolt3D PETG Outlet 1Kg para Impressora 3D',
    category: 'materiais',
    description: 'Filamento Vermelho - Acabamento brilhante e resistente.',
    image: require('./assets/mat2.jpg'),
    price: 89.9,
  },
  {
    id: 'mat-3',
    name: 'Filamento Para Impressora 3D - PLA Preto Velvet - 1Kg - 1,75mm',
    category: 'materiais',
    description: 'PLA Preto Velvet Voolt3D com excelente facilidade de impressão.',
    image: require('./assets/mat3.webp'),
    price: 95.0,
  },

  // --- PEÇAS / PRODUTOS ---
  {
    id: 'pec-1',
    name: 'Branco Pug Cachorro Impressão 3D Objeto Decorativo',
    category: 'pecas',
    description: 'Modelo decorativo detalhado estilo pug.',
    image: require('./assets/pro1.webp'),
    fileFormat: 'STL',
    fileSize: '12.4 MB',
    price: 45.0,
  },
  {
    id: 'pec-2',
    name: 'Boneco Estátua Patolino 20cm Impressão 3d Looney Tunes Gama',
    category: 'pecas',
    description: 'Colecionável clássico da turma Looney Tunes.',
    image: require('./assets/pro2.webp'),
    fileFormat: '3MF',
    fileSize: '18.1 MB',
    price: 65.0,
  },
  {
    id: 'pec-3',
    name: 'Escultura Minimalista - Serendipidade - Impressora 3D',
    category: 'pecas',
    description: 'Arte moderna para decoração e design de interiores.',
    image: require('./assets/pro4.webp'),
    fileFormat: 'STL',
    fileSize: '9.8 MB',
    price: 80.0,
  },
  {
    id: 'pec-4',
    name: 'Escultura Geométrica Lobo / Husky Siberiano Impressão 3d Make Art3D',
    category: 'pecas',
    description: 'Geometria refinada em impressão 3D de alta definição.',
    image: require('./assets/pro5.webp'),
    fileFormat: '3MF',
    fileSize: '14.2 MB',
    price: 75.0,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'menu' | 'category' | 'contacts' | 'about'
  >('splash');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estados do Carrinho de Compras
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados dos Downloads Salvos
  const [savedDownloads, setSavedDownloads] = useState<DownloadedFile[]>([]);
  const [activeDownloadTab, setActiveDownloadTab] = useState<'available' | 'saved'>('available');

  const openCategory = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentScreen('category');
  };

  // Adicionar Item ao Carrinho
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.name === product.name);
      if (existing) {
        return prevCart.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: Date.now().toString(),
          name: product.name,
          price: product.price || 100,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    Alert.alert('Adicionado!', `"${product.name}" foi adicionado ao carrinho.`);
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Simulação de Download
  const handleDownload = (product: any) => {
    const isAlreadySaved = savedDownloads.some((file) => file.name === product.name);
    if (!isAlreadySaved) {
      const newFile: DownloadedFile = {
        id: Date.now().toString(),
        name: product.name,
        date: new Date().toLocaleDateString('pt-BR'),
        size: product.fileSize || '15.0 MB',
        image: product.image,
      };
      setSavedDownloads((prev) => [newFile, ...prev]);
    }
    Alert.alert('Download Concluído', `O modelo 3D de "${product.name}" foi salvo na aba de Downloads.`);
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtragem dos Produtos por Categoria Selecionada
  const getFilteredProducts = () => {
    if (!selectedCategory) return [];
    if (selectedCategory === 'Nossas Impressoras') return LOCAL_PRODUCTS.filter((p) => p.category === 'impressoras');
    if (selectedCategory === 'Nossos Materiais') return LOCAL_PRODUCTS.filter((p) => p.category === 'materiais');
    if (selectedCategory === 'Nossas Peças') return LOCAL_PRODUCTS.filter((p) => p.category === 'pecas');
    if (selectedCategory === 'downloads') return LOCAL_PRODUCTS.filter((p) => p.category === 'pecas');
    return [];
  };

  // 1. TELA DE SPLASH (INICIAL)
  if (currentScreen === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('./assets/logo.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.enterButton} onPress={() => setCurrentScreen('menu')}>
          <Text style={styles.enterButtonText}>entrar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO COM BOTÃO VOLTAR (←) E ATALHOS */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (currentScreen === 'menu') setCurrentScreen('splash');
            else setCurrentScreen('menu');
          }}
          style={styles.circleBackButton}
        >
          <ArrowLeft color="#172033" size={20} />
        </TouchableOpacity>

        {currentScreen === 'menu' && (
          <Image
            source={require('./assets/logo.jpg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        )}

        <View style={styles.headerIconsContainer}>
          {/* Botão Atalho para Downloads */}
          <TouchableOpacity
            style={styles.iconBadgeBtn}
            onPress={() => {
              setSelectedCategory('downloads');
              setCurrentScreen('category');
              setActiveDownloadTab('saved');
            }}
          >
            <Download color="#173B82" size={20} />
            {savedDownloads.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedDownloads.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Botão Atalho para o Carrinho */}
          <TouchableOpacity style={styles.iconBadgeBtn} onPress={() => setIsCartOpen(true)}>
            <ShoppingCart color="#173B82" size={20} />
            {totalCartItems > 0 && (
              <View style={[styles.badge, { backgroundColor: '#20C55A' }]}>
                <Text style={styles.badgeText}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2. TELA MENU PRINCIPAL */}
        {currentScreen === 'menu' && (
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem} onPress={() => openCategory('Nossas Impressoras')}>
              <Text style={styles.menuText}>Nossas Impressoras</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openCategory('Nossos Materiais')}>
              <Text style={styles.menuText}>Nossos Materiais</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openCategory('Nossas Peças')}>
              <Text style={styles.menuText}>Nossas Peças</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => openCategory('downloads')}>
              <Text style={styles.menuText}>downloads</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentScreen('contacts')}>
              <Text style={styles.menuText}>Contatos</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentScreen('about')}>
              <Text style={styles.menuText}>Um pouco sobre a empresa</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        )}

        {/* 3, 4, 5, 6. TELAS DE CATEGORIAS / PRODUTOS / DOWNLOADS */}
        {currentScreen === 'category' && (
          <View>
            <Text style={styles.categoryTitle}>{selectedCategory}</Text>

            {/* Alternador de Abas dentro de Downloads */}
            {selectedCategory === 'downloads' && (
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeDownloadTab === 'available' && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveDownloadTab('available')}
                >
                  <Download
                    size={16}
                    color={activeDownloadTab === 'available' ? '#FFFFFF' : '#173B82'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeDownloadTab === 'available' && styles.activeTabText,
                    ]}
                  >
                    Modelos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeDownloadTab === 'saved' && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveDownloadTab('saved')}
                >
                  <FolderDown
                    size={16}
                    color={activeDownloadTab === 'saved' ? '#FFFFFF' : '#173B82'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeDownloadTab === 'saved' && styles.activeTabText,
                    ]}
                  >
                    Salvos ({savedDownloads.length})
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Renderização da Lista de Downloads Salvos */}
            {selectedCategory === 'downloads' && activeDownloadTab === 'saved' ? (
              <View>
                {savedDownloads.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <FolderDown size={48} color="#FFFFFF" />
                    <Text style={styles.emptyText}>Nenhum modelo baixado até o momento.</Text>
                  </View>
                ) : (
                  savedDownloads.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <Image source={item.image} style={styles.realProductImage} resizeMode="contain" />
                      <View style={styles.savedFileHeader}>
                        <CheckCircle2 color="#20C55A" size={20} />
                        <Text style={styles.productName}>{item.name}</Text>
                      </View>
                      <Text style={styles.productDesc}>
                        Baixado em: {item.date} • {item.size}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ) : (
              /* Renderização dos Produtos das Categorias */
              getFilteredProducts().map((prod) => (
                <View key={prod.id} style={styles.card}>
                  <Image source={prod.image} style={styles.realProductImage} resizeMode="contain" />
                  <Text style={styles.productName}>{prod.name}</Text>
                  <Text style={styles.productDesc}>{prod.description}</Text>
                  <Text style={styles.productPrice}>R$ {prod.price.toFixed(2)}</Text>

                  {selectedCategory === 'downloads' ? (
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      onPress={() => handleDownload(prod)}
                    >
                      <Download color="#FFFFFF" size={18} style={{ marginRight: 6 }} />
                      <Text style={styles.downloadBtnText}>downloads</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.buyBtn}
                      onPress={() => addToCart(prod)}
                    >
                      <ShoppingCart color="#FFFFFF" size={18} style={{ marginRight: 6 }} />
                      <Text style={styles.buyBtnText}>Comprar / Adicionar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* 7. TELA DE CONTATOS */}
        {currentScreen === 'contacts' && (
          <View style={styles.contactContainer}>
            <Text style={styles.categoryTitle}>Contatos</Text>

            <TouchableOpacity
              style={[styles.pillBtn, { backgroundColor: '#20C55A' }]}
              onPress={() => Linking.openURL(`https://wa.me/${COMPANY_CONFIG.whatsappNumber}`)}
            >
              <Text style={styles.pillText}>whatsapp</Text>
              <MessageCircle color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pillBtn, { backgroundColor: '#E1306C' }]}
              onPress={() => Linking.openURL(`https://instagram.com`)}
            >
              <Text style={styles.pillText}>Instagram</Text>
              <Camera color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pillBtn, { backgroundColor: '#00A8E8' }]}
              onPress={() => Linking.openURL(`tel:${COMPANY_CONFIG.phone}`)}
            >
              <Text style={styles.pillText}>Telefone</Text>
              <Phone color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* 8. TELA SOBRE A EMPRESA */}
        {currentScreen === 'about' && (
          <View style={styles.card}>
            <Text style={styles.aboutTitle}>Sobre a 3D Impressões</Text>
            <Text style={styles.aboutText}>{COMPANY_CONFIG.aboutText}</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL DO CARRINHO DE COMPRAS */}
      <Modal visible={isCartOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShoppingCart color="#173B82" size={22} />
                <Text style={styles.modalTitle}>Meu Carrinho</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)}>
                <Text style={styles.closeModalText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>O seu carrinho está vazio no momento.</Text>
              ) : (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartItemRow}>
                    <Image source={item.image} style={styles.cartItemThumb} resizeMode="cover" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cartItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.cartItemPrice}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.qtyContainer}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                        <Minus size={14} color="#172033" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                        <Plus size={14} color="#172033" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={{ marginLeft: 8 }}>
                      <Trash2 color="#FF4D4D" size={20} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>R$ {totalCartPrice.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    setIsCartOpen(false);
                    Alert.alert('Pedido Confirmado!', 'Recebemos o seu pedido. Entraremos em contato via WhatsApp!');
                    setCart([]);
                  }}
                >
                  <Text style={styles.checkoutBtnText}>Finalizar Pedido</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoWrapper: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  enterButton: {
    backgroundColor: '#173B82',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 40,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#2854B5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  circleBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#172033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    height: 38,
    width: 130,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadgeBtn: {
    position: 'relative',
    padding: 6,
    backgroundColor: '#E8F0FF',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2854B5',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: '#173B82',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  realProductImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#F5F7FB',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 10,
  },
  productDesc: {
    fontSize: 13,
    color: '#697386',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2854B5',
    marginTop: 6,
  },
  buyBtn: {
    backgroundColor: '#2854B5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  downloadBtn: {
    backgroundColor: '#20C55A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contactContainer: {
    gap: 16,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 13,
    color: '#172033',
    lineHeight: 20,
    textAlign: 'justify',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#173B82',
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#173B82',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 12,
  },
  savedFileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0FF',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#173B82',
  },
  closeModalText: {
    color: '#697386',
    fontWeight: 'bold',
  },
  emptyCartText: {
    textAlign: 'center',
    color: '#697386',
    marginVertical: 30,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F7FB',
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#2854B5',
    fontWeight: '600',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  cartFooter: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F0FF',
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20C55A',
  },
  checkoutBtn: {
    backgroundColor: '#20C55A',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});