/**
 * Recupera a ordem do localStorage.
 */
export function getOrderFromLocalStorage() {
  try {
    const raw = localStorage.getItem('order');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('❌ Erro ao ler ordem do localStorage:', e);
    return null;
  }
}

/**
 * Limpa a ordem e o ID sequencial do localStorage.
 */
export function clearOrderFromLocalStorage() {
  localStorage.removeItem('order');
  localStorage.removeItem('order_last_id');
  console.log('🗑️ Ordem removida do localStorage.');
}

/**
 * Salva ou atualiza uma ordem no localStorage com validações.
 */
export function saveOrderToLocalStorage({ status = 'pending', items = [] }) {
  console.log('🟡 [saveOrderToLocalStorage] Iniciando...');
  console.log('📥 Parâmetros recebidos:', { status, items });

  // 1. Validação de itens
  if (!Array.isArray(items) || items.length === 0) {
    console.warn('❌ Nenhum item válido para salvar na ordem.');
    return null;
  }

  const validItems = items.filter((item) => Number(item?.price) > 0 && Number(item?.quantity) > 0);

  if (validItems.length === 0) {
    console.warn('❌ Todos os itens são inválidos. Ordem não salva.');
    return null;
  }

  // 2. Recupera ordem existente
  const existingOrder = JSON.parse(localStorage.getItem('order') || 'null');
  console.log('📦 Ordem existente:', existingOrder);

  const itemMap = new Map();

  // 3. Mescla com itens já existentes
  if (existingOrder?.items?.length) {
    for (const item of existingOrder.items) {
      itemMap.set(item.id, { ...item });
    }

    for (const item of validItems) {
      if (itemMap.has(item.id)) {
        const existing = itemMap.get(item.id);
        existing.quantity += item.quantity;
        itemMap.set(item.id, existing);
        console.log(`➕ Atualizado item existente:`, existing);
      } else {
        itemMap.set(item.id, item);
        console.log(`🆕 Item novo adicionado:`, item);
      }
    }
  } else {
    for (const item of validItems) {
      itemMap.set(item.id, item);
      console.log(`🆕 Nova ordem - item adicionado:`, item);
    }
  }

  // 4. Calcula total
  const mergedItems = Array.from(itemMap.values());
  const total = mergedItems.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);
  console.log('💰 Total da ordem recalculado:', total);

  // 5. Geração de ID sequencial
  let nextId = existingOrder?.id;
  if (!nextId) {
    const lastId = parseInt(localStorage.getItem('order_last_id') || '0', 10);
    nextId = String(lastId + 1).padStart(4, '0');
    localStorage.setItem('order_last_id', String(lastId + 1));
  }

  // 6. Monta a ordem
  const order = {
    id: nextId,
    status: existingOrder?.status || 'pending',
    created_at: existingOrder?.created_at || new Date().toISOString(),
    total,
    items: mergedItems
  };

  // 7. Evita sobrescrever se nada mudou
  const existingString = JSON.stringify(existingOrder || {});
  const newString = JSON.stringify(order);
  if (existingString === newString) {
    console.log('⚠️ Ordem não modificada. Nenhuma alteração foi salva.');
    return order;
  }

  // 8. Salva
  localStorage.setItem('order', JSON.stringify(order));
  console.log('✅ Ordem FINAL salva no localStorage:', order);

  return order;
}
