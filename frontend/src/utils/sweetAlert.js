import Swal from 'sweetalert2';

// Success notification
export const showSuccessAlert = (message) => {
  return Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: message,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#4CAF50',
    timer: 2000,
    timerProgressBar: true
  });
};

// Error notification
export const showErrorAlert = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'เกิดข้อผิดพลาด',
    text: message,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#f44336'
  });
};

// Warning notification
export const showWarningAlert = (message) => {
  return Swal.fire({
    icon: 'warning',
    title: 'คำเตือน',
    text: message,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#ff9800'
  });
};

// Confirmation dialog
export const showConfirmDialog = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#4CAF50',
    cancelButtonColor: '#f44336',
    reverseButtons: true
  });
};

// Delete confirmation
export const showDeleteConfirm = () => {
  return Swal.fire({
    title: 'ยืนยันการลบ',
    text: 'คุณต้องการลบข้อมูลผู้ป่วยใช่หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#f44336',
    cancelButtonColor: '#607D8B',
    reverseButtons: true
  });
};

// Form validation error
export const showValidationError = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'ข้อมูลไม่ถูกต้อง',
    text: message,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#f44336'
  });
};

// Loading state
export const showLoading = (message = 'กำลังดำเนินการ...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
}; 