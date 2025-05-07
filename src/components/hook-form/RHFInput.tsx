import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type RHFProps = TextFieldProps & {
  name: string;
};

export default function RHFInput({ name, helperText, ...other }: RHFProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            value={field.value}
            error={!!error}
            helperText={error ? error.message : helperText}
            {...other}
          />
        );
      }}
    />
  );
}
