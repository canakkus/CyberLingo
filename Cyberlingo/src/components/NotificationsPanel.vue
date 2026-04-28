<template>
  <Teleport to="body">
    <Transition name="panel-fade">
      <div v-if="open" class="notif-overlay" @click.self="$emit('close')">
        <div class="notif-panel">
          <div class="notif-header">
            <h2>Benachrichtigungen</h2>
            <div class="notif-header-actions">
              <button v-if="store.unreadCount > 0" class="mark-read-btn" @click="store.markAllRead()">
                Alle gelesen
              </button>
              <button class="close-btn" @click="$emit('close')">✕</button>
            </div>
          </div>

          <div v-if="store.items.length === 0" class="notif-empty">
            <span class="empty-icon">🔔</span>
            <p>Keine Benachrichtigungen</p>
          </div>

          <div v-else class="notif-list">
            <div
              v-for="notif in store.items"
              :key="notif.id"
              class="notif-item"
              :class="{ unread: !notif.read, [`type-${notif.type}`]: true }"
            >
              <span class="notif-icon">{{ notif.icon }}</span>
              <div class="notif-body">
                <p class="notif-title">{{ notif.title }}</p>
                <p class="notif-msg">{{ notif.message }}</p>
                <span class="notif-time">{{ formatTime(notif.time) }}</span>
              </div>
              <button class="notif-dismiss" @click="store.remove(notif.id)">✕</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { notificationStore as store } from '../notificationStore.js'

defineProps({ open: Boolean })
defineEmits(['close'])

function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffMin = Math.floor((now - d) / 60000)
  if (diffMin < 1) return 'Gerade eben'
  if (diffMin < 60) return `Vor ${diffMin} Min.`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `Vor ${diffH} Std.`
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}
</script>

<style scoped>
.notif-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
}

.notif-panel {
  position: fixed;
  top: 0;
  left: 296px;
  width: 340px;
  max-height: 100vh;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.notif-header h2 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.notif-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mark-read-btn {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-teal);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;
}
.mark-read-btn:hover { background: var(--accent-teal-glow); }

.close-btn {
  width: 28px;
  height: 28px;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.close-btn:hover { color: var(--text-primary); background: var(--nav-btn-hover); }

.notif-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon { font-size: 2.5rem; opacity: 0.5; }
.notif-empty p { margin: 0; font-size: 0.9rem; }

.notif-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid transparent;
  transition: background 0.15s;
  position: relative;
}

.notif-item.unread {
  background: var(--bg-card-alt);
  border-color: var(--border-color);
}

.notif-item.type-streak_lost.unread {
  background: rgba(226, 88, 110, 0.07);
  border-color: rgba(226, 88, 110, 0.25);
}

.notif-item.type-streak_warning.unread {
  background: rgba(243, 156, 18, 0.07);
  border-color: rgba(243, 156, 18, 0.25);
}

.notif-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  margin: 0 0 0.2rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.notif-msg {
  margin: 0 0 0.3rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.notif-time {
  font-size: 0.72rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.notif-dismiss {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.notif-item:hover .notif-dismiss { opacity: 1; }

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.2s ease;
}
.panel-fade-enter-active .notif-panel,
.panel-fade-leave-active .notif-panel {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}
.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
}
.panel-fade-enter-from .notif-panel,
.panel-fade-leave-to .notif-panel {
  transform: translateX(-20px);
}

@media (max-width: 900px) {
  .notif-panel {
    left: 0;
    width: 100%;
    max-height: 70vh;
    top: auto;
    bottom: 0;
    border-radius: 20px 20px 0 0;
    border-right: none;
    border-top: 1px solid var(--border-color);
  }
}
</style>
