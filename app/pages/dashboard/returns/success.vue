<script setup lang="ts">
useHead({
  title: 'ثبت درخواست مرجوعی | هماکام',
})
</script>

<template>
  <DashboardOrdersSuccessShell>
    <DashboardOrdersSuccessCard
      title="مرجوعی ثبت شد"
      description="درخواست مرجوعی شما با موفقیت ثبت شد. لطفا تا دریافت پیامک یا اعلان تایید درخواست مرجوعی منتظر بمانید. سپس می‌توانید کالا یا کالاهای تایید شده را به پست تحویل دهید."
    >
      <NuxtLink
        to="/"
        class="mt-6 flex h-11 w-full items-center justify-center rounded-xl border border-T-400 bg-T-50 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
      >
        بازگشت به خانه
      </NuxtLink>
    </DashboardOrdersSuccessCard>
  </DashboardOrdersSuccessShell>
</template>
