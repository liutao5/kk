import { Box, Button, Popover, Stack, Typography } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";

interface Props {
  disabled?: boolean;
  message: string;
  title?: string;
  onOK: VoidFunction;
}

export default function CustomPopover(props: PropsWithChildren<Props>) {
  const { message, disabled, title, onOK } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const id = Boolean(anchorEl) ? "simple-popover" : undefined;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    return () => setAnchorEl(null);
  }, []);
  return (
    <Box>
      <Button disabled={disabled} onClick={handleOpen}>
        {title || "取消"}
      </Button>
      <Popover
        id={id}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>{message}</Typography>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              onClick={() => {
                onOK();
                handleClose();
              }}
            >
              是
            </Button>
            <Button onClick={handleClose}>否</Button>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
