import { Sheet } from '@tamagui/sheet';
import React from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const Drawer = ({ open, setOpen, children }: Props) => {
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      open={open}
      onOpenChange={setOpen}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation='medium'
    >
      <Sheet.Overlay
        animation='lazy'
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding='$4'
        justifyContent='center'
        alignItems='center'
        space='$5'
      >
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};

export default Drawer;
