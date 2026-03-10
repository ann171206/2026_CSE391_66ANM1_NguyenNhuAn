// ── Tiện ích ──────────────────────────────────────────────
function showError(fieldId, message) {
  const err = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (err) { err.textContent = message; err.classList.add('show'); }
  if (input) { input.classList.remove('valid'); input.classList.add('invalid'); }
}

function clearError(fieldId) {
  const err = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (err) { err.textContent = ''; err.classList.remove('show'); }
  if (input) input.classList.remove('invalid');
}

function markValid(fieldId) {
  clearError(fieldId);
  const input = document.getElementById(fieldId);
  if (input) input.classList.add('valid');
}

// ── Regex ─────────────────────────────────────────────────
const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^0[0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  fullname: /^[a-zA-ZÀ-ỹ\s]+$/
};

// ── Hàm validate từng trường ──────────────────────────────
function validateFullname() {
  const val = document.getElementById('fullname').value.trim();
  if (!val)           { showError('fullname', 'Vui lòng nhập họ và tên.'); return false; }
  if (val.length < 3) { showError('fullname', 'Họ tên phải có ít nhất 3 ký tự.'); return false; }
  if (!REGEX.fullname.test(val)) { showError('fullname', 'Họ tên chỉ được chứa chữ cái và khoảng trắng.'); return false; }
  markValid('fullname');
  return true;
}

function validateEmail() {
  const val = document.getElementById('email').value.trim();
  if (!val)                    { showError('email', 'Vui lòng nhập email.'); return false; }
  if (!REGEX.email.test(val))  { showError('email', 'Email không đúng định dạng (vd: name@domain.com).'); return false; }
  markValid('email');
  return true;
}

function validatePhone() {
  const val = document.getElementById('phone').value.trim();
  if (!val)                   { showError('phone', 'Vui lòng nhập số điện thoại.'); return false; }
  if (!REGEX.phone.test(val)) { showError('phone', 'SĐT phải có 10 chữ số và bắt đầu bằng 0.'); return false; }
  markValid('phone');
  return true;
}

function validatePassword() {
  const val = document.getElementById('password').value;
  if (!val)                      { showError('password', 'Vui lòng nhập mật khẩu.'); return false; }
  if (!REGEX.password.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, có chữ hoa, chữ thường và số.'); return false; }
  markValid('password');
  return true;
}

function validateConfirm() {
  const pw = document.getElementById('password').value;
  const cf = document.getElementById('confirm').value;
  if (!cf)      { showError('confirm', 'Vui lòng xác nhận mật khẩu.'); return false; }
  if (pw !== cf){ showError('confirm', 'Mật khẩu xác nhận không khớp.'); return false; }
  markValid('confirm');
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) { showError('gender', 'Vui lòng chọn giới tính.'); return false; }
  clearError('gender');
  return true;
}

function validateTerms() {
  const checked = document.getElementById('terms').checked;
  if (!checked) { showError('terms', 'Bạn phải đồng ý với điều khoản để tiếp tục.'); return false; }
  clearError('terms');
  return true;
}

// ── Sự kiện blur – validate ngay khi rời khỏi trường ─────
document.getElementById('fullname').addEventListener('blur', validateFullname);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirm').addEventListener('blur', validateConfirm);

// ── Sự kiện input – xóa lỗi khi bắt đầu nhập lại ────────
['fullname', 'email', 'phone', 'password', 'confirm'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => clearError(id));
});
document.querySelectorAll('input[name="gender"]').forEach(r =>
  r.addEventListener('change', () => clearError('gender'))
);
document.getElementById('terms').addEventListener('change', () => clearError('terms'));

// ── Toggle hiện / ẩn mật khẩu ────────────────────────────
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── Submit ────────────────────────────────────────────────
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Dùng & (không phải &&) để tất cả hàm đều được gọi, không dừng sớm
  const ok =
    validateFullname() &
    validateEmail()    &
    validatePhone()    &
    validatePassword() &
    validateConfirm()  &
    validateGender()   &
    validateTerms();

  if (ok) {
    const name = document.getElementById('fullname').value.trim();
    document.getElementById('successName').textContent = name;
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
  }
});