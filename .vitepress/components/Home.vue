<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <picture class="hero-bg">
        <source srcset="/chip-bg.webp" type="image/webp" />
        <source srcset="/chip-bg.jpg" type="image/jpeg" />
        <img src="/chip-bg.jpg" alt="" class="hero-bg-img" loading="eager" />
      </picture>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title hero-enter">
          <span class="name">Sunky</span>
        </h1>
        <p class="hero-role hero-enter hero-enter-1">Developer / Hardware Enthusiast</p>
        <div class="typewriter hero-enter hero-enter-2" aria-live="polite">
          <span class="typewriter-text">{{ displayText }}</span>
          <span class="cursor" aria-hidden="true">|</span>
        </div>
        <div class="social-links hero-enter hero-enter-3">
          <a href="https://github.com/Sunnk" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="about-content">
        <h2 class="section-title">About</h2>
        <p class="about-text">
          Welcome to my corner of the internet. I'm a developer interested in
          low-level systems, hardware interfaces, and building tools that make
          complex things accessible.
        </p>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="projects">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        <article class="project-card" v-for="project in projects" :key="project.name">
          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="project-link" :aria-label="project.name + ' link'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const projects = [
  {
    name: 'Blog',
    description: 'This site. Built with VitePress.',
    tags: ['VitePress', 'Vue'],
    link: null
  }
]

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
let prefersReducedMotion = false

function typeText() {
  if (prefersReducedMotion) return

  const currentText = texts[textIndex.value]

  if (!isDeleting.value) {
    displayText.value = currentText.substring(0, charIndex.value + 1)
    charIndex.value++

    if (charIndex.value === currentText.length) {
      isDeleting.value = true
      typingTimer = setTimeout(typeText, pauseTime)
      return
    }

    typingTimer = setTimeout(typeText, typingSpeed)
  } else {
    displayText.value = currentText.substring(0, charIndex.value - 1)
    charIndex.value--

    if (charIndex.value === 0) {
      isDeleting.value = false
      textIndex.value = (textIndex.value + 1) % texts.length
      typingTimer = setTimeout(typeText, 500)
      return
    }

    typingTimer = setTimeout(typeText, deletingSpeed)
  }
}

onMounted(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = motionQuery.matches

  if (prefersReducedMotion) {
    displayText.value = texts[0]
  } else {
    typingTimer = setTimeout(typeText, 1000)
  }

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches
    if (prefersReducedMotion && typingTimer) {
      clearTimeout(typingTimer)
      typingTimer = null
    }
  })
})

onUnmounted(() => {
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
})
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero */
.hero {
  position: relative;
  padding: 80px 0 60px;
  text-align: center;
  border-radius: 16px;
  margin-bottom: 48px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 8s ease;
  will-change: transform;
}

.hero:hover .hero-bg-img {
  transform: scale(1.04);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.7) 100%);
  z-index: 1;
  transition: background 0.4s ease;
}

.hero:hover .hero-overlay {
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.45) 70%, rgba(0, 0, 0, 0.65) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

/* Entrance animation */
.hero-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: heroEnter 0.6s ease forwards;
}

.hero-enter-1 { animation-delay: 0.15s; }
.hero-enter-2 { animation-delay: 0.3s; }
.hero-enter-3 { animation-delay: 0.45s; }

@keyframes heroEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

.name {
  display: block;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-role {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}

.typewriter {
  font-size: 1.5rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 28px;
  min-height: 2rem;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}

.cursor {
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: var(--vp-c-brand-1);
  font-weight: 100;
}

@keyframes blink {
  50% { opacity: 0; }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.social-link:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.social-link svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.social-link:hover svg {
  transform: rotate(-8deg);
}

/* About */
.about {
  margin-bottom: 48px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.about-text {
  color: var(--vp-c-text-2);
  line-height: 1.75;
  font-size: 1rem;
  max-width: 640px;
}

/* Projects */
.projects {
  margin-bottom: 80px;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.project-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.project-desc {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 10px;
  line-height: 1.5;
}

.project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.project-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
  margin-left: 16px;
}

.project-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 56px 0 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .typewriter {
    font-size: 1.1rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 1;
  }

  .hero-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .hero-bg-img {
    transition: none;
  }

  .project-card,
  .social-link,
  .project-link {
    transition: none;
  }

  .social-link:hover {
    transform: none;
  }

  .social-link:hover svg {
    transform: none;
  }
}
</style>
