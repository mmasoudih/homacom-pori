<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { blogNav, blogShopCta } from '~/data/blog'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const expandedSlug = ref('')

function toggle(slug: string) {
  expandedSlug.value = expandedSlug.value === slug ? '' : slug
}

function close() {
  emit('update:open', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    if (open) {
      expandedSlug.value = ''
      document.addEventListener('keydown', onKeydown)
      document.documentElement.style.overflow = 'hidden'
    }
    else {
      document.removeEventListener('keydown', onKeydown)
      document.documentElement.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="blog-drawer">
      <div v-if="open" class="fixed inset-0 z-[70] lg:hidden">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <aside
          class="absolute inset-y-0 end-0 flex w-[334px] max-w-[calc(100%-68px)] flex-col bg-T-50 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="منوی بلاگ"
        >
          <!-- Brand -->
          <NuxtLink to="/blog" class="flex items-center justify-center pb-5 pt-7" @click="close">
            <img src="/icons/logo.svg" alt="" class="me-2 h-[30px] w-[40px] object-contain">
            <span class="text-[21px] font-extrabold leading-none text-T-900">هما</span>
            <span class="text-[21px] font-extrabold leading-none text-primary">کام</span>
          </NuxtLink>

          <!-- Categories -->
          <nav class="flex-1 overflow-y-auto">
            <div v-for="item in blogNav" :key="item.slug" class="border-b border-T-400">
              <button
                type="button"
                class="flex h-14 w-full items-center justify-between px-6 text-start"
                :aria-expanded="expandedSlug === item.slug"
                @click="toggle(item.slug)"
              >
                <span
                  class="text-[15px] font-medium transition-colors"
                  :class="expandedSlug === item.slug ? 'text-primary' : 'text-T-900'"
                >
                  {{ item.label }}
                </span>
                <IconChevronDown
                  class="size-[18px] text-T-600 transition-transform duration-200"
                  :class="expandedSlug === item.slug ? 'rotate-180 text-primary' : ''"
                />
              </button>

              <div v-if="expandedSlug === item.slug" class="flex flex-col gap-1 px-6 pb-3">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.slug"
                  :to="`/blog/${item.slug}?sub=${child.slug}`"
                  class="py-1.5 text-[14px] text-T-700 transition-colors hover:text-primary"
                  @click="close"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </nav>

          <!-- Shop -->
          <div class="px-5 pb-10 pt-4">
            <NuxtLink
              :to="blogShopCta.href"
              class="flex h-10 w-full items-center justify-center rounded-xl bg-R-10 text-[14px] font-semibold text-primary transition-colors hover:bg-R-50"
              @click="close"
            >
              رفتن به {{ blogShopCta.label }}
            </NuxtLink>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.blog-drawer-enter-active,
.blog-drawer-leave-active {
  transition: opacity 200ms ease;
}
.blog-drawer-enter-from,
.blog-drawer-leave-to {
  opacity: 0;
}
.blog-drawer-enter-active > aside,
.blog-drawer-leave-active > aside {
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
}
.blog-drawer-enter-from > aside,
.blog-drawer-leave-to > aside {
  /* The panel is anchored to the right edge (RTL start), so it slides right. */
  transform: translateX(100%);
}
</style>
