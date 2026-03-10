// ==========================
// LƯU DỮ LIỆU SINH VIÊN
// ==========================

// mảng lưu danh sách sinh viên
let students = [];


// ==========================
// LẤY CÁC PHẦN TỬ DOM
// ==========================

// lấy input họ tên bằng id
const nameInput = document.getElementById("nameInput");

// lấy input điểm
const scoreInput = document.getElementById("scoreInput");

// lấy nút thêm
const addBtn = document.getElementById("addBtn");

// tbody của bảng
const studentBody = document.getElementById("studentBody");

// khu vực thống kê
const stats = document.getElementById("stats");


// ==========================
// HÀM XẾP LOẠI
// ==========================

function getRank(score){

// chuyển score sang number
score = Number(score);

// xét điều kiện
if(score >= 8.5) return "Giỏi";
if(score >= 7) return "Khá";
if(score >= 5) return "Trung bình";

return "Yếu";

}



// ==========================
// HÀM VẼ LẠI BẢNG
// ==========================

function renderTable(){

// xóa toàn bộ nội dung tbody
studentBody.innerHTML = "";

// duyệt mảng sinh viên
students.forEach((sv,index)=>{

// tạo thẻ tr
let tr = document.createElement("tr");

// nếu điểm dưới 5 -> tô nền vàng
if(sv.score < 5){
tr.style.backgroundColor = "yellow";
}

// nội dung của hàng
tr.innerHTML = `

<td>${index+1}</td>
<td>${sv.name}</td>
<td>${sv.score}</td>
<td>${getRank(sv.score)}</td>
<td>
<button data-index="${index}" class="deleteBtn">Xóa</button>
</td>

`;

// thêm tr vào bảng
studentBody.appendChild(tr);

});

updateStats();

}



// ==========================
// HÀM CẬP NHẬT THỐNG KÊ
// ==========================

function updateStats(){

let total = students.length;

let sum = 0;

// tính tổng điểm
students.forEach(s=>{
sum += Number(s.score);
});

// tính trung bình
let avg = total ? (sum/total).toFixed(2) : 0;

// hiển thị
stats.textContent = 
`Tổng sinh viên: ${total} | Điểm trung bình: ${avg}`;

}



// ==========================
// THÊM SINH VIÊN
// ==========================

function addStudent(){

// lấy giá trị input
let name = nameInput.value.trim();

let score = Number(scoreInput.value);


// kiểm tra họ tên
if(name === ""){
alert("Tên không được để trống");
return;
}


// kiểm tra điểm
if(isNaN(score) || score < 0 || score > 10){
alert("Điểm phải từ 0 đến 10");
return;
}


// thêm vào mảng
students.push({
name:name,
score:score
});


// vẽ lại bảng
renderTable();


// reset input
nameInput.value="";
scoreInput.value="";


// đưa con trỏ về ô họ tên
nameInput.focus();

}



// ==========================
// SỰ KIỆN CLICK NÚT THÊM
// ==========================

addBtn.addEventListener("click",addStudent);



// ==========================
// ENTER ĐỂ THÊM
// ==========================

scoreInput.addEventListener("keydown",(e)=>{

// nếu nhấn Enter
if(e.key === "Enter"){
addStudent();
}

});



// ==========================
// EVENT DELEGATION XÓA
// ==========================

studentBody.addEventListener("click",(e)=>{

// kiểm tra nếu click vào nút xóa
if(e.target.classList.contains("deleteBtn")){

// lấy index từ data attribute
let index = e.target.getAttribute("data-index");

// xóa khỏi mảng
students.splice(index,1);

// render lại
renderTable();

}
});

// ==========================
// TÌM KIẾM + LỌC SINH VIÊN
// ==========================

// lấy các phần tử
let searchInput = document.getElementById("searchInput");
let filterRank = document.getElementById("filterRank");
let filterBtn = document.getElementById("filterBtn");

// mảng sau khi lọc
let filteredStudents = [];

// hàm lọc
function applyFilters(){

    let keyword = searchInput.value.toLowerCase();
    let rank = filterRank.value;

    // lọc sinh viên
    filteredStudents = students.filter(s => {

        let matchName = s.name.toLowerCase().includes(keyword);

        let matchRank = (rank === "all") || getRank(s.score) === rank;

        return matchName && matchRank;

    });

    // render bảng
    studentBody.innerHTML = "";

    if(filteredStudents.length === 0){
        studentBody.innerHTML = "<tr><td colspan='5'>Không có kết quả</td></tr>";
        return;
    }

    filteredStudents.forEach((sv,index)=>{

        let tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${index+1}</td>
        <td>${sv.name}</td>
        <td>${sv.score}</td>
        <td>${getRank(sv.score)}</td>
        <td>-</td>
        `;

        studentBody.appendChild(tr);

    });

}

// sự kiện khi bấm nút xác nhận lọc
filterBtn.addEventListener("click", applyFilters);