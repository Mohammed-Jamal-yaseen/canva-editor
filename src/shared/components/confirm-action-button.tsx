/** @format */
"use client"

import React, { useTransition } from "react"

  
import { Button, ButtonProps } from "@/shared/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { AlertDialog,AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from "./ui/alert-dialog"

interface ConfirmActionButtonProps extends ButtonProps {
  action: () => Promise<any> | void;
  requireConfirm?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  icon?: React.ReactNode;
  
}

export function ConfirmActionButton({
  action,
  requireConfirm = false,
  confirmTitle = "هل أنت متأكد؟",
  confirmDescription = "لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.",
  confirmText = "استمرار",
  cancelText = "إلغاء",
  loadingText,
  icon,
  children,
  className,
  disabled,
  ...props
}: ConfirmActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handlePerformAction = () => {
    startTransition(async () => {
      await action();
    });
  };

  const buttonContent = (
    <div className="flex items-center justify-center gap-2">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{isPending && loadingText ? loadingText : children}</span>
    </div>
  );

  if (requireConfirm) {
    return (
      <AlertDialog >
        <AlertDialogTrigger asChild suppressHydrationWarning>
          <Button 
            {...props} 
            disabled={disabled || isPending} 
            className={cn("transition-all active:scale-95", className)}
          >
            {buttonContent}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[2rem] border-border bg-background shadow-2xl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="text-xl font-bold text-center">{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2 text-center">
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6 flex items-center justify-center">
            <AlertDialogCancel 
              disabled={isPending} 
              className="rounded-xl border-border "
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e:any) => {
                e.preventDefault();
                handlePerformAction();
              }}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={disabled || isPending}
      onClick={handlePerformAction}
      className={cn("transition-all active:scale-95", className)}
    >
      {buttonContent}
    </Button>
  );
}