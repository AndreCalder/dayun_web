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

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const addListener = async() => {
        await sleep(200);
        let modal = document.getElementById("modal");
        const closeButton = modal?.querySelector(".lucide-x");
        if (closeButton) {
            closeButton.addEventListener("click", () => setOpen(false));
        }
    }
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        if (open) {
            addListener();
        }

        return () => {
            document.removeEventListener("keydown", escFunction, false);
            const modal = document.getElementById("modal");
            const closeButton = modal?.querySelector(".lucide-x");
            if (closeButton) {
                closeButton.removeEventListener("click", () => setOpen(false));
            }
        }
    }, [open]);

    return (
        <Dialog open={open}>
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