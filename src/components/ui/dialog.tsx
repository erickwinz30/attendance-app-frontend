import * as React from "react";
import * as ReactDOM from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const dialogContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 dialog-overlay-enter"
      style={{
        zIndex: 9999,
        isolation: "isolate",
      }}
    >
      <div
        className="fixed inset-0 bg-black"
        style={{
          opacity: 0.75,
          backdropFilter: "blur(8px)",
        }}
        onClick={() => onOpenChange(false)}
      />
      <div
        className="relative w-full flex items-center justify-center"
        style={{ zIndex: 10000 }}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(dialogContent, document.body);
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto dialog-content-enter",
        className,
      )}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        position: "relative",
        zIndex: 10001,
      }}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
});
DialogContent.displayName = "DialogContent";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-2 p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DialogHeader.displayName = "DialogHeader";

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogTitleProps
>(({ className, children, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
});
DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  );
});
DialogDescription.displayName = "DialogDescription";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 pt-4 border-t border-gray-200",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DialogFooter.displayName = "DialogFooter";
