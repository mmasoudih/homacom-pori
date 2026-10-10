import type { FaqItem } from '~/components/pages/FaqAccordion.vue'

export interface InstallmentPartner {
  name: string
  logo: string
  /** Brand color used for the tab border/label tint. */
  color: string
  /** Tagline shown beside the logo in the plan panel. */
  description: string
  /** نوع ضمانت */
  guarantee: string
  /** بازه تسویه */
  settlement: string
  /** سقف وام */
  ceiling: string
  /** نوع اعتبار (مثلاً وام یا اعتبار) */
  credit: string
}

export interface InstallmentPageData {
  title: string
  /** Word within `title` rendered in the brand accent color (R-300). */
  titleAccent: string
  intro: string
  applyCta: string
  complaintsCta: string
  cardBadge: string
  stepsTitle: string
  steps: Array<{ label: string, subtitle: string, icon: string }>
  partnersTitle: string
  partnersIntro: string
  partners: InstallmentPartner[]
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
  titleAccent: 'هماکام',
  intro:
    'امروز با هماکام می‌توانید بدون پرداخت یکجا، کالای دیجیتال مورد نظر خود را به صورت اقساطی خریداری کنید. ثبت‌نام ساده، تأیید سریع و بدون نیاز به ضامن.',
  applyCta: 'درخواست خرید اقساطی',
  complaintsCta: 'شکایات اعتباری',
  cardBadge: '۲۴ ساعته',
  stepsTitle: 'مراحل خرید اقساطی:',
  steps: [
    { label: 'ثبت‌نام و دریافت اعتبار', subtitle: 'در یکی از سایت‌های طرف قرارداد ثبت‌نام و اعتبار دریافت کنید.', icon: 'verify' },
    { label: 'ورود به حساب هماکام', subtitle: 'با همان شماره تلفن وارد حساب کاربری هماکام شوید.', icon: 'account' },
    { label: 'انتخاب کالا و سبد خرید', subtitle: 'کالای موردنظر را انتخاب و به سبد خرید اضافه کنید.', icon: 'cart' },
    { label: 'نهایی کردن خرید', subtitle: 'تایید جزئیات خرید و ثبت سفارش در فروشگاه', icon: 'order' },
    { label: 'پرداخت با اعتبار', subtitle: 'در بخش «روش پرداخت»، گزینه «پرداخت اقساطی» را انتخاب کنید.', icon: 'payment' },
  ],
  partnersTitle: 'شرکای اعتباری هماکام',
  partnersIntro: 'هر شریک اعتباری شرایط پرداخت متفاوتی داره؛ قبل از ثبت درخواست، سقف وام، بازه تسویه و نوع ضمانت هرکدوم رو مقایسه کن.',
  partners: [
    {
      name: 'اسنپ‌پی',
      logo: '/icons/installment/partners/snapp-pay.svg',
      color: '#007DFA',
      description: 'اعتبار خرید آنلاین اسنپ‌پی',
      guarantee: 'چک صیادی بنفش',
      settlement: '۴ ماه، ۱۸ ماه',
      ceiling: '۲۰ و ۱۰۰ میلیون تومان',
      credit: 'وام',
    },
    {
      name: 'تکنوپی',
      logo: '/icons/installment/partners/techno-pay.svg',
      color: '#00B7CE',
      description: 'اعتبار خرید اقساطی تکنوپی',
      guarantee: 'چک صیادی',
      settlement: '۶ ماه، ۱۲ ماه',
      ceiling: '۱۰ و ۵۰ میلیون تومان',
      credit: 'وام',
    },
    {
      name: 'دیجی‌پی',
      logo: '/icons/installment/partners/digipay.svg',
      color: '#003EFF',
      description: 'اعتبار خرید آنلاین دیجی‌پی',
      guarantee: 'چک صیادی',
      settlement: '۴ ماه، ۱۲ ماه',
      ceiling: '۱۵ و ۸۰ میلیون تومان',
      credit: 'اعتبار',
    },
    {
      name: 'ازکی وام',
      logo: '/icons/installment/partners/azki-vam.svg',
      color: '#364FD9',
      description: 'وام و اعتبار خرید ازکی وام',
      guarantee: 'چک صیادی',
      settlement: '۱۲ ماه، ۲۴ ماه',
      ceiling: '۵۰ و ۲۰۰ میلیون تومان',
      credit: 'وام',
    },
    {
      name: 'لندو',
      logo: '/icons/installment/partners/lendo.svg',
      color: '#0AC974',
      description: 'اعتبار خرید آنلاین لندو',
      guarantee: 'چک صیادی',
      settlement: '۴ ماه، ۱۸ ماه',
      ceiling: '۲۰ و ۱۰۰ میلیون تومان',
      credit: 'وام',
    },
  ],
  benefitsTitle: 'مزایای خرید اقساطی هماکام',
  benefitsIntro: 'چهار دلیل که خرید قسطی از هماکام را متفاوت می‌کند',
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