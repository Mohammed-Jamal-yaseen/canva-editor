import { Plus, LayoutTemplate, Image, Type } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
//   return (
//     <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
//       <Banner />
//       <TemplatesSection />
//       <ProjectsSection />
//     </div>
//   );
export default function EditorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">التصاميم</h2>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button asChild className="w-full md:w-auto">
                <Link href="/editor/new" className="flex items-center justify-center">
                    <Plus className="ml-2 h-4 w-4" />
                    تصميم جديد
                </Link>
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
             <h3 className="text-xl font-semibold">ابدأ تصميم جديد</h3>
             <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/editor/new?width=1080&height=1080" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-lg transition-all hover:border-primary/50">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <LayoutTemplate className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h4 className="text-sm font-semibold">منشور انستغرام</h4>
                            <p className="text-xs text-muted-foreground">1080 × 1080 px</p>
                        </div>
                    </div>
                </Link>

                <Link href="/editor/new?width=1920&height=1080" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-lg transition-all hover:border-primary/50">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                         <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Image className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h4 className="text-sm font-semibold">عرض تقديمي</h4>
                            <p className="text-xs text-muted-foreground">1920 × 1080 px</p>
                        </div>
                    </div>
                </Link>

                 <Link href="/editor/new?width=1200&height=628" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-lg transition-all hover:border-primary/50">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                         <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Type className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h4 className="text-sm font-semibold">منشور فيسبوك</h4>
                            <p className="text-xs text-muted-foreground">1200 × 628 px</p>
                        </div>
                    </div>
                </Link>

                 <div className="hidden lg:flex items-center justify-center rounded-xl border border-dashed p-6 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-sm">المزيد من القوالب قريباً...</p>
                 </div>
             </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">التصاميم الأخيرة</h3>
          <div className="rounded-lg border bg-background text-center py-20">
             <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-muted rounded-full">
                    <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium mt-2">لا توجد تصاميم بعد</h4>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    ابدأ بإنشاء تصميم جديد وستظهر مشاريعك هنا ليتم الوصول إليها بسهولة.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/editor/new">
                        ابدأ الآن
                    </Link>
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
