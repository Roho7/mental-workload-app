import React from 'react';
import { Button } from 'tamagui';
import Drawer from '../Drawer';

const MwlModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Drawer open={open} setOpen={setOpen}>
      <Button>hi</Button>
    </Drawer>
  );
};

export default MwlModal;
