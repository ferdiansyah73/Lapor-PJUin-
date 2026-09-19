// Data default jika localStorage masih kosong
const DEFAULT_REPORTS = [
    {
        id: "PJU-20260918-001",
        nama: "Ahmad Subagja",
        kontak: "081234567890",
        kerusakan: "Lampu PJU Mati Total",
        kecamatan: "Ciruas",
        lokasi: "Jl. Raya Serang-Jakarta KM 12, Depan Indomaret Ciruas",
        deskripsi: "Lampu PJU mati total sejak 3 hari yang lalu, kondisi sangat gelap di malam hari.",
        foto: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=60",
        tanggal: "2026-09-18 19:30",
        status: "Diproses",
        catatanPetugas: "Tim teknis sedang dijadwalkan menuju lokasi untuk pengecekan jaringan.",
        fotoSelesai: ""
    },
    {
        id: "PJU-20260917-002",
        nama: "Siti Rahma",
        kontak: "085712345678",
        kerusakan: "Lampu Berkedip / Tidak Normal",
        kecamatan: "Kragilan",
        lokasi: "Jl. Syekh Nawawi Banten, dekat jembatan",
        deskripsi: "Lampu sering berkedip dan redup saat malam hari.",
        foto: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=60",
        tanggal: "2026-09-17 20:15",
        status: "Selesai",
        catatanPetugas: "Penggantian bohlam LED 120W dan perbaikan perataan beban arus telah selesai.",
        fotoSelesai: ""
    }
];

// Inisialisasi Storage
let reports = JSON.parse(localStorage.getItem('pju_reports_serang')) || DEFAULT_REPORTS;
let isOfficerLoggedIn = false;

// Save to LocalStorage & Refresh UI
function saveToStorage() {
    localStorage.setItem('pju_reports_serang', JSON.stringify(reports));
    updateStats();
    renderRecentReports();
}

// Inisialisasi Aplikasi saat Load
document.addEventListener('DOMContentLoaded', () => {
    saveToStorage();
});

// --- NAVIGATION SYSTEM ---
function switchSection(sectionId) {
    const sections = ['home', 'lapor', 'cek', 'petugas', 'tentang'];
    sections.forEach(sec => {
        const el = document.getElementById(`sec-${sec}`);
        if (el) el.classList.add('hidden');
        const navEl = document.getElementById(`nav-${sec}`);
        if (navEl) {
            navEl.classList.remove('bg-blue-50', 'text-blue-600');
            navEl.classList.add('text-slate-600');
        }
    });

    const targetSec = document.getElementById(`sec-${sectionId}`);
    if (targetSec) targetSec.classList.remove('hidden');

    const targetNav = document.getElementById(`nav-${sectionId}`);
    if (targetNav) {
        targetNav.classList.add('bg-blue-50', 'text-blue-600');
        targetNav.classList.remove('text-slate-600');
    }

    if (sectionId === 'petugas') {
        renderOfficerTable();
    }
}

// --- STATISTIK & RENDER DOKUMEN ---
function updateStats() {
    document.getElementById('stat-total').innerText = reports.length;
    document.getElementById('stat-menunggu').innerText = reports.filter(r => r.status === 'Menunggu').length;
    document.getElementById('stat-diverifikasi').innerText = reports.filter(r => r.status === 'Diverifikasi').length;
    document.getElementById('stat-diproses').innerText = reports.filter(r => r.status === 'Diproses').length;
    document.getElementById('stat-selesai').innerText = reports.filter(r => r.status === 'Selesai').length;
}

function getStatusBadge(status) {
    switch (status) {
        case 'Menunggu':
            return `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Menunggu</span></span>`;
        case 'Diverifikasi':
            return `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span><span>Diverifikasi</span></span>`;
        case 'Diproses':
            return `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span><span>Diproses</span></span>`;
        case 'Selesai':
            return `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Selesai</span></span>`;
        case 'Ditolak':
            return `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span><span>Ditolak</span></span>`;
        default:
            return status;
    }
}

