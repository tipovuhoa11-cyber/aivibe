
# Master Class 2025: AI Vibe Coding & Automation Landing Page

## Lưu ý QUAN TRỌNG về Xác thực Thanh toán

Để tính năng tự động chuyển sang màn hình "Chúc mừng" hoạt động, bạn **PHẢI** thực hiện đúng 2 bước sau trong Google Apps Script:

### Bước 1: Cập nhật Mã (Sửa hàm doGet)
Đảm bảo mã Script của bạn có đầy đủ cả `doPost` (để lưu dữ liệu) và `doGet` (để kiểm tra trạng thái):

```javascript
const SHEET_ID = '1co-Muy7ESBoPZlbh9JjQ5ZAcUAcRjY56ncBnzohY9o8';
const SHEET_NAME = 'Chirstmas';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      data.amount,
      'UNPAID',
      data.transactionId,
      new Date()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }));
  }
}

function doGet(e) {
  const txId = e.parameter.txId;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Tìm txId ở cột F (index 5), trả về status ở cột E (index 4)
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] === txId) {
      return ContentService.createTextOutput(JSON.stringify({ status: data[i][4] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ status: 'NOT_FOUND' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Bước 2: Deploy phiên bản mới (BẮT BUỘC)
Nếu bạn chỉ "Lưu" (Save), mã mới sẽ không có hiệu lực. Bạn phải:
1. Nhấn **Deploy** (Triển khai) -> **Manage Deployments** (Quản lý bản triển khai).
2. Nhấn vào biểu tượng bút chì (Edit) ở bản cũ.
3. Chọn Version = **New Version** (Phiên bản mới).
4. Nhấn **Deploy**.

Sau đó, hãy dùng URL mới nhận được để dán vào `SCRIPT_URL` trong file `App.tsx`.

### Quy trình Test:
1. Đăng ký trên Web.
2. Thấy mã QR và Mã đơn hàng (VD: `VIBE123456`).
3. Mở Google Sheet, tìm dòng có mã `VIBE123456`, sửa chữ `UNPAID` thành `PAID`.
4. Quay lại Web, nhấn nút "XÁC NHẬN ĐÃ CHUYỂN KHOẢN" hoặc đợi 10 giây.
5. Web sẽ tự chuyển sang màn hình Chúc mừng + Nút Zalo.
