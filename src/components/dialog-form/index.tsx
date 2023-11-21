import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormProvider from "../hook-form/FormProvider";
import { UseFormReturn, useForm } from "react-hook-form";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  open: boolean;
  title: string;
  methods: UseFormReturn<any>;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};
export default function DialogForm({
  open,
  title,
  methods,
  children,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
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
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button type="submit">确认</Button>
          <Button onClick={onClose}>取消</Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
