import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RevealDirective],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent implements OnInit {
  stats = [
    { value: '٥٠ ألف+', label: 'عميل سعيد', icon: '👥' },
    { value: '٢٠٠ ألف+', label: 'منتج تم توصيله', icon: '📦' },
    { value: '٩٩.٩٪', label: 'وقت تشغيل مضمون', icon: '⚡' },
    { value: '٥★', label: 'متوسط التقييم', icon: '⭐' }
  ];

  team = [
    { name: 'أحمد الصافي', role: 'الرئيس التنفيذي & المؤسس', avatar: 'ص', gradient: 'from-brand-blue to-brand-purple' },
    { name: 'سارة محمد', role: 'المديرة التقنية & المهندسة الأولى', avatar: 'س', gradient: 'from-purple-500 to-pink-500' },
    { name: 'عمر حسن', role: 'مدير التصميم', avatar: 'ع', gradient: 'from-cyan-500 to-brand-blue' },
    { name: 'ليلى محمود', role: 'مديرة العمليات', avatar: 'ل', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'جمال وو', role: 'كبير علماء البيانات', avatar: 'ج', gradient: 'from-orange-500 to-red-500' },
    { name: 'بريا شارما', role: 'قائدة نجاح العملاء', avatar: 'ب', gradient: 'from-violet-500 to-purple-500' }
  ];

  milestones = [
    { year: '٢٠٢٠', title: 'البداية', description: 'تأسس متجر الصافي بهدف تسهيل الوصول إلى أفضل المنتجات التقنية للمستخدم العربي.' },
    { year: '٢٠٢١', title: 'أول ١٠٠٠ عميل', description: 'وصلنا إلى أول إنجاز كبير مع عملاء من ١٥ دولة حول العالم.' },
    { year: '٢٠٢٢', title: 'جولة تمويل', description: 'حصلنا على تمويل بقيمة ٥ ملايين دولار لتوسيع كتالوج منتجاتنا وبنيتنا التحتية.' },
    { year: '٢٠٢٣', title: 'التوسع العالمي', description: 'أطلقنا الشحن الدولي لأكثر من ٥٠ دولة مع توصيل في نفس اليوم في المدن الكبرى.' },
    { year: '٢٠٢٤', title: 'منصة ذكاء اصطناعي', description: 'أضفنا توصيات مدعومة بالذكاء الاصطناعي وتجربة شراء ثورية.' },
    { year: '٢٠٢٥', title: 'المستقبل', description: 'نواصل تجاوز الحدود مع معاينات المنتج بالواقع المعزز والتوصيل الفوري.' }
  ];

  values = [
    { icon: '🔐', title: 'الأمان أولاً', description: 'كل معاملة محمية بتشفير عسكري المستوى وبروتوكولات تحقق متعددة.' },
    { icon: '⚡', title: 'سرعة فائقة', description: 'شبكة التوزيع العالمية لدينا تضمن أوقات تحميل أقل من ١٠٠ مللي ثانية.' },
    { icon: '🌍', title: 'متاح عالمياً', description: 'نخدم العملاء في أكثر من ٥٠ دولة بتجارب محلية وأسعار تنافسية.' },
    { icon: '♻️', title: 'أثر مستدام', description: 'شحن محايد للكربون وتغليف صديق للبيئة كالتزامنا تجاه كوكبنا.' }
  ];

  email = '';
  subscribeSuccess = false;

  ngOnInit(): void {}

  onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      this.subscribeSuccess = true;
      this.email = '';
      setTimeout(() => this.subscribeSuccess = false, 4000);
    }
  }
}
