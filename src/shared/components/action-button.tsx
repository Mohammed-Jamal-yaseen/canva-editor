"use client"

import { type ComponentProps, type ReactNode, useTransition } from "react"
import { Button } from "@/shared/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react" // استبدلت LoadingSwap بـ Loader2 قياسي أو يمكنك استخدام الخاص بك
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"

// تعريف واجهة البيانات المتوافقة مع بنية Better Auth و Next.js Actions
interface ActionResponse {
  error?: {
    message?: string;
  } | null;
  message?: string;
  data?: any;
}

interface ActionButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  onAction: () => Promise<ActionResponse>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: ReactNode;
  successMessage?: string;
}

export function ActionButton({
  onAction,
  requireAreYouSure = false,
  areYouSureDescription = "هذا الإجراء لا يمكن التراجع عنه.",
  successMessage,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const [isLoading, startTransition] = useTransition();

  const performAction = () => {
    startTransition(async () => {
      try {
        const result = await onAction();

        if (result?.error) {
          toast.error(result.error.message || "حدث خطأ ما");
        } else {
          toast.success(successMessage || result?.message || "تمت العملية بنجاح");
        }
      } catch (error) {
        toast.error("فشل الاتصال بالخادم");
        console.error("Action Error:", error);
      }
    });
  };

  // المكون الداخلي للمحتوى مع حالة التحميل
  const buttonContent = (
    <div className="flex items-center justify-center gap-2">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </div>
  );

  if (requireAreYouSure) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button {...props} disabled={disabled || isLoading}>
            {buttonContent}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              disabled={isLoading} 
              onClick={(e) => {
                e.preventDefault(); // نمنع الإغلاق التلقائي للتعامل مع الـ Transition
                performAction();
              }}
            >
              استمرار
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={performAction}
    >
      {buttonContent}
    </Button>
  );
}
