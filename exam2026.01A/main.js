// ================= GLOBAL =================
let editIndex = -1;
let filteredEmployees = [...employees];

const popup = document.getElementById("popup");
const table = document.getElementById("employeeTable");
const form = document.getElementById("employeeForm");

// ================= HIỂN THỊ LỖI =================
function showError(id, message) {
  let input = document.getElementById(id);
  let group = input.parentNode;
  let error = group.querySelector(".error");
  if (!error) {
    error = document.createElement("p");
    error.className = "error";
    group.appendChild(error);
  }
  error.innerText = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.remove());
}

// ================= POPUP =================
document.getElementById("btnAdd").onclick = () => {
  editIndex = -1;
  form.reset();
  clearErrors();
  document.querySelector(".modal-header h3").innerText = "Thêm hoi thao moi";
  popup.classList.remove("hidden");
};

document.getElementById("btnCancel").onclick = closePopup;
document.getElementById("btnClose").onclick = closePopup;

function closePopup() {
  popup.classList.add("hidden");
  form.reset();
  clearErrors();
  editIndex = -1;
}

// ================= RENDER =================
function renderData(data = filteredEmployees) {
  table.innerHTML = "";
  data.forEach((emp, index) => {
    let realIndex = employees.indexOf(emp);
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${emp.conferencename}</td>
        <td>${emp.speaker}</td>
        <td>${emp.email}</td>
        <td>${emp.date}</td>
        <td>${emp.location}</td>
        <td>
          <button class="btn-edit" onclick="editEmp(${realIndex})">Sửa</button>
          <button class="btn-delete" onclick="deleteEmp(${realIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });
}

renderData();

// ================= ADD / EDIT =================
form.onsubmit = function(e) {
  e.preventDefault();
  clearErrors();

  let conferencename = document.getElementById("conferencename").value.trim();
  let speaker = document.getElementById("speaker").value.trim();
  let email = document.getElementById("email").value.trim();
  let date = document.getElementById("date").value.trim();
  let location = document.getElementById("location").value;

  let isValid = true;

  // Validate conferencename
  if (!conferencename) {
    showError("conferencename", "Không được để trống tên hội nghị");
    isValid = false;
  } else if (conferencename.length > 100) {
    showError("conferencename", "Tên hội nghị tối đa 100 ký tự");
    isValid = false;
  }

  // Validate speaker
  if (!speaker) {
    showError("speaker", "Không được để trống diễn giả");
    isValid = false;
  } else if (speaker.length > 50) {
    showError("speaker", "Tên diễn giả tối đa 50 ký tự");
    isValid = false;
  }

  // Validate email
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError("email", "Không được để trống email");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError("email", "Email không đúng định dạng");
    isValid = false;
  }

  // Validate date
  if (!date) {
    showError("date", "Không được để trống ngày");
    isValid = false;
  }

  // Validate location
  if (!location) {
    showError("location", "Không được để trống địa điểm");
    isValid = false;
  } else if (location.length > 100) {
    showError("location", "Địa điểm tối đa 100 ký tự");
    isValid = false;
  }

  if (!isValid) return;

  // Save data
  let newEmp = { conferencename, speaker, email, date, location };
  
  if (editIndex === -1) {
    employees.push(newEmp);
  } else {
    employees[editIndex] = newEmp;
    editIndex = -1;
  }

  filteredEmployees = [...employees];
  renderData();
  closePopup();
};

// ================= EDIT =================
function editEmp(index) {
  let emp = employees[index];
  document.getElementById("conferencename").value = emp.conferencename;
  document.getElementById("speaker").value = emp.speaker;
  document.getElementById("email").value = emp.email;
  document.getElementById("date").value = emp.date;
  document.getElementById("location").value = emp.location;

  editIndex = index;
  clearErrors();
  document.querySelector(".modal-header h3").innerText = "Cập nhật nhân sự";
  popup.classList.remove("hidden");
}

// ================= DELETE =================
function deleteEmp(index) {
  if (confirm("Bạn có chắc muốn xóa?")) {
    employees.splice(index, 1);
    filteredEmployees = [...employees];
    renderData();
  }
}

// ================= SEARCH =================
document.getElementById("searchInput").oninput = function() {
  let keyword = this.value.toLowerCase().trim();
  filteredEmployees = employees.filter(emp =>
    emp.conferencename.toLowerCase().includes(keyword) ||
    emp.speaker.toLowerCase().includes(keyword) ||
    emp.email.toLowerCase().includes(keyword)
  );
  renderData(filteredEmployees);
};

document.getElementById("btnSearch").onclick = function() {
  let keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  filteredEmployees = employees.filter(emp =>
    emp.conferencename.toLowerCase().includes(keyword) ||
    emp.speaker.toLowerCase().includes(keyword) ||
    emp.email.toLowerCase().includes(keyword)
  );
  renderData(filteredEmployees);
};
