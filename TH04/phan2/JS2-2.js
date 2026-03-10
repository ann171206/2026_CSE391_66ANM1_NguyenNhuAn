// ── Giá sản phẩm ─────────────────────────────────────────
const prices = {
  "Áo thun basic":  150000,
  "Quần jeans slim": 350000,
  "Giày sneaker":   680000,
  "Túi canvas":     220000,
  "Nón bucket":      95000
};

// ── Tiện ích ──────────────────────────────────────────────
function showError(id, msg) {
  const err = document.getElementById('err-' + id);
  const el  = document.getElementById(id);
  if (err) { err.textContent = msg; err.classList.add('show'); }
  if (el)  { el.classList.remove('valid'); el.classList.add('invalid'); }
}

function clearError(id) {
  const err = document.getElementById('err-' + id);
  const el  = document.getElementById(id);
  if (err) { err.textContent = ''; err.classList.remove('show'); }
  if (el)  el.classList.remove('invalid');
}

function markValid(id) {
  clearError(id);
  const el = document.getElementById(id);
  if (el) el.classList.add('valid');
}

function formatMoney(n) {
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

// ── Tính tổng tiền tự động ────────────────────────────────
function calcTotal() {
  const prod  = document.getElementById('product').value;
  const qty   = parseInt(document.getElementById('quantity').value) || 0;
  const price = prices[prod] || 0;
  const total = price * qty;

  document.getElementById('totalPrice').textContent = formatMoney(total);
  document.getElementById('selectedProductName').textContent =
    prod ? `${prod} × ${qty}  –  ${formatMoney(price)}/cái` : 'Chưa chọn sản phẩm';
}

document.getElementById('product').addEventListener('change', calcTotal);
document.getElementById('quantity').addEventListener('input', calcTotal);

// ── Đếm ký tự ghi chú realtime ───────────────────────────
const noteEl    = document.getElementById('note');
const noteCount = document.getElementById('noteCount');

noteEl.addEventListener('input', () => {
  const len = noteEl.value.length;
  noteCount.textContent = len + '/200';
  noteCount.classList.toggle('over', len > 200);
  if (len <= 200) clearError('note');
  else showError('note', 'Ghi chú không được vượt quá 200 ký tự.');
});

// ── Hàm validate từng trường ──────────────────────────────
function validateProduct() {
  const val = document.getElementById('product').value;
  if (!val) { showError('product', 'Vui lòng chọn sản phẩm.'); return false; }
  markValid('product');
  return true;
}

function validateQuantity() {
  const raw = document.getElementById('quantity').value;
  const val = parseInt(raw);
  if (!raw)                    { showError('quantity', 'Vui lòng nhập số lượng.'); return false; }
  if (isNaN(val) || val < 1 || val > 99) {
    showError('quantity', 'Số lượng phải từ 1 đến 99.');
    return false;
  }
  markValid('quantity');
  return true;
}

function validateDeliveryDate() {
  const val = document.getElementById('deliveryDate').value;
  if (!val) { showError('deliveryDate', 'Vui lòng chọn ngày giao hàng.'); return false; }

  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 30);
  const selected = new Date(val);

  if (selected < today)   { showError('deliveryDate', 'Ngày giao không được là ngày trong quá khứ.'); return false; }
  if (selected > maxDate) { showError('deliveryDate', 'Ngày giao không quá 30 ngày từ hôm nay.'); return false; }
  markValid('deliveryDate');
  return true;
}

function validateAddress() {
  const val = document.getElementById('address').value.trim();
  if (!val)           { showError('address', 'Vui lòng nhập địa chỉ giao hàng.'); return false; }
  if (val.length < 10){ showError('address', 'Địa chỉ phải có ít nhất 10 ký tự.'); return false; }
  markValid('address');
  return true;
}

function validateNote() {
  if (noteEl.value.length > 200) {
    showError('note', 'Ghi chú không được vượt quá 200 ký tự.');
    return false;
  }
  clearError('note');
  return true;
}

function validatePayment() {
  const checked = document.querySelector('input[name="payment"]:checked');
  if (!checked) { showError('payment', 'Vui lòng chọn phương thức thanh toán.'); return false; }
  clearError('payment');
  return true;
}

// ── Sự kiện blur ─────────────────────────────────────────
document.getElementById('product').addEventListener('blur', validateProduct);
document.getElementById('quantity').addEventListener('blur', validateQuantity);
document.getElementById('deliveryDate').addEventListener('blur', validateDeliveryDate);
document.getElementById('address').addEventListener('blur', validateAddress);

// ── Sự kiện input – xóa lỗi khi nhập lại ────────────────
document.getElementById('quantity').addEventListener('input', () => clearError('quantity'));
document.getElementById('address').addEventListener('input', () => clearError('address'));
document.getElementById('product').addEventListener('change', () => clearError('product'));
document.getElementById('deliveryDate').addEventListener('change', () => clearError('deliveryDate'));
document.querySelectorAll('input[name="payment"]').forEach(r =>
  r.addEventListener('change', () => clearError('payment'))
);

// ── Submit: validate → hiện hộp xác nhận ─────────────────
let pendingData = null;

document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const ok =
    validateProduct()      &
    validateQuantity()     &
    validateDeliveryDate() &
    validateAddress()      &
    validateNote()         &
    validatePayment();

  if (!ok) return;

  // Thu thập dữ liệu để hiện tóm tắt
  const prod    = document.getElementById('product').value;
  const qty     = document.getElementById('quantity').value;
  const date    = document.getElementById('deliveryDate').value;
  const addr    = document.getElementById('address').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const total   = (prices[prod] || 0) * parseInt(qty);

  pendingData = { prod, qty, total, date };

  document.getElementById('confirmInfo').innerHTML = `
    <b>Sản phẩm:</b> ${prod}<br>
    <b>Số lượng:</b> ${qty}<br>
    <b>Tổng tiền:</b> <b style="color:#16a34a">${formatMoney(total)}</b><br>
    <b>Ngày giao:</b> ${date}<br>
    <b>Địa chỉ:</b> ${addr}<br>
    <b>Thanh toán:</b> ${payment}
  `;
  document.getElementById('confirmOverlay').classList.add('show');
});

// ── Nút Hủy ──────────────────────────────────────────────
document.getElementById('btnCancel').addEventListener('click', () => {
  document.getElementById('confirmOverlay').classList.remove('show');
});

// ── Nút Xác nhận → thành công ────────────────────────────
document.getElementById('btnConfirm').addEventListener('click', () => {
  document.getElementById('confirmOverlay').classList.remove('show');
  if (pendingData) {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
    document.getElementById('successSummary').textContent =
      `${pendingData.prod} × ${pendingData.qty} — ${formatMoney(pendingData.total)} — Giao ngày ${pendingData.date}`;
  }
});