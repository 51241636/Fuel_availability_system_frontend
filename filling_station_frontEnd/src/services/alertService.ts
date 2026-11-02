
import Swal from "sweetalert2";

const alertTheme = Swal.mixin({
    background: "#171719",
    color: "#F5F5F5",
    confirmButtonColor: "#16A38A",
    cancelButtonColor: "#3A3A40",
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
        popup: "fuel-alert-popup",
        title: "fuel-alert-title",
        htmlContainer: "fuel-alert-message",
        confirmButton: "fuel-alert-confirm",
        cancelButton: "fuel-alert-cancel"
    }
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
        iconColor: "#EF4444"
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
        iconColor: "#16A38A"
    });
};

// Error
export const showErrorAlert = (message: string) => {
    return alertTheme.fire({
        icon: "error",
        title: "Something went wrong",
        text: message,
        confirmButtonText: "OK",
        iconColor: "#EF4444"
    });
};

// Validation
export const showWarningAlert = (message: string) => {
    return alertTheme.fire({
        icon: "warning",
        title: "Check your details",
        text: message,
        confirmButtonText: "OK",
        iconColor: "#F2A93B"
    });
};
