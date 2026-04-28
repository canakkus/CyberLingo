<template>
  <main class="store-page">
    <div class="store-container">

      <!-- Header -->
      <header class="store-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <div class="header-center">
          <h1>Shop</h1>
          <p class="store-subtitle">Passe deinen Avatar an</p>
        </div>
        <div class="coins-display">
          <img :src="lingcoinImg" alt="Lingcoin" class="lingcoin-icon spinning" />
          <span class="coins-amount">{{ authStore.userStats.coins ?? 0 }}</span>
        </div>
      </header>

      <!-- Preview Card -->
      <div class="avatar-preview-card">
        <div class="preview-label">Vorschau</div>
        <div class="preview-avatar-wrap">
          <div class="preview-avatar" :class="'team-' + team">
            <span v-if="previewAvatar === 'av-default'" class="avatar-initial">{{ userInitial }}</span>
            <span v-else class="avatar-emoji">{{ getItemEmoji(previewAvatar) }}</span>
            <span v-if="previewAccessory" class="avatar-accessory">{{ getItemEmoji(previewAccessory) }}</span>
          </div>
          <div class="preview-names">
            <span class="preview-avatar-name">{{ getItemName(previewAvatar) }}</span>
            <span v-if="previewAccessory" class="preview-acc-name">+ {{ getItemName(previewAccessory) }}</span>
          </div>
        </div>
        <button v-if="previewChanged" class="apply-btn" @click="applyEquip">
          ✓ Ausrüsten
        </button>
      </div>

      <!-- Tabs -->
      <div class="store-tabs">
        <button class="store-tab" :class="{ active: activeTab === 'avatars' }" @click="activeTab = 'avatars'">
          <span>🎭</span> Avatare
        </button>
        <button class="store-tab" :class="{ active: activeTab === 'accessories' }" @click="activeTab = 'accessories'">
          <span>👑</span> Accessoires
        </button>
      </div>

      <!-- Items Grid -->
      <TransitionGroup name="grid-fade" tag="div" class="items-grid">
        <div
          v-for="item in displayedItems"
          :key="item.id"
          class="item-card"
          :class="{
            owned: isOwned(item.id),
            equipped: isEquipped(item.id),
            previewing: isPreviewing(item.id),
            locked: !isOwned(item.id) && item.price > 0
          }"
          @click="handleItemClick(item)"
        >
          <!-- Equipped Badge -->
          <div v-if="isEquipped(item.id)" class="equipped-badge">✓ Ausgerüstet</div>
          <!-- Previewing Badge -->
          <div v-else-if="isPreviewing(item.id)" class="previewing-badge">👁 Vorschau</div>

          <div class="item-icon">
            <span v-if="item.id === 'av-default'" class="default-icon">{{ userInitial }}</span>
            <span v-else class="item-emoji">{{ item.emoji }}</span>
          </div>

          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>

          <div class="item-footer">
            <template v-if="item.price === 0 || isOwned(item.id)">
              <button
                class="item-btn equip-btn"
                :class="{ active: isEquipped(item.id) }"
                @click.stop="handleItemClick(item)"
              >
                {{ isEquipped(item.id) ? '✓ Ausgerüstet' : 'Vorschau' }}
              </button>
            </template>
            <template v-else>
              <div class="price-tag">
                <img :src="lingcoinImg" alt="LC" class="lingcoin-icon-sm" />
                <span>{{ item.price }}</span>
              </div>
              <button
                class="item-btn buy-btn"
                :disabled="(authStore.userStats.coins ?? 0) < item.price"
                @click.stop="initiatePurchase(item)"
              >
                Kaufen
              </button>
            </template>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Purchase Confirmation Modal -->
    <Transition name="modal-pop">
      <div v-if="buyConfirm.show" class="modal-overlay" @click.self="buyConfirm.show = false">
        <div class="modal-card">
          <div class="modal-icon">{{ buyConfirm.item?.emoji }}</div>
          <h2>{{ buyConfirm.item?.name }} kaufen?</h2>
          <p class="modal-desc">{{ buyConfirm.item?.description }}</p>
          <div class="modal-price">
            <img :src="lingcoinImg" alt="LC" class="lingcoin-icon spinning" />
            <span>{{ buyConfirm.item?.price }} Ling-Coins</span>
          </div>
          <div class="modal-balance">
            Guthaben: {{ authStore.userStats.coins ?? 0 }} → {{ (authStore.userStats.coins ?? 0) - (buyConfirm.item?.price ?? 0) }}
          </div>
          <div class="modal-actions">
            <button class="modal-cancel" @click="buyConfirm.show = false">Abbrechen</button>
            <button class="modal-confirm" :disabled="buying" @click="confirmBuy">
              {{ buying ? '...' : 'Kaufen ✓' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition name="toast-slide">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { authStore } from '../authStore'
import lingcoinImg from '../assets/lingcoin.png'

defineEmits(['go-back'])

const team = computed(() => authStore.profile.team || 'blue')
const userInitial = computed(() => {
  const name = authStore.profile.display_name
    || authStore.user?.user_metadata?.display_name
    || authStore.user?.email?.split('@')[0]
    || 'A'
  return name.charAt(0).toUpperCase()
})

// ── Store data ──────────────────────────────────────────────
const AVATARS = [
  { id: 'av-default',  type: 'avatar',    name: 'Standard',     emoji: null,  price: 0,   description: 'Dein Standard-Buchstaben-Avatar' },
  { id: 'av-knight',   type: 'avatar',    name: 'Ritter',       emoji: '⚔️',  price: 100, description: 'Mutig und furchtlos im Kampf' },
  { id: 'av-shield',   type: 'avatar',    name: 'Wächter',      emoji: '🛡️',  price: 150, description: 'Verteidiger des Netzwerks' },
  { id: 'av-hacker',   type: 'avatar',    name: 'Hacker',       emoji: '👾',  price: 200, description: 'Elite Penetration Tester' },
  { id: 'av-ninja',    type: 'avatar',    name: 'Ninja',        emoji: '🥷',  price: 220, description: 'Leise, letal, unsichtbar' },
  { id: 'av-skull',    type: 'avatar',    name: 'Phantom',      emoji: '💀',  price: 250, description: 'Anonym und gefährlich' },
  { id: 'av-bot',      type: 'avatar',    name: 'Cyber Bot',    emoji: '🤖',  price: 180, description: 'KI-gesteuerter Hacker-Bot' },
  { id: 'av-dragon',   type: 'avatar',    name: 'Drache',       emoji: '🐉',  price: 350, description: 'Mächtig und unaufhaltbar' },
]

const ACCESSORIES = [
  { id: 'ac-crown',    type: 'accessory', name: 'Goldkrone',    emoji: '👑',  price: 75,  description: 'Für wahre Champions' },
  { id: 'ac-hat',      type: 'accessory', name: 'Zylinder',     emoji: '🎩',  price: 60,  description: 'Der Gentleman-Hacker' },
  { id: 'ac-glasses',  type: 'accessory', name: 'Cyberbrille',  emoji: '🕶️',  price: 50,  description: 'Sieh die Matrix' },
  { id: 'ac-laurel',   type: 'accessory', name: 'Lorbeerkranz', emoji: '🌿',  price: 80,  description: 'Für den ewigen Sieger' },
  { id: 'ac-halo',     type: 'accessory', name: 'Heiligenschein',emoji: '😇', price: 120, description: 'Unschuldig? Wirklich?' },
  { id: 'ac-fire',     type: 'accessory', name: 'Flammen-Aura', emoji: '🔥',  price: 100, description: 'Du bist am Brennen' },
  { id: 'ac-star',     type: 'accessory', name: 'Sternenstaub', emoji: '✨',  price: 90,  description: 'Leuchte wie ein Stern' },
  { id: 'ac-lightning',type: 'accessory', name: 'Blitz',        emoji: '⚡',  price: 110, description: 'Schnell wie der Blitz' },
]

const ALL_ITEMS = [...AVATARS, ...ACCESSORIES]

const activeTab = ref('avatars')
const displayedItems = computed(() => activeTab.value === 'avatars' ? AVATARS : ACCESSORIES)

// ── Preview state ───────────────────────────────────────────
const previewAvatar = ref(authStore.userStats.equipped_avatar || 'av-default')
const previewAccessory = ref(authStore.userStats.equipped_accessory || null)

const previewChanged = computed(() => {
  return previewAvatar.value !== (authStore.userStats.equipped_avatar || 'av-default')
    || previewAccessory.value !== (authStore.userStats.equipped_accessory || null)
})

// ── Helpers ─────────────────────────────────────────────────
function getItemEmoji(id) {
  return ALL_ITEMS.find(i => i.id === id)?.emoji ?? ''
}
function getItemName(id) {
  return ALL_ITEMS.find(i => i.id === id)?.name ?? ''
}
function isOwned(id) {
  if (id === 'av-default') return true
  return authStore.userStats.owned_items?.includes(id) ?? false
}
function isEquipped(id) {
  return authStore.userStats.equipped_avatar === id || authStore.userStats.equipped_accessory === id
}
function isPreviewing(id) {
  return (previewAvatar.value === id && id !== authStore.userStats.equipped_avatar)
    || (previewAccessory.value === id && id !== authStore.userStats.equipped_accessory)
}

// ── Item click (preview if owned, buy if not) ───────────────
function handleItemClick(item) {
  if (!isOwned(item.id)) {
    initiatePurchase(item)
    return
  }
  if (item.type === 'avatar') {
    previewAvatar.value = item.id
  } else {
    previewAccessory.value = previewAccessory.value === item.id ? null : item.id
  }
}

async function applyEquip() {
  if (previewAvatar.value !== (authStore.userStats.equipped_avatar || 'av-default')) {
    await authStore.equipItem(previewAvatar.value, 'avatar')
  }
  if (previewAccessory.value !== (authStore.userStats.equipped_accessory || null)) {
    await authStore.equipItem(previewAccessory.value, 'accessory')
  }
  showToast('✓ Ausrüstung gespeichert!')
}

// ── Purchase ────────────────────────────────────────────────
const buyConfirm = reactive({ show: false, item: null })
const buying = ref(false)
const toastMsg = ref('')

function initiatePurchase(item) {
  buyConfirm.item = item
  buyConfirm.show = true
}

async function confirmBuy() {
  if (!buyConfirm.item) return
  buying.value = true
  const ok = await authStore.buyItem(buyConfirm.item.id, buyConfirm.item.price)
  buying.value = false
  buyConfirm.show = false
  if (ok) {
    showToast(`🎉 ${buyConfirm.item.name} gekauft!`)
    // Auto-preview the newly purchased item
    if (buyConfirm.item.type === 'avatar') previewAvatar.value = buyConfirm.item.id
    else previewAccessory.value = buyConfirm.item.id
  } else {
    showToast('❌ Nicht genug Ling-Coins!')
  }
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 2800)
}
</script>

<style scoped>
.store-page {
  min-height: 100vh;
  padding: 2rem 1.5rem 4rem;
  background: var(--bg-main);
}

.store-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ── Header ── */
.store-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-center {
  flex: 1;
  text-align: center;
}

.store-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  margin: 0;
  color: var(--text-primary);
  background: linear-gradient(135deg, #f5b731, #e8950a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.store-subtitle {
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.back-btn:hover {
  background: var(--bg-card-alt);
  color: var(--text-primary);
  border-color: var(--accent-teal);
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(245,183,49,0.15), rgba(232,149,10,0.08));
  border: 1px solid rgba(245,183,49,0.35);
  border-radius: 14px;
  padding: 0.5rem 1rem;
  white-space: nowrap;
}

.coins-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5b731;
}

