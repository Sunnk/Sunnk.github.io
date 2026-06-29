<script setup>
import { useData } from 'vitepress'
import Giscus from '@giscus/vue'
import { ref, watch, onMounted } from 'vue'

const { isDark, frontmatter } = useData()
const show = ref(false)

onMounted(() => {
  show.value = frontmatter.value.layout !== 'page'
  watch(() => frontmatter.value.layout, (val) => {
    show.value = val !== 'page'
  })
})
</script>

<template>
  <div v-if="show" class="comments-container">
    <Giscus
      id="comments"
      repo="Sunnk/Sunnk.github.io"
      repoId="R_kgDORkVPgw"
      category="Announcements"
      categoryId="DIC_kwDORkVPg84C__cm"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.comments-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
