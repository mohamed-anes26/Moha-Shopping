import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Globe2,
  Link2,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = '213666848816';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const FACEBOOK_URL = 'https://www.facebook.com/share/1Ln9Fozm1T/';
const USD_TO_DZD = 256;

const faqItems = [
  {
    question: 'كيف أعرف السعر النهائي؟',
    answer:
      'يمكنك معرفة السعر الإجمالي التقريبي بالدينار الجزائري مباشرة وبشكل إلكتروني عبر حاسبة الأسعار المتاحة في موقعنا قبل إرسال طلبك. كل ما عليك فعله هو إدخال سعر المنتج بالدولار (USD)، وستقوم الحاسبة بإعطائك السعر النهائي الشامل للخدمة.',
  },
  {
    question: 'كم يستغرق وصول الطلب؟',
    answer:
      'يستغرق وصول الطلب عادةً بين 18 يوماً إلى 45 يوماً، وذلك يعتمد على المتجر وطريقة الشحن المختارة. نبقيك على اطلاع دائم بكل مرحلة يمر بها طردك حتى وصوله إليك.',
  },
  {
    question: 'هل أحتاج إلى بطاقة بنكية دولية؟',
    answer:
      'لا. أنت ترسل لنا رابط المنتج فقط، وموحا يتكفل بالشراء والدفع الدولي ثم التوصيل إلى الجزائر.',
  },
];

type ServiceKey = 'shopping' | 'games' | 'subscriptions' | 'topup' | 'other';

type OrderFormState = {
  service: ServiceKey;
  productLink: string;
  priceUsd: string;
  color: string;
  size: string;
  quantity: string;
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  postalCode: string;
  gameName: string;
  platform: string;
  appName: string;
  subscriptionPlan: string;
  playerDetails: string;
  topupAmount: string;
  description: string;
  budgetNotes: string;
};

