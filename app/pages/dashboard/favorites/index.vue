<script setup lang="ts">
import { favorites as initialFavorites } from '~/data/favorites'

const route = useRoute()
const items = ref([...initialFavorites])

const isEmpty = computed(
  () => route.query.empty === '1' || items.value.length === 0,
)

function remove(id: string | number | undefined) {
  items.value = items.value.filter(product => product.id !== id)
}

useHead({
  title: 'مورد علاقه‌ها | هماکام',
})
</script>

<template>
  <div>
    <DashboardFavoritesShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50">
        <h1 class="px-4 pt-4 text-xl font-bold text-T-900 lg:px-6 lg:pt-6">
          مورد علاقه‌ها
        </h1>

        <DashboardFavoritesEmptyState v-if="isEmpty" />

        <DashboardFavoritesGrid
          v-else
          class="mt-4"
          :products="items"
          @remove="remove"
        />
      </section>
    </DashboardFavoritesShell>

    <DashboardFavoritesMobileShell title="مورد علاقه‌ها" back-to="/dashboard">
      <DashboardFavoritesMobileEmptyState v-if="isEmpty" />

      <DashboardFavoritesMobileGrid
        v-else
        :products="items"
        @remove="remove"
      />
    </DashboardFavoritesMobileShell>
  </div>
</template>