/* ── Lingcoin icon ── */
.lingcoin-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(245,183,49,0.5));
}

.lingcoin-icon-sm {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(245,183,49,0.5));
}

@keyframes coinSpin {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(90deg) scale(0.85); }
  100% { transform: rotateY(0deg); }
}

.spinning {
  animation: coinSpin 2.5s ease-in-out infinite;
}

/* ── Preview Card ── */
.avatar-preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 8px 24px var(--card-shadow);
}

.preview-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.preview-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.preview-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 3px var(--border-color), 0 8px 24px var(--card-shadow);
}

.preview-avatar.team-blue {
  background: linear-gradient(135deg, #1e3a5f, #1a6b8a);
  box-shadow: 0 0 0 3px rgba(31,179,156,0.4), 0 8px 24px rgba(31,179,156,0.2);
}

.preview-avatar.team-red {
  background: linear-gradient(135deg, #5f1e1e, #8a2a1a);
  box-shadow: 0 0 0 3px rgba(226,88,110,0.4), 0 8px 24px rgba(226,88,110,0.2);
}

.avatar-initial {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
}

.avatar-emoji {
  font-size: 2.8rem;
  line-height: 1;
}

.avatar-accessory {
  position: absolute;
  top: -14px;
  right: -8px;
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  animation: accessoryFloat 2s ease-in-out infinite;
}

@keyframes accessoryFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50%       { transform: translateY(-4px) rotate(3deg); }
}

.preview-names {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.preview-avatar-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.preview-acc-name {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.apply-btn {
  margin-left: auto;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #f5b731, #e8950a);
  border: none;
  border-radius: 14px;
  color: #1a0f00;
  font-family: 'Work Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 16px rgba(245,183,49,0.35);
}

.apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(245,183,49,0.5);
}

/* ── Tabs ── */
.store-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.store-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.store-tab:hover {
  color: var(--text-primary);
  background: var(--bg-card-alt);
}

.store-tab.active {
  background: linear-gradient(135deg, rgba(245,183,49,0.18), rgba(232,149,10,0.08));
  border-color: rgba(245,183,49,0.4);
  color: #f5b731;
  box-shadow: 0 4px 16px rgba(245,183,49,0.12);
}

/* ── Items Grid ── */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.25rem;
}

.item-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-4px);
  border-color: rgba(245,183,49,0.35);
  box-shadow: 0 12px 28px var(--card-shadow);
}

