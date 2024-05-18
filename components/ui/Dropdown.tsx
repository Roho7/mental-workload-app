import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';

type DropdownProps = {
  children: React.ReactNode;
  elements: React.ReactNode[];
  action: () => void;
};

const Dropdown = ({ children, elements, action }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View className="relative">
      <Pressable
        className="flex max-w-xs flex-row justify-between rounded-md border border-gray-200 p-2"
        onPress={() => setIsOpen(!isOpen)}
      >
        {children}
        <Feather
          name="chevron-down"
          size={16}
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {isOpen && (
        <View className="absolute left-0 top-10 max-h-max w-full max-w-xs rounded-md bg-white p-2 shadow-md">
          {elements.map((element, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setIsOpen(false);
              }}
            >
              {element}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
