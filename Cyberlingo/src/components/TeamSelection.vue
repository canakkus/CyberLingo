<template>
  <main class="team-selection">
    <div class="team-cards-container">
      <h2>Wähle deine Seite</h2>
      <p class="subtitle">Entscheide dich für einen Lernpfad. Du kannst dies später jederzeit ändern.</p>
      
      <div class="teams-wrapper">
        <button class="team-card blue-team" @click="selectTeam('blue')">
          <div class="icon-placeholder">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="Blue Team Icon Placeholder" />
          </div>
          <h3>Blue Team</h3>
          <p>Verteidige Systeme, analysiere Bedrohungen und sichere Netzwerke ab.</p>
        </button>

        <button class="team-card red-team" @click="selectTeam('red')">
          <div class="icon-placeholder">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="Red Team Icon Placeholder" />
          </div>
          <h3>Red Team</h3>
          <p>Denke wie ein Angreifer, finde Schwachstellen und teste Systeme.</p>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
const emit = defineEmits(['team-selected'])

function selectTeam(team) {
  emit('team-selected', team)
}
</script>

<style scoped>
.team-selection {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.team-cards-container {
  text-align: center;
  width: 100%;
}

.team-cards-container h2 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 0.5rem;
  color: #f1f7ff;
}

.team-cards-container .subtitle {
  color: #a6bcdb;
  margin: 0 0 3.5rem;
  font-size: 1.15rem;
}

.teams-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 768px) {
  .teams-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.team-card {
  background: linear-gradient(180deg, rgba(16, 29, 51, 0.4), rgba(10, 18, 31, 0.8));
  border: 1px solid #243a5c;
  border-radius: 28px;
  padding: 3.5rem 2.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  font: inherit;
  color: inherit;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.icon-placeholder {
  width: 140px;
  height: 140px;
  background-color: #050a14;
  border-radius: 24px;
  border: 2px dashed #2f496f;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

.icon-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.4s ease;
}

.team-card h3 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #f1f7ff;
  transition: color 0.4s ease;
}

.team-card p {
  color: #95afcf;
  margin: 0;
  line-height: 1.6;
  font-size: 1.05rem;
  transition: color 0.4s ease;
}

/* Blue Team Hover Effects */
.blue-team {
  border-color: rgba(31, 179, 156, 0.2);
}

.blue-team:hover {
  transform: translateY(-8px);
  border-color: #1fb39c;
  box-shadow: 0 20px 50px rgba(31, 179, 156, 0.15), 0 0 0 1px rgba(31, 179, 156, 0.5);
  background: linear-gradient(180deg, rgba(19, 59, 74, 0.8), rgba(10, 18, 31, 0.95));
}

.blue-team:hover .icon-placeholder {
  border-color: #1fb39c;
  box-shadow: 0 0 30px rgba(31, 179, 156, 0.3);
  transform: scale(1.05);
}

.blue-team:hover .icon-placeholder img {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(31, 179, 156, 0.5));
}

.blue-team:hover h3 {
  color: #53c7b5;
  text-shadow: 0 0 20px rgba(31, 179, 156, 0.4);
}

.blue-team:hover p {
  color: #c0d8f0;
}

.blue-team:active {
  transform: translateY(-2px);
}

/* Red Team Hover Effects */
.red-team {
  border-color: rgba(226, 88, 110, 0.2);
}

.red-team:hover {
  transform: translateY(-8px);
  border-color: #e2586e;
  box-shadow: 0 20px 50px rgba(226, 88, 110, 0.15), 0 0 0 1px rgba(226, 88, 110, 0.5);
  background: linear-gradient(180deg, rgba(74, 25, 36, 0.8), rgba(10, 18, 31, 0.95));
}

.red-team:hover .icon-placeholder {
  border-color: #e2586e;
  box-shadow: 0 0 30px rgba(226, 88, 110, 0.3);
  transform: scale(1.05);
}

.red-team:hover .icon-placeholder img {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(226, 88, 110, 0.5));
}

.red-team:hover h3 {
  color: #f77e91;
  text-shadow: 0 0 20px rgba(226, 88, 110, 0.4);
}

.red-team:hover p {
  color: #fbe0e4;
}

.red-team:active {
  transform: translateY(-2px);
}
</style>
