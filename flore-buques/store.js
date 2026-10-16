(function (root) {
  'use strict';
  const products = [
    { id: 'jardim-lilas', name: 'Jardim Lilás', category: 'especiais', price: 16990, image: 'jardim-lilas.webp', subtitle: 'Rosas brancas & flores lilás', description: 'Um encontro delicado entre rosas brancas e flores em tons de lilás. Uma composição romântica para transformar um gesto simples em uma lembrança especial.', includes: ['Rosas brancas', 'Flores lilás', 'Folhagens'], alt: 'Arranjo de rosas brancas e flores lilás, em vaso de vidro com laço roxo' },
    { id: 'rosas-rubi', name: 'Rosas Rubi', category: 'rosas', price: 12990, image: 'rosas-rubi.webp', subtitle: 'Rosas vermelhas & delicadeza', description: 'O clássico que fala por si. Rosas vermelhas, pequenos detalhes lilás e folhagens dão forma a uma declaração de carinho cheia de intensidade.', includes: ['Rosas vermelhas', 'Flores delicadas', 'Folhagens'], alt: 'Buquê de rosas vermelhas e pequenas flores lilás em vaso de vidro' },
    { id: 'doce-encanto', name: 'Doce Encanto', category: 'campo', price: 11990, image: 'doce-encanto.webp', subtitle: 'Flores brancas & toques de rosa', description: 'Leve, alegre e cheio de ternura. Flores brancas se misturam a rosas cor-de-rosa em uma composição que combina com aniversários, agradecimentos e pequenos mimos.', includes: ['Rosas rosadas', 'Flores brancas', 'Folhagens'], alt: 'Buquê com rosas cor-de-rosa, margaridas brancas e folhagens em vaso transparente' },
    { id: 'rosas-de-afeto', name: 'Rosas de Afeto', category: 'rosas', price: 13990, image: 'rosas-de-afeto.webp', subtitle: 'Rosas rosadas & pequenos detalhes', description: 'Rosas em tons delicados de rosa acompanhadas por pequenas flores e folhagens. Uma forma suave de dizer: você faz parte dos meus melhores dias.', includes: ['Rosas rosadas', 'Flores delicadas', 'Folhagens'], alt: 'Rosas cor-de-rosa com pequenas flores brancas em vaso alto de vidro' },
    { id: 'serenidade', name: 'Serenidade', category: 'lirios', price: 17990, image: 'serenidade.webp', subtitle: 'Lírios brancos & rosas suaves', description: 'A elegância dos lírios brancos encontra o charme das rosas em tons suaves. Uma combinação serena, feita para celebrar momentos que merecem cuidado.', includes: ['Lírios brancos', 'Rosas suaves', 'Folhagens'], alt: 'Arranjo com lírios brancos e rosas rosa-claro em vaso de vidro' },
    { id: 'amor-em-cores', name: 'Amor em Cores', category: 'rosas', price: 15990, image: 'amor-em-cores.webp', subtitle: 'Rosas em tons de rosa & vermelho', description: 'Um jardim de sentimentos em uma só composição. Rosas em tons de vermelho, rosa e lilás para quem gosta de demonstrar afeto com presença e cor.', includes: ['Rosas vermelhas', 'Rosas rosadas', 'Folhagens'], alt: 'Buquê de rosas vermelhas, rosa e lilás em um vaso pequeno de vidro' },
    { id: 'luz-do-dia', name: 'Luz do Dia', category: 'especiais', price: 14990, image: 'luz-do-dia.webp', subtitle: 'Rosas claras & tons de pêssego', description: 'Tons de creme, amarelo suave e pêssego em uma composição acolhedora. Uma pequena dose de luz para presentear quem deixa os seus dias mais bonitos.', includes: ['Rosas claras', 'Tons de pêssego', 'Folhagens'], alt: 'Arranjo de rosas creme, amarelo-claro e pêssego em vaso arredondado' },
    { id: 'jardim-primavera', name: 'Jardim de Primavera', category: 'campo', price: 18990, image: 'jardim-primavera.webp', subtitle: 'Flores mistas & cores da estação', description: 'Uma composição vibrante com flores amarelas, rosadas e lilás. A energia de um jardim em flor para celebrar recomeços e espalhar bons sentimentos.', includes: ['Flores mistas', 'Cores da estação', 'Folhagens'], alt: 'Arranjo de flores amarelas, rosa e lilás, incluindo tulipas e hortênsias' }
  ];
  const categories = [
    { id: 'rosas', name: 'Rosas', note: 'Amor em cada pétala', image: 'rosas-rubi.webp' },
    { id: 'lirios', name: 'Lírios', note: 'Leveza e elegância', image: 'serenidade.webp' },
    { id: 'campo', name: 'Do campo', note: 'Cores que abraçam', image: 'jardim-primavera.webp' },
    { id: 'especiais', name: 'Especiais', note: 'Para surpreender', image: 'jardim-lilas.webp' }
  ];
  const productMap = new Map(products.map(product => [product.id, product]));
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  const clampQuantity = value => Math.max(0, Math.min(99, Math.floor(Number(value) || 0)));
  function sanitizeCart(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const clean = {};
    for (const product of products) {
      const quantity = Object.prototype.hasOwnProperty.call(value, product.id) ? clampQuantity(value[product.id]) : 0;
      if (quantity > 0) clean[product.id] = quantity;
    }
    return clean;
  }
  function sanitizeFavorites(value) {
    return Array.isArray(value) ? [...new Set(value.filter(id => productMap.has(id)))] : [];
  }
  function cartLines(cart) {
    return Object.entries(sanitizeCart(cart)).map(([id, quantity]) => ({ product: productMap.get(id), quantity, total: productMap.get(id).price * quantity }));
  }
  const cartTotal = cart => cartLines(cart).reduce((sum, line) => sum + line.total, 0);
  const cartCount = cart => cartLines(cart).reduce((sum, line) => sum + line.quantity, 0);
  function selectProducts({ query = '', category = 'all', sort = 'featured', favorites = null } = {}) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const selected = products.filter(product => {
      const haystack = normalize([product.name, product.subtitle, product.description, ...product.includes].join(' '));
      return (category === 'all' || product.category === category)
        && (!favorites || favorites.includes(product.id))
        && terms.every(term => haystack.includes(term));
    });
    if (sort === 'price-asc') selected.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') selected.sort((a, b) => b.price - a.price);
    if (sort === 'name') selected.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return selected;
  }
  const api = { products, categories, productMap, money, clampQuantity, sanitizeCart, sanitizeFavorites, cartLines, cartTotal, cartCount, selectProducts };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FloreStore = api;
})(globalThis);
