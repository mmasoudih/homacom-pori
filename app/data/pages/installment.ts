import type { FaqItem } from '~/components/pages/FaqAccordion.vue'

export interface InstallmentPageData {
  title: string
  intro: string
  applyCta: string
  complaintsCta: string
  cardBadge: string
  stepsTitle: string
  steps: Array<{ label: string, icon: string }>
  partnersTitle: string
  partnersIntro: string
  partners: Array<{ name: string, color: string }>
  planTitle: string
  planOptions: string[]
  planCta: string
  benefitsTitle: string
  benefitsIntro: string
  benefits: Array<{ title: string, body: string, icon: string }>
  faqTitle: string
  faqSubtitle: string
  faqItems: FaqItem[]
  categoriesTitle: string
  categories: string[]
}

export const installmentPage: InstallmentPageData = {
  title: 'خرید اقساطی از هماکام',
  intro:
    'امروز با هماکام می‌توانید بدون پرداخت یکجا، کالای دیجیتال مورد نظر خود را به صورت اقساطی خریداری کنید. ثبت‌نام ساده، تأیید سریع و بدون نیاز به ضامن.',
  applyCta: 'درخواست خرید اقساطی',
  complaintsCta: 'شکایات اعتباری',
  cardBadge: '۲۴ ساعته',
  stepsTitle: 'مراحل خرید اقساطی',
  steps: [
    { label: 'ثبت‌نام و احراز هویت', icon: 'user' },
    { label: 'درخواست سقف خرید', icon: 'credit' },
    { label: 'تأیید متقاضی', icon: 'check' },
    { label: 'انتخاب کالا از فروشگاه', icon: 'package' },
    { label: 'پرداخت اقساط / نهایی‌سازی', icon: 'wallet' },
  ],
  partnersTitle: 'شرکای اعتباری هماکام',
  partnersIntro: 'هماکام با همکاری معتبرترین مؤسسات اعتباری کشور، خرید اقساطی را برای شما فراهم کرده است.',
  partners: [
    { name: 'لامیا', color: '#1E63D0' },
    { name: 'کیمیا', color: '#0FA3A3' },
    { name: 'تسهیلات', color: '#6C4BD8' },
    { name: 'مهر اقتصاد', color: '#B0234E' },
    { name: 'گنجینه', color: '#C96A12' },
  ],
  planTitle: 'انتخاب سقف اعتبار و بازپرداخت',
  planOptions: ['۱۲', '۲۴', '۳۶'],
  planCta: 'درخواست اعتبار',
  benefitsTitle: 'مزایای خرید اقساطی هماکام',
  benefitsIntro: 'خرید اقساطی از هماکام مزایای زیادی دارد که زندگی شما را ساده‌تر می‌کند.',
  benefits: [
    { title: 'خرید آسان و اقساطی', body: 'کالای دلخواه خود را امروز بخرید و هزینه آن را در اقساط ماهانه پرداخت کنید.', icon: 'package' },
    { title: 'تأیید آنلاین سریع', body: 'درخواست شما به صورت آنلاین بررسی و در کوتاه‌ترین زمان تأیید می‌شود.', icon: 'bolt' },
    { title: 'بدون نیاز به ضامن', body: 'برای خرید اقساطی تا سقف اعتبار شما، نیازی به ضامن یا چک نیست.', icon: 'user' },
    { title: 'پرداخت اقساط آسان', body: 'پرداخت اقساط از طریق درگاه امن بانکی و در هر زمان انجام می‌شود.', icon: 'wallet' },
  ],
  faqTitle: 'سوالات متداول خرید اقساطی',
  faqSubtitle: 'پاسخ سوالات رایج شما درباره خرید اقساطی از هماکام',
  faqItems: [
    {
      question: 'چگونه می‌توانم خرید اقساطی را ثبت کنم؟',
      answer:
        'برای شروع کافی است در هماکام ثبت‌نام کرده و از طریق دکمه «درخواست خرید اقساطی»، اطلاعات هویتی خود را تکمیل کنید. پس از تأیید سقف اعتبار، می‌توانید کالای مورد نظر خود را انتخاب و به صورت اقساطی خریداری کنید.',
    },
    {
      question: 'سقف اعتبار من چگونه تعیین می‌شود؟',
      answer:
        'سقف اعتبار بر اساس اعتبارسنجی و سابقه مالی شما توسط مؤسسه اعتباری همکار تعیین می‌شود. با افزایش سابقه پرداخت به موقع، سقف اعتبار شما قابل افزایش خواهد بود.',
    },
    {
      question: 'آیا امکان خرید اقساطی بدون ضامن وجود دارد؟',
      answer:
        'بله، برای مبالغ تا سقف اعتبار تأییدشده، نیازی به ضامن یا وثیقه نیست. تنها ثبت‌نام و احراز هویت آنلاین کافی است.',
    },
    {
      question: 'بازپرداخت اقساط چگونه انجام می‌شود؟',
      answer:
        'قسط ماهانه شما از طریق درگاه امن بانکی به صورت خودکار یا دستی پرداخت می‌شود. پیش از سررسید هر قسط، پیامک یادآوری برای شما ارسال خواهد شد.',
    },
    {
      question: 'در صورت تأخیر در پرداخت چه اتفاقی می‌افتد؟',
      answer:
        'برای پرداخت به موقع اقساط، مبلغی به عنوان تشویق در نظر گرفته می‌شود. در صورت تأخیر، طبق ضوابط مؤسسه اعتباری، کارمزد دیرکرد محاسبه خواهد شد.',
    },
  ],
  categoriesTitle: 'دسته‌بندی محصولات',
  categories: [
    'گوشی موبایل',
    'لپ‌تاپ و تبلت',
    'ساعت هوشمند',
    'هدفون و هندزفری',
    'کنسول بازی',
    'کامپیوتر',
    'لوازم جانبی',
    'صوتی و تصویری',
  ],
}