const wilayas = [
  { value: '01', label: 'أدرار', communes: ['أدرار', 'تيميمون', 'رقان'] },
  { value: '02', label: 'الشلف', communes: ['الشلف', 'تنس', 'وادي الفضة'] },
  { value: '03', label: 'الأغواط', communes: ['الأغواط', 'قصر الحيران', 'حاسي الرمل'] },
  { value: '04', label: 'أم البواقي', communes: ['أم البواقي', 'عين البيضاء', 'عين مليلة'] },
  { value: '05', label: 'باتنة', communes: ['باتنة', 'القيقبة', 'راس العيون', 'نقاوس', 'بريكة'] },
  { value: '06', label: 'بجاية', communes: ['بجاية', 'أميزور', 'أقبو'] },
  { value: '07', label: 'بسكرة', communes: ['بسكرة', 'طولقة', 'زريبة الوادي'] },
  { value: '08', label: 'بشار', communes: ['بشار', 'القنادسة', 'العبادلة'] },
  { value: '09', label: 'البليدة', communes: ['البليدة', 'بوفاريك', 'العفرون'] },
  { value: '10', label: 'البويرة', communes: ['البويرة', 'سور الغزلان', 'الأخضرية'] },
  { value: '11', label: 'تمنراست', communes: ['تمنراست', 'عين صالح', 'إدلس'] },
  { value: '12', label: 'تبسة', communes: ['تبسة', 'الشريعة', 'بئر العاتر'] },
  { value: '13', label: 'تلمسان', communes: ['تلمسان', 'منصورة', 'مغنية'] },
  { value: '14', label: 'تيارت', communes: ['تيارت', 'فرندة', 'مهدية'] },
  { value: '15', label: 'تيزي وزو', communes: ['تيزي وزو', 'ذراع بن خدة', 'أزفون'] },
  { value: '16', label: 'الجزائر', communes: ['الجزائر الوسطى', 'باب الوادي', 'الدار البيضاء', 'الرويبة'] },
  { value: '17', label: 'الجلفة', communes: ['الجلفة', 'حاسي بحبح', 'عين وسارة'] },
  { value: '18', label: 'جيجل', communes: ['جيجل', 'الطاهير', 'الميلية'] },
  { value: '19', label: 'سطيف', communes: ['سطيف', 'العلمة', 'عين أرنات'] },
  { value: '20', label: 'سعيدة', communes: ['سعيدة', 'عين الحجر', 'الحساسنة'] },
  { value: '21', label: 'سكيكدة', communes: ['سكيكدة', 'عزابة', 'القل'] },
  { value: '22', label: 'سيدي بلعباس', communes: ['سيدي بلعباس', 'تلموني', 'تلاغ'] },
  { value: '23', label: 'عنابة', communes: ['عنابة', 'البوني', 'الحجار'] },
  { value: '24', label: 'قالمة', communes: ['قالمة', 'وادي الزناتي', 'حمام دباغ'] },
  { value: '25', label: 'قسنطينة', communes: ['قسنطينة', 'الخروب', 'حامة بوزيان'] },
  { value: '26', label: 'المدية', communes: ['المدية', 'البرواقية', 'قصر البخاري'] },
  { value: '27', label: 'مستغانم', communes: ['مستغانم', 'عين تادلس', 'حاسي ماماش'] },
  { value: '28', label: 'المسيلة', communes: ['المسيلة', 'بوسعادة', 'سيدي عيسى'] },
  { value: '29', label: 'معسكر', communes: ['معسكر', 'سيق', 'المحمدية'] },
  { value: '30', label: 'ورقلة', communes: ['ورقلة', 'حاسي مسعود', 'تقرت'] },
  { value: '31', label: 'وهران', communes: ['وهران', 'بئر الجير', 'السانية'] },
  { value: '32', label: 'البيض', communes: ['البيض', 'بوقطب', 'الأبيض سيدي الشيخ'] },
  { value: '33', label: 'إليزي', communes: ['إليزي', 'جانت', 'برج عمر إدريس'] },
  { value: '34', label: 'برج بوعريريج', communes: ['برج بوعريريج', 'رأس الوادي', 'المنصورة'] },
  { value: '35', label: 'بومرداس', communes: ['بومرداس', 'برج منايل', 'دلس'] },
  { value: '36', label: 'الطارف', communes: ['الطارف', 'القالة', 'البسباس'] },
  { value: '37', label: 'تندوف', communes: ['تندوف', 'أم العسل'] },
  { value: '38', label: 'تيسمسيلت', communes: ['تيسمسيلت', 'ثنية الحد', 'برج بونعامة'] },
  { value: '39', label: 'الوادي', communes: ['الوادي', 'الرباح', 'قمار'] },
  { value: '40', label: 'خنشلة', communes: ['خنشلة', 'قايس', 'ششار'] },
  { value: '41', label: 'سوق أهراس', communes: ['سوق أهراس', 'تاورة', 'سدراتة'] },
  { value: '42', label: 'تيبازة', communes: ['تيبازة', 'القليعة', 'شرشال'] },
  { value: '43', label: 'ميلة', communes: ['ميلة', 'فرجيوة', 'شلغوم العيد'] },
  { value: '44', label: 'عين الدفلى', communes: ['عين الدفلى', 'خميس مليانة', 'مليانة'] },
  { value: '45', label: 'النعامة', communes: ['النعامة', 'المشرية', 'عين الصفراء'] },
  { value: '46', label: 'عين تموشنت', communes: ['عين تموشنت', 'العامرية', 'حمام بوحجر'] },
  { value: '47', label: 'غرداية', communes: ['غرداية', 'بونورة', 'متليلي'] },
  { value: '48', label: 'غليزان', communes: ['غليزان', 'وادي رهيو', 'مازونة'] },
  { value: '49', label: 'تيميمون', communes: ['تيميمون', 'أوقروت', 'شروين'] },
  { value: '50', label: 'برج باجي مختار', communes: ['برج باجي مختار', 'تيمياوين'] },
  { value: '51', label: 'أولاد جلال', communes: ['أولاد جلال', 'سيدي خالد', 'رأس الميعاد'] },
  { value: '52', label: 'بني عباس', communes: ['بني عباس', 'الواتة', 'كرزاز'] },
  { value: '53', label: 'إن صالح', communes: ['إن صالح', 'فقارة الزوى'] },
  { value: '54', label: 'إن قزام', communes: ['إن قزام', 'تين زواتين'] },
  { value: '55', label: 'تقرت', communes: ['تقرت', 'تماسين', 'النزلة'] },
  { value: '56', label: 'جانت', communes: ['جانت', 'برج الحواس'] },
  { value: '57', label: 'المغير', communes: ['المغير', 'جامعة', 'سيدي عمران'] },
  { value: '58', label: 'المنيعة', communes: ['المنيعة', 'حاسي القارة', 'حاسي الفحل'] },
] as const;

const serviceOptions: { key: ServiceKey; label: string; description: string }[] = [
  { key: 'shopping', label: 'الشراء من الإنترنت', description: 'أرسل رابط منتج من أي متجر عالمي' },
  { key: 'games', label: 'شراء الألعاب الإلكترونية', description: 'لعبة جديدة على منصتك المفضلة' },
  { key: 'subscriptions', label: 'دفع الاشتراكات الرقمية', description: 'تطبيق أو خدمة بخطة شهرية أو سنوية' },
  { key: 'topup', label: 'شحن الألعاب والتطبيقات', description: 'رصيد، عملة داخل اللعبة أو حساب' },
  { key: 'other', label: 'خدمات أخرى', description: 'اكتب ما تحتاجه وسنراجع التفاصيل' },
];

