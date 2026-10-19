<script setup lang="ts">
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()
const {
  favorites: items,
  loaded,
  load: loadFavorites,
  remove: removeFavorite,
} = useFavorites()

onMounted(() => {
  loadFavorites().catch(err => toast.error(apiErrorMessage(err, 'دریافت علاقه‌مندی‌ها انجام نشد.')))
})

const isEmpty = computed(
  () => route.query.empty === '1' || (loaded.value && items.value.length === 0),
)

async function remove(id: string | number | undefined) {
  if (id == null) return
  try {
    await removeFavorite(id)
    toast.success('از علاقه‌مندی‌ها حذف شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'حذف از علاقه‌مندی‌ها انجام نشد.'))
  }
}

useHead({
  title: 'مورد علاقه‌ها | هماکام',
})
</script>

<template>
  <div>
    <DashboardFavoritesShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50">
        <UiTypography as="h1" size="2xl" weight="semibold" class="px-4 pt-4 lg:px-6 lg:pt-6">
          مورد علاقه‌ها
        </UiTypography>

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
