<script setup lang="ts">
import type { CommentTabKey, MyComment, PendingComment } from '~/data/comments'
import {
  commentTabs as baseTabs,
  myComments as initialMine,
  pendingComments as initialPending,
} from '~/data/comments'

const route = useRoute()
const router = useRouter()

const activeTab = ref<CommentTabKey>((route.query.tab as string) === 'pending' ? 'pending' : 'mine')

const mine = ref<MyComment[]>([...initialMine])
const pending = ref<PendingComment[]>([...initialPending])

const tabs = computed(() => baseTabs.map(tab => ({
  ...tab,
  count: tab.key === 'mine' ? mine.value.length : pending.value.length,
})))

const isEmpty = computed(() => route.query.empty === '1')

const showEmpty = computed(() =>
  isEmpty.value || (activeTab.value === 'mine' ? mine.value.length === 0 : pending.value.length === 0),
)

const dialogOpen = ref(false)
const dialogComment = ref<{ title: string, image: string } | null>(null)

watch(activeTab, (tab) => {
  router.replace({ query: { ...route.query, tab: tab === 'mine' ? undefined : tab } })
})

function removeComment(id: string) {
  mine.value = mine.value.filter(comment => comment.id !== id)
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
        <h1 class="mb-5 text-xl font-bold text-T-900">دیدگاه‌های من</h1>

        <DashboardCommentsTabs v-model="activeTab" :tabs="tabs" />

        <DashboardCommentsEmptyState v-if="showEmpty" class="mt-2" />

        <template v-else>
          <div v-if="activeTab === 'mine'" class="mt-6 flex flex-col gap-10">
            <DashboardCommentsCard
              v-for="comment in mine"
              :key="comment.id"
              :comment="comment"
              @remove="removeComment"
              @edit="openDialog"
            />
          </div>

          <div v-else class="mt-6 flex flex-col gap-10">
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
            @add="openDialog"
          />
        </div>
      </template>
    </DashboardCommentsMobileShell>

    <DashboardCommentsCommentDialog v-model:open="dialogOpen" :comment="dialogComment" />
  </div>
</template>
