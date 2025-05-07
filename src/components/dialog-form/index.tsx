import CloseIcon from "@mui/icons-material/Close";
import {
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import type { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import FormProvider from "../hook-form/FormProvider";

type Props = {
  children: ReactNode;
  open: boolean;
  title: string;
  methods: UseFormReturn<any>;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
  maxWidth?: Breakpoint;
};
export default function DialogForm({
  open,
  title,
  methods,
  children,
  onClose,
  onSubmit,
  maxWidth
}: Props) {
  return (
    <Dialog fullWidth maxWidth={maxWidth || "xs"} open={open} scroll="paper">
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {children}
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>确认</Button>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}
