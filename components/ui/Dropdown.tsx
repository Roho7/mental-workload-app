import React from 'react';
import { Adapt, Popover, PopoverProps, YStack } from 'tamagui';

type DropdownProps = {
  children: React.ReactNode;
  elements: React.ReactNode[];
  action?: () => void;
};

const Dropdown = ({
  children,
  elements,
  action,
  ...props
}: PopoverProps & DropdownProps) => {
  return (
    <Popover size='$5' allowFlip {...props}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Adapt platform='touch'>
        <Popover.Sheet dismissOnSnapToBottom animation='quickest'>
          <Popover.Sheet.Frame padding='$4'>
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation='quick'
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor='$borderColor'
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation='bouncy'
      >
        <Popover.Arrow borderWidth={1} borderColor='$borderColor' />

        <YStack gap='$3'>
          {elements.map((element, index) => {
            return (
              <Popover.Close asChild key={index}>
                {element}
              </Popover.Close>
            );
          })}
        </YStack>
      </Popover.Content>
    </Popover>
  );
};

export default Dropdown;
