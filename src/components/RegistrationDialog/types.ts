export type TopicDialogProps = {
    open: boolean;
    handleDialogState: (state: boolean) => void;
    addCustomer: (
      fullName: string,
      email: string,
      city: string,
      street: string,
      houseNumber: string,
      zipCode: string
    ) => void;
  };