const colors = [
  { value: 'default', label: 'Mặc định', icon: '🌟' },
  { value: 'draft', label: 'Bản nháp', icon: '📝' },
  { value: 'pending', label: 'Đang chờ', color: 'magenta', icon: '⏳' },
  { value: 'cancelled', label: 'Đã hủy', color: 'volcano', icon: '❌' },
  { value: 'sent', label: 'Đã gửi', color: 'gold', icon: '✉️' },
  { value: 'refunded', label: 'Đã hoàn tiền', color: 'purple', icon: '💰' },
  { value: 'on hold', label: 'Tạm giữ', color: 'blue', icon: '🛑' },

  { value: 'accepted', label: 'Đã chấp nhận', color: 'green', icon: '✅' },
  { value: 'declined', label: 'Đã từ chối', color: 'volcano', icon: '❎' },
  { value: 'rejected', label: 'Bị từ chối', color: 'red', icon: '🚫' },
  { value: 'expired', label: 'Đã hết hạn', color: 'orange', icon: '⏰' },

  { value: 'success', label: 'Thành công', color: 'green', icon: '✨' },
  { value: 'failed', label: 'Thất bại', color: 'red', icon: '❌' },
  { value: 'error', label: 'Lỗi', color: 'volcano', icon: '⚠️' },

  { value: 'arrived', label: 'Đã đến', color: 'blue', icon: '🚚' },

  { value: 'unpaid', label: 'Chưa thanh toán', color: 'volcano', icon: '💵' },
  { value: 'paid', label: 'Đã thanh toán', color: 'green', icon: '💳' },
  { value: 'partially', label: 'Thanh toán một phần', color: 'purple', icon: '💰' },
  { value: 'overdue', label: 'Quá hạn', color: 'red', icon: '💰' },

  { value: 'processing', label: 'Đang xử lý', color: 'geekblue', icon: '⌛' },
  { value: 'packing', label: 'Đang đóng gói', color: 'orange', icon: '📦' },
  { value: 'shipped', label: 'Đã giao hàng', color: 'purple', icon: '✈️' },

  { value: 'not started', label: 'Chưa bắt đầu', icon: '🚫' },
  { value: 'in progress', label: 'Đang tiến hành', color: 'geekblue', icon: '🔄' },
  { value: 'delayed', label: 'Bị trì hoãn', color: 'orange', icon: '⏰' },
  { value: 'completed', label: 'Hoàn thành', color: 'green', icon: '✅' },
  { value: 'delivered', label: 'Đã giao', color: 'magenta', icon: '📦' },
  { value: 'returned', label: 'Đã trả lại', color: 'red', icon: '🔙' },

  { value: 'new', label: 'Mới', color: 'blue', icon: '🚀' },
  { value: 'premium', label: 'Cao cấp', color: 'gold', icon: '🏆' },
  { value: 'free', label: 'Miễn phí', color: 'green', icon: '💡' },
];

const statusTagColorList = (tags = []) => {
  const list = [];

  tags.map((x) => {
    const element = colors.find((obj) => obj?.value?.toLowerCase() === x?.toLowerCase());
    if (element) list.push(element);
    else list.push({ value: x, label: x });
  });
  return list;
};

const tagColor = (status) => {
  const element = colors.find((obj) => obj?.value?.toLowerCase() === status?.toLowerCase());
  if (element) return element;
  else return { value: status, label: status };
};

export { statusTagColorList, tagColor };