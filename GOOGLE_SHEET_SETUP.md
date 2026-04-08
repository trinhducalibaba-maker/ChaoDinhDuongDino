# Hướng dẫn kết nối Google Sheets (App Đặt Đồ Ăn)

### Bước 1: Tạo bảng tính
1. Mở trang Google Sheets, tạo file mới (Ví dụ: `DonHang_ChaoDinhDuong`).
2. Ghi tiêu đề vào các ô của Dòng 1 lần lượt là: `Thời gian`, `Tên KH`, `SĐT`, `Địa chỉ`, `Món Đặt`, `Ghi Chú`, `Tổng Tiền`.

### Bước 2: Dán Code Apps Script
1. Chọn menu **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Xóa sạch nội dung cũ và dán mã bên dưới vào:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Parse JSON gửi từ Frontend (file app.js)
    var data = JSON.parse(e.postData.contents);
    
    var row = [
      new Date(),
      data.name || '',
      data.phone || '',
      data.address || '',
      data.orderInfo || '',
      data.note || '',
      data.total || 0
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}
```

### Bước 3: Triển khai & Lấy Webhook
1. Bấm **Deploy màu xanh** (góc trên bên phải) -> **New Deployment**.
2. Bấm bánh răng nhỏ ở mục **Select type** -> Chọn **Web app**.
3. Ở ô **Who has access** (Quyền truy cập): Chọn **Anyone** (Bất kỳ ai).
4. Nhấn **Deploy**. Nếu Google bắt xác minh thì bạn cứ chọn: Tài khoản Google của bạn -> Advanced (Nâng cao) -> Go to project (Đi tới dự án).
5. Sau khi xong, nhấn **Copy** chỗ đường link dài (Web app URL).

### Bước 4: Dán vào code App
Vào file `app.js` của dự án (khoảng dòng 225). Sửa chữ `YOUR_GOOGLE_SCRIPT_WEBHOOK_URL_HERE` thành đường link Webhook bạn vừa copy.

```javascript
    // Bạn thay thế dòng này
    const WEBHOOK_URL = 'https://script.google.com/macros/s/.../exec';
```

Vậy là hoàn tất! Mỗi lần khách dồn đơn và nhấn nút Đặt Hàng trên app, toàn bộ thông tin sẽ đổ thẳng vào Google Sheet của bạn giống như ma thuật. Bạn có thể mở `index.html` lên để chiêm ngưỡng tác phẩm rồi đấy.
