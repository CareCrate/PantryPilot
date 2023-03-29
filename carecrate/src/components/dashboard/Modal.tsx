import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FunctionComponent } from "react";

type Props = {
  title: string;
  content: string;
  inputFields: JSX.Element[];
  open: boolean;
  submitText: string;
  onClose: (arg0: boolean) => void;
  onSubmit: () => void;
};

const Modal: FunctionComponent<Props> = ({ title, content, inputFields, open, onClose, submitText, onSubmit }) => {
  
  const handleCloseModal = () => {
    onClose(false);
  };

  const handleSubmitModal = () => {
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
            onClick={handleSubmitModal}
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