function renderRecentReports() {
    const tableBody = document.getElementById('recentReportsTable');
    if (!tableBody) return;

    const filterSelect = document.getElementById('filterStatus');
    const filterValue = filterSelect ? filterSelect.value : 'ALL';

    let filtered = reports;
    if (filterValue !== 'ALL') {
        filtered = reports.filter(r => r.status === filterValue);
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400 font-medium">Tidak ada data pengaduan untuk status ini.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map(r => `
        <tr class="hover:bg-slate-50/80 transition">
            <td class="p-3 font-mono font-bold text-blue-600">${r.id}</td>
            <td class="p-3 text-slate-500 text-xs">${r.tanggal.split(' ')[0]}</td>
            <td class="p-3 font-semibold text-slate-800">${r.nama}</td>
            <td class="p-3 text-slate-600">${r.kerusakan}</td>
            <td class="p-3 text-slate-600 max-w-xs truncate">${r.kecamatan} - ${r.lokasi}</td>
            <td class="p-3">${getStatusBadge(r.status)}</td>
            <td class="p-3 text-right">
                <button onclick="viewDetailTiket('${r.id}')" class="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-600 font-bold rounded-lg text-xs transition">Detail</button>
            </td>
        </tr>
    `).join('');
}

// --- SUBMIT FORM PENGADUAN ---
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('uploadPlaceholder').classList.add('hidden');
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function submitPengaduan(e) {
    e.preventDefault();

    const now = new Date();
    const dateStr = now.toISOString().slice(0,10).replace(/-/g,"");
    const randomNum = Math.floor(100 + Math.random() * 900);
    const idTiket = `PJU-${dateStr}-${randomNum}`;

    const previewSrc = document.getElementById('imagePreview').src;
    const defaultFoto = "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=60";

    const newReport = {
        id: idTiket,
        nama: document.getElementById('inputNama').value,
        kontak: document.getElementById('inputKontak').value,
        kerusakan: document.getElementById('inputKerusakan').value,
        kecamatan: document.getElementById('inputKecamatan').value,
        lokasi: document.getElementById('inputLokasi').value,
        deskripsi: document.getElementById('inputDeskripsi').value,
        foto: previewSrc && previewSrc !== window.location.href ? previewSrc : defaultFoto,
        tanggal: `${now.toISOString().slice(0,10)} ${now.toTimeString().slice(0,5)}`,
        status: "Menunggu",
        catatanPetugas: "Laporan baru diterima oleh sistem, menunggu verifikasi petugas.",
        fotoSelesai: ""
    };

    reports.unshift(newReport);
    saveToStorage();

    // Reset Form
    document.getElementById('formPengaduan').reset();
    document.getElementById('imagePreview').src = "";
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    document.getElementById('imagePreviewContainer').classList.add('hidden');

    // Navigasi otomatis & tampilkan tiket
    switchSection('cek');
    document.getElementById('searchTiketInput').value = idTiket;
    cariTiket();
}

// --- CARI TIKET & CEK STATUS ---
function cariTiket() {
    const inputTiket = document.getElementById('searchTiketInput').value.trim().toUpperCase();
    const resultContainer = document.getElementById('searchResultContainer');

    if (!inputTiket) {
        alert("Silakan masukkan ID Tiket Pengaduan terlebih dahulu!");
        return;
    }

    const report = reports.find(r => r.id === inputTiket);

    resultContainer.classList.remove('hidden');

    if (!report) {
        resultContainer.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
                <svg class="w-12 h-12 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 class="text-lg font-bold text-red-800">Nomor Tiket Tidak Ditemukan</h3>
                <p class="text-xs text-red-600 max-w-md mx-auto">Mohon periksa kembali nomor tiket yang Anda masukkan. Pastikan sesuai format contoh: PJU-20260918-001</p>
            </div>
        `;
        return;
    }

    // Tracker Visual Line
    const stages = ['Menunggu', 'Diverifikasi', 'Diproses', 'Selesai'];
    const currentIdx = stages.indexOf(report.status);

    resultContainer.innerHTML = `
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-8">
            <!-- Header Tiket -->
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase">Detail Tiket Pengaduan</span>
                    <h3 class="text-2xl font-black text-blue-600 font-mono">${report.id}</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Dilaporkan pada: ${report.tanggal}</p>
                </div>
                <div>
                    ${getStatusBadge(report.status)}
                </div>
            </div>

            <!-- Visual Tracking Alur Status -->
            ${report.status !== 'Ditolak' ? `
            <div class="space-y-3">
                <h4 class="text-xs font-bold text-slate-700 uppercase">Alur Progres Penanganan:</h4>
                <div class="grid grid-cols-4 gap-2 text-center relative">
                    ${stages.map((st, idx) => {
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        return `
                            <div class="flex flex-col items-center space-y-2">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'} ${isCurrent ? 'ring-4 ring-blue-100' : ''}">
                                    ${idx + 1}
                                </div>
                                <span class="text-[11px] font-bold ${isDone ? 'text-blue-700' : 'text-slate-400'}">${st}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : `
            <div class="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-800 space-y-1">
                <p class="font-bold">⚠️ Pengaduan Ini Ditolak / Dibatalkan</p>
                <p>${report.catatanPetugas || 'Laporan tidak memenuhi kriteria penanganan PJU Kabupaten Serang.'}</p>
            </div>
            `}

            <!-- Informasi Detail Laporan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                <div class="space-y-4">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Nama Pelapor</span>
                        <p class="text-sm font-bold text-slate-800">${report.nama}</p>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Jenis Kerusakan</span>
                        <p class="text-sm font-bold text-slate-800">${report.kerusakan}</p>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Kecamatan & Lokasi Detail</span>
                        <p class="text-sm font-medium text-slate-800">${report.kecamatan} - ${report.lokasi}</p>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Masalah</span>
                        <p class="text-xs text-slate-600 mt-1">${report.deskripsi}</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Foto Kondisi PJU (Pelapor)</span>
                        <img src="${report.foto}" class="mt-2 h-36 w-full object-cover rounded-xl border border-slate-200 shadow-sm">
                    </div>
                    ${report.catatanPetugas ? `
                    <div class="bg-white p-3.5 rounded-xl border border-blue-200 space-y-1">
                        <span class="text-[10px] font-bold text-blue-600 uppercase">Catatan Petugas Teknis:</span>
                        <p class="text-xs text-slate-700 italic">"${report.catatanPetugas}"</p>
                    </div>
                    ` : ''}
                    ${report.fotoSelesai ? `
                    <div>
                        <span class="text-[10px] font-bold text-emerald-600 uppercase">Foto Bukti Perbaikan Petugas</span>
                        <img src="${report.fotoSelesai}" class="mt-1 h-36 w-full object-cover rounded-xl border border-emerald-300 shadow-sm">
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function viewDetailTiket(id) {
    switchSection('cek');
    document.getElementById('searchTiketInput').value = id;
    cariTiket();
}

// --- PORTAL PETUGAS SYSTEM ---
function toggleOfficerMode() {
    if (isOfficerLoggedIn) {
        switchSection('petugas');
    } else {
        document.getElementById('loginModal').classList.remove('hidden');
    }
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function handleOfficerLogin(e) {
    e.preventDefault();
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value.trim();

    // Mengizinkan kombinasi Ferdi / 180426 atau Ferdi / 123456
    if (u === 'Ferdi' && (p === '180426' || p === '123456')) {
        isOfficerLoggedIn = true;
        closeLoginModal();
        document.getElementById('officerBadge').classList.remove('hidden');
        document.getElementById('officerBtnText').innerText = "Dashboard Petugas";
        switchSection('petugas');
    } else {
        alert("Username atau Password Petugas Salah!\nGunakan Username: Ferdi, Password: 180426");
    }
}

function logoutOfficer() {
    isOfficerLoggedIn = false;
    document.getElementById('officerBadge').classList.add('hidden');
    document.getElementById('officerBtnText').innerText = "Portal Petugas";
    switchSection('home');
}

function renderOfficerTable() {
    const tbody = document.getElementById('officerReportsTable');
    if (!tbody) return;

    const query = (document.getElementById('officerSearch')?.value || "").toLowerCase();

    const filtered = reports.filter(r => 
        r.id.toLowerCase().includes(query) ||
        r.nama.toLowerCase().includes(query) ||
        r.lokasi.toLowerCase().includes(query) ||
        r.kecamatan.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400 font-medium">Tidak ada pengaduan ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        const realIndex = reports.findIndex(item => item.id === r.id);
        return `
            <tr class="hover:bg-slate-50 transition">
                <td class="p-3 font-mono font-bold text-blue-600">${r.id}</td>
                <td class="p-3">
                    <p class="font-bold text-slate-800">${r.nama}</p>
                    <p class="text-xs text-slate-500">${r.kontak}</p>
                </td>
                <td class="p-3 text-slate-700">${r.kerusakan}</td>
                <td class="p-3 text-slate-700 max-w-xs truncate">${r.kecamatan} - ${r.lokasi}</td>
                <td class="p-3">${getStatusBadge(r.status)}</td>
                <td class="p-3 text-center">
                    <button onclick="openOfficerModal(${realIndex})" class="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg text-xs shadow-sm transition">
                        Tindak Lanjut
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openOfficerModal(idx) {
    const report = reports[idx];
    document.getElementById('modalReportIndex').value = idx;
    document.getElementById('modalTiketId').innerText = `Tiket ID: ${report.id}`;
    document.getElementById('modalStatusSelect').value = report.status;
    document.getElementById('modalCatatanPetugas').value = report.catatanPetugas || '';
    document.getElementById('modalFotoPerbaikan').value = '';
    document.getElementById('officerModal').classList.remove('hidden');
}

function closeOfficerModal() {
    document.getElementById('officerModal').classList.add('hidden');
}

function saveOfficerUpdate(e) {
    e.preventDefault();
    const idx = document.getElementById('modalReportIndex').value;
    const newStatus = document.getElementById('modalStatusSelect').value;
    const newCatatan = document.getElementById('modalCatatanPetugas').value;
    const fotoFile = document.getElementById('modalFotoPerbaikan').files[0];

    reports[idx].status = newStatus;
    reports[idx].catatanPetugas = newCatatan;

    if (fotoFile) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            reports[idx].fotoSelesai = evt.target.result;
            saveToStorage();
            closeOfficerModal();
            renderOfficerTable();
            alert("Status laporan & catatan petugas berhasil diperbarui!");
        };
        reader.readAsDataURL(fotoFile);
    } else {
        saveToStorage();
        closeOfficerModal();
        renderOfficerTable();
        alert("Status laporan & catatan petugas berhasil diperbarui!");
    }
}

// Fungsi untuk menyimpan perubahan dari modal petugas
async function saveOfficerUpdate(e) {
    if (e) e.preventDefault();

    const idx = document.getElementById('modalReportIndex')?.value;
    if (idx === undefined || idx === "" || !reports[idx]) {
        alert("Terjadi kesalahan: Data laporan tidak ditemukan.");
        return;
    }

    const newStatus = document.getElementById('modalStatusSelect').value;
    const newCatatan = document.getElementById('modalCatatanPetugas').value;
    const fotoFileInput = document.getElementById('modalFotoPerbaikan');

    // Update status dan catatan
    reports[idx].status = newStatus;
    reports[idx].catatanPetugas = newCatatan;

    // Jika petugas mengunggah foto perbaikan
    if (fotoFileInput && fotoFileInput.files && fotoFileInput.files[0]) {
        try {
            const base64Photo = await readAsBase64(fotoFileInput.files[0]);
            reports[idx].fotoSelesai = base64Photo;
        } catch (err) {
            console.error("Gagal membaca file foto:", err);
        }
    }

    // Simpan ke localStorage & perbarui tampilan
    saveToStorage();
    closeOfficerModal();
    renderOfficerTable();

    alert("Berhasil! Status dan tindak lanjut laporan telah diperbarui.");
}


// Helper konversi file gambar ke Base64 dengan validasi batas ukuran ketat
function readAsBase64(file) {
    return new Promise((resolve, reject) => {
        const maxSize = 2 * 1024 * 1024; // Batas Maksimal 2 MB

        if (file.size > maxSize) {
            alert("⚠️ Pengubahan Ditolak!\nUkuran foto bukti perbaikan terlalu besar (Maksimal 2 MB). Silakan gunakan foto yang lebih kecil.");
            reject(new Error("Ukuran foto melebihi batas 2 MB"));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Validasi saat warga memilih/mengunggah foto di Form Pengaduan
function previewImage(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const maxSize = 2 * 1024 * 1024; // Batas Maksimal 2 MB

        if (file.size > maxSize) {
            alert("⚠️ Ukuran foto terlalu besar!\nMaksimal ukuran foto adalah 2 MB. Silakan pilih foto lain yang ukurannya lebih kecil.");
            input.value = ""; // Reset file input
            document.getElementById('uploadPlaceholder').classList.remove('hidden');
            document.getElementById('imagePreviewContainer').classList.add('hidden');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('uploadPlaceholder').classList.add('hidden');
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

// Fungsi Simpan Petugas dengan Penolakan Ukuran Foto
async function saveOfficerUpdate(e) {
    if (e) e.preventDefault();

    const idx = document.getElementById('modalReportIndex')?.value;
    if (idx === undefined || idx === "" || !reports[idx]) {
        alert("Terjadi kesalahan: Data laporan tidak ditemukan.");
        return;
    }

    const newStatus = document.getElementById('modalStatusSelect').value;
    const newCatatan = document.getElementById('modalCatatanPetugas').value;
    const fotoFileInput = document.getElementById('modalFotoPerbaikan');

    let base64Photo = "";

    // Cek foto jika ada file yang diunggah
    if (fotoFileInput && fotoFileInput.files && fotoFileInput.files[0]) {
        try {
            // Jika ukuran foto melebihi 2MB, fungsi readAsBase64 akan menolak (reject)
            base64Photo = await readAsBase64(fotoFileInput.files[0]);
        } catch (err) {
            // PROSES DIBATALKAN/DITOLAK DI SINI
            console.warn("Proses simpan dibatalkan karena ukuran foto melebihi batas:", err);
            return; // Menghentikan eksekusi, data tidak disimpan
        }
    }

    // Jika lolos validasi ukuran foto, perbarui data laporan
    reports[idx].status = newStatus;
    reports[idx].catatanPetugas = newCatatan;
    if (base64Photo) {
        reports[idx].fotoSelesai = base64Photo;
    }

    // Simpan ke LocalStorage & perbarui UI
    try {
        localStorage.setItem('pju_reports_serang', JSON.stringify(reports));
        
        updateStats();
        renderRecentReports();
        renderOfficerTable();
        
        closeOfficerModal();
        alert("Berhasil! Status dan tindak lanjut laporan telah diperbarui.");
    } catch (error) {
        console.error("Gagal menyimpan ke LocalStorage:", error);
        alert("Gagal menyimpan! Kapasitas penyimpanan browser penuh.");
    }
}