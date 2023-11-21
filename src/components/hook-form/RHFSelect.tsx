import { TextField, TextFieldProps } from "@mui/material";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = TextFieldProps & {
  children: ReactNode;
  name: string;
};

export default function RHFSelect({
  children,
  name,
  helperText,
  ...other
}: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          error={!!error}
          helperText={error ? error.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
