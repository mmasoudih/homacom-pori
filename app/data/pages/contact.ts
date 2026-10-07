export interface ContactPageData {
  title: string
  subtitle: string
  guideTitle: string
  guideSubtitle: string
  guideRows: Array<{ title: string, subtitle: string }>
  phone: {
    title: string
    /** Availability line, split so key times can be emphasized. */
    subtitle: Array<{ text: string, bold?: boolean }>
    note: string
    number: string
  }
  email: {
    title: string
    /** Body copy, split so key phrases can be emphasized. */
    subtitle: Array<{ text: string, bold?: boolean }>
    address: string
  }
  store: {
    title: string
    address: string
  }
  form: {
    title: string
    subtitle: string
    nameLabel: string
    contactLabel: string
    subjectLabel: string
    subjectPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submitLabel: string
    subjects: string[]
  }
}

export const contactPage: ContactPageData = {
  title: 'تماس با ما',
  subtitle: 'تیم پشتیبانی هماکام ۲۴ ساعته آماده پاسخگویی به سوالات و درخواست‌های شماست',
  guideTitle: 'راهنمای آنلاین',
  guideSubtitle: 'قبل از ارتباط با پشتیبانی، راهنمای آنلاین و سوالات متداول را مشاهده کنید؛\nجواب بیشتر سوال‌ها همان‌جاست.',
  guideRows: [
    {
      title: 'راهنمای آنلاین',
      subtitle: 'قبل از ارسال درخواست با پشتیبانی، راهنمای آنلاین و سوالات متداول را مطالعه کنید.',
    },
    {
      title: 'سوالات متداول',
      subtitle: 'پاسخ بیشتر سوالات شما درباره خرید، ارسال و گارانتی در صفحه سوالات متداول موجود است.',
    },
  ],
  phone: {
    title: 'تماس تلفنی و شبکه‌های اجتماعی',
    subtitle: [
      { text: 'پاسخگویی از ' },
      { text: '۸ صبح', bold: true },
      { text: ' تا ' },
      { text: '۵ عصر', bold: true },
      { text: ' در چت آنلاین، تلفن و شبکه‌های اجتماعی.' },
    ],
    note: 'در صورت نیاز با پشتیبانی هما‌کام تماس بگیرید.',
    number: '0121-3250789',
  },
  email: {
    title: 'آدرس ایمیل',
    subtitle: [
      { text: 'برای امور همکاری، انتقاد و پیشنهاد یا پیگیری مکتوب، ایمیل بزنید؛ پاسخ در کمتر از ' },
      { text: '۲۴ ساعت', bold: true },
      { text: ' در روزهای غیر تعطیل.' },
    ],
    address: 'Homacom@info.mail',
  },
  store: {
    title: 'آدرس فروشگاه',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۳۲۴، واحد ۵',
  },
  form: {
    title: 'ارسال پیام',
    subtitle: 'فرم زیر را پر کنید؛ کارشناسان ما در اولین فرصت با شما تماس می‌گیرند.',
    nameLabel: 'نام و نام خانوادگی',
    contactLabel: 'شماره تماس با ایمیل',
    subjectLabel: 'موضوع',
    subjectPlaceholder: 'انتخاب کنید',
    messageLabel: 'متن پیام',
    messagePlaceholder: 'پیام خود را بنویسید',
    submitLabel: 'ارسال پیام',
    subjects: ['سوال درباره سفارش', 'پیگیری سفارش', 'همکاری و فروش عمده', 'انتقاد و پیشنهاد', 'سایر موارد'],
  },
}