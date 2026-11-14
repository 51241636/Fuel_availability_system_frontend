import Swal from "sweetalert2";

const alertTheme = Swal.mixin({
  background: "#171719",
  color: "#F5F5F5",
  confirmButtonColor: "#c00e0e",
  cancelButtonColor: "#3A3A40",
  reverseButtons: true,
  buttonsStyling: true,
  customClass: {
    popup: "fuel-alert-popup",
    title: "fuel-alert-title",
    htmlContainer: "fuel-alert-message",
    confirmButton: "fuel-alert-confirm",
    cancelButton: "fuel-alert-cancel",
  },
});

// Delete confirmation
export const confirmFuelDelete = async (fuelName: string) => {
  const result = await alertTheme.fire({
    icon: "warning",
    title: "Remove fuel?",
    text: `Are you sure you want to remove ${fuelName} from this station?`,
    showCancelButton: true,
    confirmButtonText: "Yes, remove",
    cancelButtonText: "Cancel",
    iconColor: "#EF4444",
  });

  return result.isConfirmed;
};

// Success
export const showSuccessAlert = (message: string) => {
  return alertTheme.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonText: "Continue",
    iconColor: "#0ec03b",
  });
};

// Error
export const showErrorAlert = (message: string) => {
  return alertTheme.fire({
    icon: "error",
    title: "Something went wrong",
    text: message,
    confirmButtonText: "OK",
    iconColor: "#EF4444",
  });
};

// Validation
export const showWarningAlert = (message: string) => {
  return alertTheme.fire({
    icon: "warning",
    title: "Check your details",
    text: message,
    confirmButtonText: "OK",
    iconColor: "#F2A93B",
  });
};

export const confirmDiscardChanges = async () => {
  const result = await alertTheme.fire({
    icon: "warning",
    title: "Discard changes?",
    text: "All unsaved fuel stock changes will be lost.",
    showCancelButton: true,
    confirmButtonText: "Yes, discard",
    cancelButtonText: "Keep editing",
    iconColor: "#F2A93B",
  });

  return result.isConfirmed;
};