const initialOrder: OrderFormState = {
  service: 'shopping',
  productLink: '',
  priceUsd: '',
  color: '',
  size: '',
  quantity: '1',
  firstName: '',
  lastName: '',
  phone: '',
  wilaya: '',
  commune: '',
  postalCode: '',
  gameName: '',
  platform: '',
  appName: '',
  subscriptionPlan: '',
  playerDetails: '',
  topupAmount: '',
  description: '',
  budgetNotes: '',
};

function formatDzd(amount: number) {
  return new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function calculateEstimate(priceUsd: number) {
  const baseDzd = priceUsd * USD_TO_DZD;

  if (!baseDzd) {
    return 0;
  }

  let rate = 0.1;
  let minimum = 1200;

  if (baseDzd < 700) {
    rate = 0.5;
    minimum = 0;
  } else if (baseDzd < 1000) {
    rate = 0.45;
    minimum = 350;
  } else if (baseDzd < 1500) {
    rate = 0.35;
    minimum = 450;
  } else if (baseDzd < 2000) {
    rate = 0.27;
    minimum = 525;
  } else if (baseDzd < 3000) {
    rate = 0.2;
    minimum = 540;
  } else if (baseDzd <= 8000) {
    rate = 0.15;
    minimum = 600;
  }

  const fee = Math.max(baseDzd * rate, minimum, 250);
  return Math.round(baseDzd + fee);
}

function Logo() {
  return (
    <a className="moha-logo" href="#top" data-testid="link-logo" aria-label="موحا Moha">
      <span className="moha-logo-mark" aria-hidden="true">
        <span className="moha-logo-m">M</span>
      </span>
      <span className="moha-logo-copy">
        <span className="moha-logo-ar">موحا</span>
        <span className="moha-logo-en">MOHA</span>
      </span>
    </a>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.41c0-.81.22-1.36 1.39-1.36h1.49V5.54c-.26-.04-1.15-.12-2.19-.12-2.17 0-3.66 1.33-3.66 3.77v2.01H8.08V14h2.45v7h2.97Z" />
    </svg>
  );
}

function Home() {
  const [order, setOrder] = useState<OrderFormState>(initialOrder);
  const [calculatorPrice, setCalculatorPrice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedWilaya = wilayas.find((wilaya) => wilaya.value === order.wilaya);
  const calculatorTotal = calculateEstimate(Number.parseFloat(calculatorPrice) || 0);

  const setOrderField = <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => {
    setOrder((current) => ({ ...current, [field]: value }));
  };

  const handleWilayaChange = (value: string) => {
    setOrder((current) => ({
      ...current,
      wilaya: value,
      commune: '',
    }));
  };

  const buildOrderMessage = () => {
    const serviceLabel = serviceOptions.find((service) => service.key === order.service)?.label ?? '';
    const fields: [string, string][] = [['الخدمة المطلوبة', serviceLabel]];

    const add = (label: string, value: string) => {
      if (value.trim()) fields.push([label, value.trim()]);
    };
    const addIdentity = () => {
      add('الاسم الأول', order.firstName);
      add('اللقب', order.lastName);
      add('الهاتف', order.phone);
    };

    if (order.service === 'shopping') {
      add('رابط المنتج', order.productLink);
      add('سعر المنتج بالدولار', order.priceUsd ? `${order.priceUsd} USD` : '');
      add('اللون', order.color);
      add('المقاس', order.size);
      add('الكمية', order.quantity);
      addIdentity();
      add('الولاية', selectedWilaya?.label ?? '');
      add('البلدية', order.commune);
      add('الرمز البريدي', order.postalCode);
      if (order.priceUsd && Number.parseFloat(order.priceUsd) > 0) {
        add('الإجمالي التقريبي', `${formatDzd(calculateEstimate(Number.parseFloat(order.priceUsd)))} دج`);
      }
    }

    if (order.service === 'games') {
      add('اسم اللعبة', order.gameName);
      add('المنصة', order.platform);
      addIdentity();
    }

    if (order.service === 'subscriptions') {
      add('اسم التطبيق أو الخدمة', order.appName);
      add('الخطة أو الاشتراك', order.subscriptionPlan);
      addIdentity();
    }

    if (order.service === 'topup') {
      add('اسم اللعبة', order.gameName);
      add('معرّف اللاعب أو تفاصيل الحساب', order.playerDetails);
      add('العملة أو القيمة المطلوبة', order.topupAmount);
      addIdentity();
    }

    if (order.service === 'other') {
      add('تفاصيل الخدمة', order.description);
      add('الميزانية أو الملاحظات', order.budgetNotes);
      addIdentity();
    }

    return ['مرحباً موحا، أريد إرسال طلب جديد:', ...fields.map(([label, value]) => `${label}: ${value}`)].join('\n');
  };

  const copyOrderMessage = async (message: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = message;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();

    if (!copied) {
      throw new Error('Clipboard access was unavailable');
    }
  };

  const handleOrderSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = buildOrderMessage();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.value === 'facebook') {
      try {
        await copyOrderMessage(message);
      } catch {
        // The Facebook page still opens if the browser blocks clipboard access.
      }
      window.open(FACEBOOK_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <main className="moha-page" id="top" dir="rtl">
      <header className="moha-shell moha-nav" data-testid="header-navigation">
        <Logo />
        <nav
          className="moha-nav-links"
          data-open={menuOpen}
          aria-label="التنقل الرئيسي"
          data-testid="nav-links"
        >
          <a className="moha-nav-link" href="#how-it-works" onClick={closeMobileMenu} data-testid="link-how-it-works">
            كيف نعمل
          </a>
           <a className="moha-nav-link" href="#calculator" onClick={closeMobileMenu} data-testid="link-estimate">
             حاسبة الأسعار
          </a>
          <a className="moha-nav-link" href="#faq" onClick={closeMobileMenu} data-testid="link-faq">
            الأسئلة الشائعة
          </a>
           <div className="moha-nav-contact" aria-label="تواصل معنا">
             <a
               className="moha-social-button moha-social-button-whatsapp"
               href={WHATSAPP_URL}
               target="_blank"
               rel="noreferrer"
               aria-label="تواصل معنا عبر واتساب"
               data-testid="link-nav-whatsapp"
             >
               <MessageCircle size={17} />
             </a>
             <a
               className="moha-social-button moha-social-button-facebook"
               href={FACEBOOK_URL}
               target="_blank"
               rel="noreferrer"
               aria-label="تابعنا على فيسبوك"
               data-testid="link-nav-facebook"
             >
               <FacebookIcon size={17} />
             </a>
           </div>
           <a className="moha-nav-cta" href="#order" onClick={closeMobileMenu} data-testid="link-order-nav">
             أرسل الطلب عبر واتساب <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </nav>
        <button
          className="moha-menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <section className="moha-shell moha-hero" data-testid="section-hero">
        <div>
          <span className="moha-eyebrow">
            <span className="moha-eyebrow-dot" aria-hidden="true" />
             تسوق عالمي، بخدمة محلية
          </span>
          <h1>
            العالم أقرب
            <br />
            مما <em>تتخيل.</em>
          </h1>
          <p className="moha-hero-lede">
             اختر الخدمة التي تحتاجها: الشراء من الإنترنت، شراء الألعاب، دفع الاشتراكات الرقمية، أو شحن الحسابات. موحا يتكفل بكافة المعاملات والدفع الإلكتروني نيابة عنك.
          </p>
          <div className="moha-hero-actions">
             <a className="moha-button moha-button-primary" href="#order" data-testid="link-hero-estimate">
               اطلب خدمتك الآن <ArrowDown size={17} />
            </a>
            <a className="moha-button moha-button-quiet" href="#how-it-works" data-testid="link-hero-how-it-works">
              اكتشف كيف نعمل <ArrowLeft size={17} />
            </a>
          </div>
          <div className="moha-hero-note">
            <ShieldCheck size={17} />
            <span>شراء موثوق، متابعة واضحة، ولا تحتاج بطاقة دولية</span>
          </div>
        </div>

        <div className="moha-hero-visual" aria-label="موحا يربط المتاجر العالمية بالجزائر">
          <div className="moha-orbit" aria-hidden="true" />
          <div className="moha-world-card" aria-hidden="true">
            <div className="moha-map-lines" />
          </div>
          <div className="moha-pin" aria-hidden="true">
            <MapPin size={23} />
          </div>
          <div className="moha-package" aria-hidden="true">
            <PackageCheck size={43} strokeWidth={1.45} />
          </div>
          <div className="moha-visual-label">
            <strong>من أي متجر</strong>
            <span>TO YOUR DOOR</span>
          </div>
        </div>
      </section>

      <div className="moha-shell moha-ticker" data-testid="trust-strip">
        <div className="moha-ticker-track">
          <span>AliExpress</span>
          <span>Temu</span>
          <span>eBay</span>
          <span>وغيرها من المتاجر العالمية</span>
        </div>
        <Zap size={16} color="hsl(var(--accent))" aria-hidden="true" />
      </div>

      <section className="moha-shell moha-section" id="how-it-works" data-testid="section-how-it-works">
        <div className="moha-section-heading">
          <div>
            <p className="moha-kicker">ثلاث خطوات، بدون تعقيد</p>
            <h2>أنت تختار.<br />موحا يتكفل بالباقي.</h2>
          </div>
          <p>تجربة محلية دافئة لشراء عالمي — من أول رابط حتى وصول الطرد.</p>
        </div>
        <div className="moha-steps">
          <article className="moha-step" data-testid="card-step-1">
            <span className="moha-step-number">01</span>
            <Link2 className="moha-step-icon" size={24} />
             <h3>اختر الخدمة وأرسل التفاصيل</h3>
             <p>حدد الخدمة التي تريدها (تسوق، ألعاب، اشتراكات، شحن) وأرسل الرابط أو البيانات المطلوبة عبر النموذج أو الواتساب.</p>
          </article>
          <article className="moha-step" data-testid="card-step-2">
            <span className="moha-step-number">02</span>
            <ShoppingBag className="moha-step-icon" size={24} />
             <h3>نراجع الطلب ونؤكده معك</h3>
             <p>نقوم بتأكيد السعر الإجمالي بالدينار الجزائري وتأكيد التفاصيل معك فوراً لضمان تنفيذ طلبك بأمان.</p>
          </article>
          <article className="moha-step" data-testid="card-step-3">
            <span className="moha-step-number">03</span>
            <MapPin className="moha-step-icon" size={24} />
             <h3>ننفيّذ ونوصل لك</h3>
             <p>نتكفل بعملية الشراء، الشحن، أو التسليم الرقمي ونبقيك على اطلاع بجميع مراحل تنفيذ الخدمة.</p>
          </article>
        </div>
      </section>

      <section className="moha-route-band" data-testid="section-route">
        <div className="moha-shell moha-route-content">
          <div>
            <p className="moha-kicker">من أي مكان إلى مكانك</p>
            <h2>العالم مفتوح.<br />والطريق علينا.</h2>
            <p>لا تحويل عملات معقد، لا شحن دولي مربك، ولا بحث عن بطاقة مناسبة.</p>
          </div>
          <div className="moha-route-graphic" aria-label="مسار الطلب من المتجر إلى الجزائر">
            <span className="moha-route-node"><Globe2 size={25} /></span>
            <span className="moha-route-line" />
            <span className="moha-route-node"><MapPin size={25} /></span>
          </div>
        </div>
      </section>

      <section className="moha-shell moha-order-section" id="order" data-testid="section-order">
        <div className="moha-order-heading">
          <div>
            <p className="moha-kicker">طلبك يبدأ من هنا</p>
            <h2>اختر الخدمة،<br />واترك الباقي علينا.</h2>
          </div>
          <p>املأ التفاصيل التي نحتاجها فقط. سيفتح واتساب برسالة مرتبة جاهزة للمراجعة والإرسال.</p>
        </div>

        <form className="moha-order-card" onSubmit={handleOrderSubmit} noValidate={false}>
          <div className="moha-service-picker" role="radiogroup" aria-label="اختر الخدمة">
            {serviceOptions.map((service) => (
              <label className="moha-service-option" data-selected={order.service === service.key} key={service.key}>
                <input
                  type="radio"
                  name="service"
                  value={service.key}
                  checked={order.service === service.key}
                  onChange={() => setOrderField('service', service.key)}
                  data-testid={`input-service-${service.key}`}
                />
                <span className="moha-service-radio" aria-hidden="true" />
                <span>
                  <strong>{service.label}</strong>
                  <small>{service.description}</small>
                </span>
              </label>
            ))}
          </div>

          <div className="moha-order-fields">
            {order.service === 'shopping' && (
              <>
                <div className="moha-field moha-field-wide">
                  <label htmlFor="order-product-link">رابط المنتج <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-product-link" type="url" required value={order.productLink} onChange={(event) => setOrderField('productLink', event.target.value)} placeholder="https://..." data-testid="input-order-product-link" />
                  <small className="moha-field-hint">الرابط من المتجر الذي تريد الشراء منه</small>
                </div>
                <div className="moha-field">
                  <label htmlFor="order-price-usd">سعر المنتج بالدولار <span>(اختياري)</span></label>
                  <div className="moha-order-unit">
                    <input className="moha-order-input" id="order-price-usd" type="number" min="0" step="0.01" inputMode="decimal" value={order.priceUsd} onChange={(event) => setOrderField('priceUsd', event.target.value)} placeholder="مثال: 25" data-testid="input-order-price-usd" />
                    <span>USD</span>
                  </div>
                </div>
                <div className="moha-field">
                  <label htmlFor="order-color">اللون <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-color" required value={order.color} onChange={(event) => setOrderField('color', event.target.value)} placeholder="مثال: أسود أو لا ينطبق" data-testid="input-order-color" />
                </div>
                <div className="moha-field">
                  <label htmlFor="order-size">المقاس <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-size" required value={order.size} onChange={(event) => setOrderField('size', event.target.value)} placeholder="مثال: L أو لا ينطبق" data-testid="input-order-size" />
                </div>
                <div className="moha-field moha-field-small">
                  <label htmlFor="order-quantity">الكمية <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-quantity" type="number" min="1" required value={order.quantity} onChange={(event) => setOrderField('quantity', event.target.value)} data-testid="input-order-quantity" />
                </div>
              </>
            )}

            {order.service === 'games' && (
              <>
                <div className="moha-field">
                  <label htmlFor="order-game-name">اسم اللعبة <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-game-name" required value={order.gameName} onChange={(event) => setOrderField('gameName', event.target.value)} placeholder="مثال: EA Sports FC" data-testid="input-order-game-name" />
                </div>
                <div className="moha-field">
                  <label htmlFor="order-platform">المنصة <span className="required-mark">*</span></label>
                  <select className="moha-order-input" id="order-platform" required value={order.platform} onChange={(event) => setOrderField('platform', event.target.value)} data-testid="input-order-platform">
                    <option value="">اختر المنصة</option>
                    <option>Steam</option>
                    <option>Epic Games</option>
                    <option>PlayStation</option>
                    <option>Xbox</option>
                    <option>Nintendo</option>
                    <option>منصة أخرى</option>
                  </select>
                </div>
              </>
            )}

            {order.service === 'subscriptions' && (
              <>
                <div className="moha-field">
                  <label htmlFor="order-app-name">اسم التطبيق أو الخدمة <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-app-name" required value={order.appName} onChange={(event) => setOrderField('appName', event.target.value)} placeholder="مثال: منصة تعليمية" data-testid="input-order-app-name" />
                </div>
                <div className="moha-field">
                  <label htmlFor="order-subscription-plan">الخطة أو نوع الاشتراك <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-subscription-plan" required value={order.subscriptionPlan} onChange={(event) => setOrderField('subscriptionPlan', event.target.value)} placeholder="شهري، سنوي أو اكتب الخطة" data-testid="input-order-subscription-plan" />
                </div>
              </>
            )}

            {order.service === 'topup' && (
              <>
                <div className="moha-field">
                  <label htmlFor="order-topup-game">اسم اللعبة أو التطبيق <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-topup-game" required value={order.gameName} onChange={(event) => setOrderField('gameName', event.target.value)} placeholder="مثال: PUBG Mobile" data-testid="input-order-topup-game" />
                </div>
                <div className="moha-field">
                  <label htmlFor="order-player-details">معرّف اللاعب أو تفاصيل الحساب <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-player-details" required value={order.playerDetails} onChange={(event) => setOrderField('playerDetails', event.target.value)} placeholder="المعرّف أو اسم الحساب" data-testid="input-order-player-details" />
                </div>
                <div className="moha-field moha-field-wide">
                  <label htmlFor="order-topup-amount">العملة أو القيمة المطلوبة <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-topup-amount" required value={order.topupAmount} onChange={(event) => setOrderField('topupAmount', event.target.value)} placeholder="مثال: 600 UC أو 10 USD" data-testid="input-order-topup-amount" />
                </div>
              </>
            )}

            {order.service === 'other' && (
              <>
                <div className="moha-field moha-field-wide">
                  <label htmlFor="order-description">تفاصيل الخدمة <span className="required-mark">*</span></label>
                  <textarea className="moha-order-input moha-order-textarea" id="order-description" required value={order.description} onChange={(event) => setOrderField('description', event.target.value)} placeholder="اشرح لنا ما تحتاجه بالتفصيل" data-testid="input-order-description" />
                </div>
                <div className="moha-field moha-field-wide">
                  <label htmlFor="order-budget-notes">الميزانية أو الملاحظات <span className="required-mark">*</span></label>
                  <textarea className="moha-order-input moha-order-textarea" id="order-budget-notes" required value={order.budgetNotes} onChange={(event) => setOrderField('budgetNotes', event.target.value)} placeholder="ميزانيتك التقريبية أو أي تفاصيل إضافية" data-testid="input-order-budget-notes" />
                </div>
              </>
            )}

            <div className="moha-field">
              <label htmlFor="order-first-name">الاسم <span className="required-mark">*</span></label>
              <input className="moha-order-input" id="order-first-name" required value={order.firstName} onChange={(event) => setOrderField('firstName', event.target.value)} placeholder="الاسم" data-testid="input-order-first-name" />
            </div>
            <div className="moha-field">
              <label htmlFor="order-last-name">اللقب <span className="required-mark">*</span></label>
              <input className="moha-order-input" id="order-last-name" required value={order.lastName} onChange={(event) => setOrderField('lastName', event.target.value)} placeholder="اللقب" data-testid="input-order-last-name" />
            </div>
            <div className="moha-field">
              <label htmlFor="order-phone">رقم الهاتف <span className="required-mark">*</span></label>
              <input className="moha-order-input" id="order-phone" type="tel" inputMode="tel" required value={order.phone} onChange={(event) => setOrderField('phone', event.target.value)} placeholder="05 أو 06 أو 07..." data-testid="input-order-phone" />
            </div>

            {order.service === 'shopping' && (
              <>
                <div className="moha-field">
                  <label htmlFor="order-wilaya">الولاية <span className="required-mark">*</span></label>
                  <select className="moha-order-input" id="order-wilaya" required value={order.wilaya} onChange={(event) => handleWilayaChange(event.target.value)} data-testid="select-order-wilaya">
                    <option value="">اختر الولاية</option>
                    {wilayas.map((wilaya) => <option value={wilaya.value} key={wilaya.value}>{wilaya.value} — {wilaya.label}</option>)}
                  </select>
                </div>
                <div className="moha-field">
                  <label htmlFor="order-commune">البلدية <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-commune" required value={order.commune} onChange={(event) => setOrderField('commune', event.target.value)} placeholder="اكتب اسم البلدية" data-testid="input-order-commune" />
                </div>
                <div className="moha-field">
                  <label htmlFor="order-postal-code">الرمز البريدي <span className="required-mark">*</span></label>
                  <input className="moha-order-input" id="order-postal-code" inputMode="numeric" required pattern="[0-9]{4,5}" value={order.postalCode} onChange={(event) => setOrderField('postalCode', event.target.value)} placeholder="مثال: 05000" data-testid="input-order-postal-code" />
                </div>
              </>
            )}
          </div>

          <div className="moha-order-submit">
            <div>
              <span className="moha-submit-label">جاهز؟</span>
               <p>اختر طريقة الإرسال المناسبة، وسنراجع طلبك بالتفاصيل النهائية.</p>
            </div>
             <div className="moha-order-actions">
               <button className="moha-button moha-whatsapp-button" type="submit" name="dispatch" value="whatsapp" data-testid="button-whatsapp-order">
                 أرسل الطلب عبر واتساب <MessageCircle size={18} />
               </button>
               <button className="moha-button moha-facebook-button" type="submit" name="dispatch" value="facebook" data-testid="button-facebook-order">
                 أرسل الطلب عبر فيسبوك <FacebookIcon size={18} />
               </button>
             </div>
          </div>
        </form>
      </section>

      <section className="moha-shell moha-section moha-calculator-section" id="calculator" data-testid="section-calculator">
        <div className="moha-calculator-wrap">
          <div className="moha-calculator-intro">
            <p className="moha-kicker">أداة اختيارية</p>
            <h2>احسبها<br />على راحتك.</h2>
            <p>هذا السعر تقريبي فقط لمنحك فكرة مبدئية، حيث قد تتوفر تخفيضات أو كوبونات خاصة عند تنفيذ الطلب. يتم تأكيد السعر النهائي للخدمة فور التواصل معنا وتأكيد التفاصيل.</p>
          </div>
          <div className="moha-calculator-card" data-testid="card-calculator">
            <label className="moha-calc-label" htmlFor="calculator-price-usd">سعر المنتج بالدولار <span>(اختياري)</span></label>
            <div className="moha-calc-unit">
              <input className="moha-input" id="calculator-price-usd" type="number" min="0" step="0.01" inputMode="decimal" value={calculatorPrice} onChange={(event) => setCalculatorPrice(event.target.value)} placeholder="مثال: 25" data-testid="input-calculator-price-usd" />
              <span>USD</span>
            </div>
            <div className="moha-total" aria-live="polite" data-testid="status-estimate">
              <div>
                <span className="moha-total-label">الإجمالي التقريبي</span>
                <span className="moha-total-sub">تقدير شامل لسعر المنتج وخدمة موحا</span>
              </div>
              <strong className="moha-total-value" data-testid="text-estimated-total">{calculatorTotal ? formatDzd(calculatorTotal) : '—'} <small>دج</small></strong>
            </div>
            <p className="moha-calc-footnote">يمكنك إرسال الطلب مباشرة من النموذج، سواء استخدمت الحاسبة أم لا.</p>
          </div>
        </div>
      </section>

      <section className="moha-shell moha-section" data-testid="section-trust">
        <div className="moha-proof-grid">
          <div className="moha-proof-main">
            <p className="moha-kicker">الشريك المحلي للعالم</p>
            <h3>تسوق براحتك.<br />واترك التفاصيل علينا.</h3>
            <p>موحا يجمع بين فهم السوق الجزائري وسهولة الوصول إلى منتجات لا تجدها حولك.</p>
          </div>
          <div className="moha-proof-aside">
            <div className="moha-proof-stat" data-testid="stat-global-stores">
              <strong>∞</strong>
              <span>متجر عالمي<br />في متناولك</span>
            </div>
            <div className="moha-proof-stat" data-testid="stat-delivery-window">
              <strong>18–45</strong>
              <span>يوماً تقريباً<br />حتى الوصول</span>
            </div>
          </div>
        </div>
      </section>

      <section className="moha-shell moha-section" id="faq" data-testid="section-faq">
        <div className="moha-section-heading">
          <div>
            <p className="moha-kicker">أسئلة في محلها</p>
            <h2>قبل أن تضغط<br />«اطلب الآن».</h2>
          </div>
          <p>كل ما تحتاج معرفته لتبدأ بثقة.</p>
        </div>
        <div className="moha-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div className="moha-faq-item" data-open={isOpen} key={item.question}>
                <button
                  className="moha-faq-trigger"
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  data-testid={`button-faq-${index + 1}`}
                >
                  <span>{item.question}</span>
                  {isOpen ? <Plus size={20} /> : <ChevronDown size={20} />}
                </button>
                {isOpen && <div className="moha-faq-answer" data-testid={`text-faq-answer-${index + 1}`}>{item.answer}</div>}
              </div>
            );
          })}
        </div>
      </section>

       <section className="moha-shell moha-contact-section" id="contact" data-testid="section-contact">
         <div className="moha-contact-card">
           <div>
             <p className="moha-kicker">تواصل معنا</p>
             <h2>نحن هنا<br />لمساعدتك.</h2>
             <p>اختر الطريقة التي تناسبك وسنساعدك في مراجعة طلبك والبدء بالخدمة المناسبة.</p>
           </div>
           <div className="moha-contact-actions">
             <a className="moha-contact-link moha-contact-link-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp">
               <MessageCircle size={22} />
               <span>
                 <strong>واتساب</strong>
                 <small>أرسل طلبك مباشرة</small>
               </span>
               <ArrowUpRight size={17} />
             </a>
             <a className="moha-contact-link moha-contact-link-facebook" href={FACEBOOK_URL} target="_blank" rel="noreferrer" data-testid="link-contact-facebook">
               <FacebookIcon size={22} />
               <span>
                 <strong>فيسبوك</strong>
                 <small>تابعنا وتواصل معنا</small>
               </span>
               <ArrowUpRight size={17} />
             </a>
           </div>
         </div>
       </section>

      <footer className="moha-shell moha-footer" data-testid="footer">
        <div className="moha-footer-grid">
          <div>
            <Logo />
            <p className="moha-footer-copy">رفيقك الجزائري الموثوق للوصول إلى كل ما يقدمه العالم.</p>
          </div>
          <div>
            <p className="moha-footer-title">استكشف</p>
            <a className="moha-footer-link" href="#how-it-works" data-testid="link-footer-how-it-works">كيف نعمل</a>
             <a className="moha-footer-link" href="#calculator" data-testid="link-footer-estimate">حاسبة الأسعار</a>
            <a className="moha-footer-link" href="#faq" data-testid="link-footer-faq">الأسئلة الشائعة</a>
          </div>
          <div>
            <p className="moha-footer-title">تواصل معنا</p>
            <a
              className="moha-footer-link"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              data-testid="link-footer-whatsapp"
            >
              واتساب فقط · 0666 84 88 16
            </a>
             <a className="moha-footer-link moha-footer-social-link" href={FACEBOOK_URL} target="_blank" rel="noreferrer" data-testid="link-footer-facebook">
               <FacebookIcon size={15} />
               فيسبوك
             </a>
            <span className="moha-footer-link">متاحون لمساعدتك في طلبك</span>
          </div>
        </div>
        <div className="moha-footer-bottom">
          <span>© 2024 Moha · Global shopping, made local.</span>
          <span>صُنع للجزائر، من أجل العالم.</span>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;