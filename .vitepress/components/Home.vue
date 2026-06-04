<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero" style="background-image: url('/chip-bg.jpg')">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="name">Sunky</span>
        </h1>
        <div class="typewriter">
          <span class="typewriter-text">{{displayText}}</span>
          <span class="cursor">|</span>
        </div>
        <div class="social-links">
          <a href="https://github.com/Sunnk" target="_blank" rel="noopener" class="social-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-grid">
        <!-- 项目作品 -->
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>项目作品</h3>
          <div class="feature-links">
            <a href="/tlp-viewer/" class="feature-link">
              <span>TLP Viewer</span>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const texts = [
  '01001000 01100101 01101100',
  'aHR0cHM6Ly9naXRo',
  '>>> import this',
  'Segmentation fault (core dumped)',
  'sudo rm -rf /',
  'FATAL: no bootable medium',
  '0xDEADBEEF',
  '<!DOCTYPE html>',
  'git push --force',
  'WHILE(1){LOOP();}'
]

const displayText = ref('')
const textIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)
const typingSpeed = 100
const deletingSpeed = 50
const pauseTime = 2000

let typingTimer = null

function typeText() {
  const currentText = texts[textIndex.value]

  if (!isDeleting.value) {
    // 打字阶段
    displayText.value = currentText.substring(0, charIndex.value + 1)
    charIndex.value++

    if (charIndex.value === currentText.length) {
      // 打字完成，暂停后开始删除
      isDeleting.value = true
      typingTimer = setTimeout(typeText, pauseTime)
      return
    }

    typingTimer = setTimeout(typeText, typingSpeed)
  } else {
    // 删除阶段
    displayText.value = currentText.substring(0, charIndex.value - 1)
    charIndex.value--

    if (charIndex.value === 0) {
      // 删除完成，切换到下一个文本
      isDeleting.value = false
      textIndex.value = (textIndex.value + 1) % texts.length
      typingTimer = setTimeout(typeText, 500)
      return
    }

    typingTimer = setTimeout(typeText, deletingSpeed)
  }
}

onMounted(() => {
  typingTimer = setTimeout(typeText, 1000)
})

onUnmounted(() => {
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.hero {
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.name {
  display: block;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.typewriter {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 24px;
  min-height: 2.5rem;
}

.typewriter-text {
  color: var(--vp-c-brand-1);
}

.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: var(--vp-c-brand-1);
  font-weight: 100;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

/* Features Section */
.features {
  padding: 40px 0 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.feature-card p {
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  line-height: 1.6;
}

.feature-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: gap 0.3s ease;
}

.feature-link:hover {
  gap: 8px;
}

.feature-link svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 48px 0 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .typewriter {
    font-size: 1.3rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
