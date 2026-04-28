export const AVATARS = [
  { id: 'av-default',  type: 'avatar',    name: 'Standard',      emoji: null,  price: 0,   description: 'Dein Standard-Buchstaben-Avatar' },
  { id: 'av-knight',   type: 'avatar',    name: 'Ritter',        emoji: '⚔️',  price: 100, description: 'Mutig und furchtlos im Kampf' },
  { id: 'av-shield',   type: 'avatar',    name: 'Wächter',       emoji: '🛡️',  price: 150, description: 'Verteidiger des Netzwerks' },
  { id: 'av-hacker',   type: 'avatar',    name: 'Hacker',        emoji: '👾',  price: 200, description: 'Elite Penetration Tester' },
  { id: 'av-ninja',    type: 'avatar',    name: 'Ninja',         emoji: '🥷',  price: 220, description: 'Leise, letal, unsichtbar' },
  { id: 'av-skull',    type: 'avatar',    name: 'Phantom',       emoji: '💀',  price: 250, description: 'Anonym und gefährlich' },
  { id: 'av-bot',      type: 'avatar',    name: 'Cyber Bot',     emoji: '🤖',  price: 180, description: 'KI-gesteuerter Hacker-Bot' },
  { id: 'av-dragon',   type: 'avatar',    name: 'Drache',        emoji: '🐉',  price: 350, description: 'Mächtig und unaufhaltbar' },
]

export const ACCESSORIES = [
  { id: 'ac-crown',    type: 'accessory', name: 'Goldkrone',      emoji: '👑',  price: 75,  description: 'Für wahre Champions' },
  { id: 'ac-hat',      type: 'accessory', name: 'Zylinder',       emoji: '🎩',  price: 60,  description: 'Der Gentleman-Hacker' },
  { id: 'ac-glasses',  type: 'accessory', name: 'Cyberbrille',    emoji: '🕶️',  price: 50,  description: 'Sieh die Matrix' },
  { id: 'ac-laurel',   type: 'accessory', name: 'Lorbeerkranz',   emoji: '🌿',  price: 80,  description: 'Für den ewigen Sieger' },
  { id: 'ac-halo',     type: 'accessory', name: 'Heiligenschein', emoji: '😇',  price: 120, description: 'Unschuldig? Wirklich?' },
  { id: 'ac-fire',     type: 'accessory', name: 'Flammen-Aura',   emoji: '🔥',  price: 100, description: 'Du bist am Brennen' },
  { id: 'ac-star',     type: 'accessory', name: 'Sternenstaub',   emoji: '✨',  price: 90,  description: 'Leuchte wie ein Stern' },
  { id: 'ac-lightning',type: 'accessory', name: 'Blitz',          emoji: '⚡',  price: 110, description: 'Schnell wie der Blitz' },
]

export const ALL_ITEMS = [...AVATARS, ...ACCESSORIES]

export function getItemEmoji(id) {
  return ALL_ITEMS.find(i => i.id === id)?.emoji ?? null
}

export function getItemName(id) {
  return ALL_ITEMS.find(i => i.id === id)?.name ?? ''
}
