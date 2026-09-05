<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-vue'
import { megaCategories, type Category } from '~/data/categories'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const ROOT_NODE: Category = { id: '__root', title: 'دسته‌بندی محصولات', children: megaCategories }

const stack = ref<Category[]>([ROOT_NODE])

const current = computed(() => stack.value[stack.value.length - 1])
const items = computed(() => current.value.children ?? [])

function openLevel(cat: Category) {
  if (cat.children?.length) {
    stack.value.push(cat)
  }
}

function goBack() {
  if (stack.value.length > 1) {
    stack.value.pop()
  }
}

function close() {
  emit('update:open', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      stack.value = [ROOT_NODE]
      document.addEventListener('keydown', onKeydown)
    }
    else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-[60] xl:hidden">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <div
          class="absolute inset-x-0 bottom-0 flex max-h-[75vh] flex-col rounded-t-2xl bg-T-50 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="دسته‌بندی محصولات"
        >
          <div class="flex justify-center pt-3">
            <span class="h-1 w-10 rounded-full bg-T-400" />
          </div>

          <div class="flex items-center justify-between px-4 pb-2 pt-2">
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-T-200 disabled:opacity-30"
              :disabled="stack.length === 1"
              aria-label="بازگشت"
              @click="goBack"
            >
              <IconChevronRight class="size-5" />
            </button>
            <span class="text-[15px] font-semibold text-foreground">{{ current.title }}</span>
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-T-200"
              aria-label="بستن"
              @click="close"
            >
              <IconX class="size-5" />
            </button>
          </div>

          <div class="overflow-y-auto px-3 pb-6">
            <ul class="divide-y divide-T-400">
              <li v-for="cat in items" :key="cat.id">
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-[10px] px-3 py-4 text-start text-[14px] font-medium text-foreground transition-colors hover:bg-T-200"
                  @click="openLevel(cat)"
                >
                  <span>{{ cat.title }}</span>
                  <IconChevronLeft v-if="cat.children?.length" class="size-4 shrink-0 text-T-600" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 200ms ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 200ms ease;
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>