<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { CommentTabKey } from '~/data/comments'
import { commentTabs as baseTabs } from '~/data/comments'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()

const activeTab = ref<CommentTabKey>((route.query.tab as string) === 'pending' ? 'pending' : 'mine')

const {
  mine,
  pending,
  loaded,
  load: loadComments,
  remove: deleteComment,
} = useUserComments()

onMounted(() => {
  loadComments().catch(err => toast.error(apiErrorMessage(err, 'دریافت دیدگاه‌ها انجام نشد.')))
})

const tabs = computed(() => baseTabs.map(tab => ({
  ...tab,
  count: tab.key === 'mine' ? mine.value.length : pending.value.length,
})))

const isEmpty = computed(() => route.query.empty === '1')

const showEmpty = computed(() =>
  isEmpty.value || (loaded.value && (activeTab.value === 'mine' ? mine.value.length === 0 : pending.value.length === 0)),
)

const dialogOpen = ref(false)
const dialogComment = ref<{ title: string, image: string } | null>(null)

watch(activeTab, (tab) => {
  router.replace({ query: { ...route.query, tab: tab === 'mine' ? undefined : tab } })
})

async function removeComment(id: string) {
  try {
    await deleteComment(id)
    toast.success('دیدگاه حذف شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'حذف دیدگاه انجام نشد.'))
  }
}

function openDialog(comment: { title: string, image: string }) {
  dialogComment.value = comment
  dialogOpen.value = true
}

useHead({
  title: 'دیدگاه‌های من | هماکام',
})
</script>

<template>
  <div>
    <DashboardCommentsShell>
      <section class="rounded-3xl border border-T-400 bg-T-50 p-4 lg:p-6">
        <UiTypography as="h1" size="2xl" weight="semibold" color="default" class="mb-5">
          دیدگاه‌های من
        </UiTypography>

        <DashboardCommentsTabs v-model="activeTab" :tabs="tabs" />

        <DashboardCommentsEmptyState v-if="showEmpty" class="mt-2" />

        <template v-else>
          <div v-if="activeTab === 'mine'" class="mt-6 flex flex-col gap-3">
            <DashboardCommentsCard
              v-for="comment in mine"
              :key="comment.id"
              :comment="comment"
              @remove="removeComment"
              @edit="openDialog"
            />
          </div>

          <div v-else class="mt-6 flex flex-col gap-3">
            <DashboardCommentsPendingCard
              v-for="comment in pending"
              :key="comment.id"
              :comment="comment"
              @add="openDialog"
            />
          </div>
        </template>
      </section>
    </DashboardCommentsShell>

    <DashboardCommentsMobileShell title="دیدگاه‌های من" back-to="/dashboard">
      <DashboardCommentsMobileTabs v-model="activeTab" :tabs="tabs" />

      <DashboardCommentsMobileEmptyState v-if="showEmpty" />

      <template v-else>
        <div v-if="activeTab === 'mine'">
          <DashboardCommentsMobileCard
            v-for="comment in mine"
            :key="comment.id"
            :comment="comment"
            @remove="removeComment"
            @edit="openDialog"
          />
        </div>

        <div v-else>
          <DashboardCommentsMobilePendingCard
            v-for="comment in pending"
            :key="comment.id"
            :comment="comment"
          />
        </div>
      </template>
    </DashboardCommentsMobileShell>

    <DashboardCommentsCommentDialog v-model:open="dialogOpen" :comment="dialogComment" />
  </div>
</template>
