export interface ContactPageData {
  title: string
  subtitle: string
  guideTitle: string
  guideRows: Array<{ title: string, subtitle: string }>
  phone: {
    title: string
    subtitle: string
    number: string
    socials: string[]
  }
  email: {
    title: string
    subtitle: string
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
    title: 'تماس تلفنی',
    subtitle: 'پاسخگویی از ۸ صبح تا ۵ عصر، در چندین استان',
    number: '۰۲۱-۳۲۵۰۷۸۹',
    socials: ['telegram', 'x', 'youtube', 'instagram'],
  },
  email: {
    title: 'آدرس ایمیل',
    subtitle: 'برای امور همکاری، انتقاد و پیشنهاد با پیگیری مکتوب، ایمیل بزنید',
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