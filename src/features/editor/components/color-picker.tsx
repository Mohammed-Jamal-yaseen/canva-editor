"use client";

import { ChromePicker, CirclePicker } from "react-color";
import { useState, useEffect } from "react";

import { colors } from "@/features/editor/types";
import { rgbaObjectToString } from "@/features/editor/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
};

export const ColorPicker = ({
  value,
  onChange,
}: ColorPickerProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
        className="border rounded-lg"
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
      />
    </div>
  );
};