.item-card.equipped {
  border-color: #f5b731;
  background: linear-gradient(135deg, rgba(245,183,49,0.1), rgba(232,149,10,0.05));
  box-shadow: 0 0 0 2px rgba(245,183,49,0.3), 0 8px 20px rgba(245,183,49,0.1);
}

.item-card.previewing {
  border-color: var(--accent-teal);
  background: linear-gradient(135deg, rgba(31,179,156,0.08), transparent);
}

.item-card.locked:hover {
  border-color: rgba(245,183,49,0.35);
}

.equipped-badge, .previewing-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.equipped-badge {
  background: rgba(245,183,49,0.2);
  color: #f5b731;
  border: 1px solid rgba(245,183,49,0.4);
}

.previewing-badge {
  background: rgba(31,179,156,0.15);
  color: var(--accent-teal);
  border: 1px solid rgba(31,179,156,0.3);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  align-self: center;
  transition: transform 0.2s ease;
}

.item-card:hover .item-icon {
  transform: scale(1.08) rotate(-3deg);
}

.item-emoji {
  font-size: 2.2rem;
  line-height: 1;
}

.default-icon {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-teal);
}

.item-info h3 {
  margin: 0 0 0.25rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: var(--text-primary);
}

.item-info p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f5b731;
}

.item-btn {
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.buy-btn {
  background: linear-gradient(135deg, #f5b731, #e8950a);
  color: #1a0f00;
  border: none;
  margin-left: auto;
}

.buy-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(245,183,49,0.4);
}

.buy-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.equip-btn {
  background: var(--bg-card-alt);
  border-color: var(--border-color);
  color: var(--text-secondary);
  width: 100%;
}

.equip-btn.active {
  background: rgba(245,183,49,0.15);
  border-color: rgba(245,183,49,0.4);
  color: #f5b731;
}

.equip-btn:hover {
  background: rgba(31,179,156,0.1);
  border-color: var(--accent-teal);
  color: var(--accent-teal);
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid rgba(245,183,49,0.3);
  border-radius: 28px;
  padding: 2.5rem 2rem;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,183,49,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  font-size: 4rem;
  margin-bottom: 0.25rem;
  animation: modalIconBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIconBounce {
  from { transform: scale(0) rotate(-15deg); }
  to   { transform: scale(1) rotate(0deg); }
}

.modal-card h2 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.modal-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(245,183,49,0.15), rgba(232,149,10,0.08));
  border: 1px solid rgba(245,183,49,0.3);
  border-radius: 12px;
  padding: 0.6rem 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: #f5b731;
}

.modal-balance {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}

.modal-cancel, .modal-confirm {
  flex: 1;
  padding: 0.8rem;
  border-radius: 14px;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-cancel {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.modal-cancel:hover {
  background: var(--bg-card-alt);
  color: var(--text-primary);
}

.modal-confirm {
  background: linear-gradient(135deg, #f5b731, #e8950a);
  border: none;
  color: #1a0f00;
}

.modal-confirm:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(245,183,49,0.45);
}

.modal-confirm:disabled {
  opacity: 0.6;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.85rem 1.75rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  z-index: 2000;
  white-space: nowrap;
}

/* ── Transitions ── */
.modal-pop-enter-active { animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-leave-active { animation: modalIn 0.2s ease reverse; }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}

.toast-slide-enter-active { animation: toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-leave-active { animation: toastIn 0.2s ease reverse; }
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.grid-fade-enter-active, .grid-fade-leave-active { transition: all 0.2s ease; }
.grid-fade-enter-from, .grid-fade-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 600px) {
  .avatar-preview-card { flex-wrap: wrap; }
  .apply-btn { width: 100%; margin-left: 0; }
  .items-grid { grid-template-columns: 1fr 1fr; }
}
</style>
