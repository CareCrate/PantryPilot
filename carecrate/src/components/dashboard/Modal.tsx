import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { FunctionComponent, useState } from "react";

type Props = {
  title: string;
  content: string;
  inputFields: JSX.Element[];
  open: boolean;
  submitText: string;
  onClose: (arg0: boolean) => void;
  onSubmit: () => void;
};

const Modal: FunctionComponent<Props> = ({
  title,
  content,
  inputFields,
  open,
  onClose,
  submitText,
  onSubmit
}) => {
  const handleCloseModal = () => {
    onSubmit();
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "2rem" }}>
            {content}
          </DialogContentText>
          <Stack spacing={3}>
            {inputFields.map((field, index) => (
              <div key={index}>{field}</div>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            disableRipple
            disableTouchRipple
            sx={{ textTransform: "none" }}
            onClick={handleCloseModal}
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
