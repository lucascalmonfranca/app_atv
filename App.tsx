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
  Instagram,
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
import { COMPANY_CONFIG } from './src/config/company';
import { PRODUCTS } from './src/data/products';
import { ImagePlaceholder } from './src/components/ImagePlaceholder';

// Interface para os itens do carrinho
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Interface para downloads salvos
interface DownloadedFile {
  id: string;
  name: string;
  date: string;
  size: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'menu' | 'category' | 'contacts' | 'about'
  >('splash');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estado do Carrinho de Compras
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado dos Downloads Salvos
  const [savedDownloads, setSavedDownloads] = useState<DownloadedFile[]>([]);
  const [activeDownloadTab, setActiveDownloadTab] = useState<'available' | 'saved'>('available');

  const openCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentScreen('category');
  };

  // Função para adicionar produto ao carrinho
  const addToCart = (productName: string, price: number = 150) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === productName);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: Date.now().toString(), name: productName, price, quantity: 1 }];
    });
    Alert.alert('Sucesso!', `${productName} foi adicionado ao seu carrinho.`);
  };

  // Funções para alterar quantidade no carrinho
  const updateQuantity = (id: string, amount: number) => {
    setCart((prevCart) =>
      prevCart
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
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Função para simular o download e guardar na aba de downloads
  const handleDownload = (itemName: string) => {
    const isAlreadySaved = savedDownloads.some((file) => file.name === itemName);
    if (!isAlreadySaved) {
      const newFile: DownloadedFile = {
        id: Date.now().toString(),
        name: itemName,
        date: new Date().toLocaleDateString('pt-BR'),
        size: '15.4 MB',
      };
      setSavedDownloads((prev) => [newFile, ...prev]);
    }
    Alert.alert('Download Concluído', `O ficheiro "${itemName}" foi salvo na aba de Downloads.`);
  };

  // Cálculo total do carrinho
  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 1. Tela Inicial (Splash Screen)
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
      {/* Topo / Cabeçalho com Atalhos para Carrinho e Downloads */}
      <View style={styles.header}>
        {currentScreen !== 'menu' && (
          <TouchableOpacity onPress={() => setCurrentScreen('menu')} style={styles.backButton}>
            <ArrowLeft color="#172033" size={24} />
          </TouchableOpacity>
        )}

        <Image
          source={require('./assets/logo.jpg')}
          style={styles.headerLogo}
          resizeMode="contain"
        />

        {/* Ícones do Cabeçalho */}
        <View style={styles.headerIconsContainer}>
          {/* Ícone de Downloads */}
          <TouchableOpacity
            style={styles.iconBadgeBtn}
            onPress={() => {
              setSelectedCategory('downloads');
              setCurrentScreen('category');
              setActiveDownloadTab('saved');
            }}
          >
            <Download color="#173B82" size={22} />
            {savedDownloads.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedDownloads.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Ícone do Carrinho */}
          <TouchableOpacity style={styles.iconBadgeBtn} onPress={() => setIsCartOpen(true)}>
            <ShoppingCart color="#173B82" size={22} />
            {totalCartItems > 0 && (
              <View style={[styles.badge, { backgroundColor: '#20C55A' }]}>
                <Text style={styles.badgeText}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo Navegável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Menu Principal */}
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

        {/* Categorias e Produtos */}
        {currentScreen === 'category' && (
          <View>
            <Text style={styles.categoryTitle}>{selectedCategory}</Text>

            {/* Sub-abas na tela de Downloads (Arquivos para baixar x Salvos) */}
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
                    Disponíveis
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
                    Meus Downloads ({savedDownloads.length})
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Lista de Ficheiros Salvos (Aba Salvos) */}
            {selectedCategory === 'downloads' && activeDownloadTab === 'saved' ? (
              <View>
                {savedDownloads.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <FolderDown size={48} color="#FFFFFF" />
                    <Text style={styles.emptyText}>Nenhum download efetuado ainda.</Text>
                  </View>
                ) : (
                  savedDownloads.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <View style={styles.savedFileHeader}>
                        <CheckCircle2 color="#20C55A" size={20} />
                        <Text style={styles.productName}>{item.name}</Text>
                      </View>
                      <Text style={styles.productDesc}>
                        Baixado em: {item.date} • Tamanho: {item.size}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ) : (
              /* Lista de Produtos Normais / Arquivos para Download */
              PRODUCTS.map((prod) => (
                <View key={prod.id} style={styles.card}>
                  <ImagePlaceholder label={`Foto de ${prod.name}`} />
                  <Text style={styles.productName}>{prod.name}</Text>
                  <Text style={styles.productDesc}>{prod.description}</Text>

                  {/* Ações da aba de Downloads */}
                  {selectedCategory === 'downloads' ? (
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      onPress={() => handleDownload(prod.name)}
                    >
                      <Download color="#FFFFFF" size={18} style={{ marginRight: 6 }} />
                      <Text style={styles.downloadBtnText}>Baixar Modelo 3D</Text>
                    </TouchableOpacity>
                  ) : (
                    /* Botão de Comprar/Carrinho para Produtos */
                    <TouchableOpacity
                      style={styles.buyBtn}
                      onPress={() => addToCart(prod.name)}
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

        {/* Tela de Contatos */}
        {currentScreen === 'contacts' && (
          <View style={styles.contactContainer}>
            <Text style={styles.categoryTitle}>Contatos</Text>

            <TouchableOpacity
              style={[styles.pillBtn, { backgroundColor: '#25D366' }]}
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
              <Instagram color="#FFFFFF" size={24} />
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

        {/* Tela Sobre */}
        {currentScreen === 'about' && (
          <View style={styles.card}>
            <Text style={styles.categoryTitle}>Sobre a 3D Impressões</Text>
            <Text style={styles.aboutText}>{COMPANY_CONFIG.aboutText}</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL / ABA DO CARRINHO DE COMPRAS */}
      <Modal visible={isCartOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShoppingCart color="#173B82" size={24} />
                <Text style={styles.modalTitle}>Meu Carrinho</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)}>
                <Text style={styles.closeModalText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>O seu carrinho está vazio.</Text>
              ) : (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>

                    {/* Controle de Quantidade */}
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={14} color="#172033" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={14} color="#172033" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={{ marginLeft: 10 }}
                    >
                      <Trash2 color="#FF4D4D" size={20} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Total e Botão de Finalizar */}
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
                    Alert.alert(
                      'Pedido Enviado',
                      'O seu pedido foi registrado! Entraremos em contato via WhatsApp.'
                    );
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
    backgroundColor: '#2854B5',
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
  },
  backButton: {
    marginRight: 8,
  },
  headerLogo: {
    height: 40,
    width: 130,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 12,
  },
  productDesc: {
    fontSize: 14,
    color: '#697386',
    marginTop: 4,
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
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutText: {
    fontSize: 14,
    color: '#172033',
    lineHeight: 22,
  },
  // SUB-ABAS DE DOWNLOADS
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
    fontSize: 16,
    marginTop: 12,
  },
  savedFileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // MODAL DO CARRINHO
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
  cartItemName: {
    fontSize: 14,
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
    fontSize: 14,
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