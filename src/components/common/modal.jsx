import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function Modal({
    open,
    onOpenChange,
    onClose,
    title,
    children,
    className = '',
    Description,
    closeOnOutsideClick = false,
    ...props
}) {
    const handleOpenChange = (isOpen) => {
        if (!isOpen && onClose) {
            onClose();
        }
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    };

    const descriptionId = Description ? "dialog-description" : undefined;

    return (
        <Dialog modal={true} open={open} onOpenChange={handleOpenChange} {...props}>
            <DialogContent
                className={cn('flex w-full max-w-lg max-h-[90dvh] flex-col gap-4', className)}
                aria-describedby={descriptionId}
                onInteractOutside={(e) => {
                    if (!closeOnOutsideClick) {
                        e.preventDefault();
                    }
                }}
            >
                  {title &&<DialogHeader>
                   <DialogTitle>{title}</DialogTitle>
                </DialogHeader>}
                {children}
            </DialogContent>
        </Dialog>
    );
}