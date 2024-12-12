import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto mb-2 size-24">
            <Image
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
              fill
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
