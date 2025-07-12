import React, { useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const Modal = ({
    open,
    title,
    subtitle,
    children,
    setOpen
}: Readonly<{
    open: boolean;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>) => {

    const escFunction = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setOpen(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent id="modal" className="w-full sm:max-w-[725px]">
                {title && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{subtitle}</DialogDescription>
                    </DialogHeader>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Modal