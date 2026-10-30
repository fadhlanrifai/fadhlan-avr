# Praktikum AVR — Pertemuan 3: Input dan Object Interaction (WebXR)

**Nama:** Fadhlan Rifa'i  
**NPM:** 2309020350  
**Mata Kuliah:** Praktikum Augmented dan Virtual Reality (ITIA730591)

## Deskripsi
Project ini menerapkan interaksi objek 3D menggunakan Three.js dan WebXR. Scene berisi lantai, grid, serta empat objek interaktif: kubus, bola, kerucut, dan torus knot.

## Fitur yang dibuat
1. Scene 3D dengan pencahayaan dan kamera.
2. Tombol **ENTER VR** untuk memulai sesi WebXR.
3. Dua controller virtual dengan model controller dan garis sinar (ray).
4. **Hover:** objek menyala ketika terkena sinar controller.
5. **Grab:** trigger memilih dan menggenggam objek.
6. **Release:** objek dilepas dan tetap berada di posisi terakhir.
7. **Squeeze:** tombol grip mengubah warna objek.
8. **Manipulate:** thumbstick mengubah skala objek saat digenggam.
9. Feedback berupa sorotan visual, log interaksi, dan haptic jika perangkat mendukung.
10. Mode desktop: klik mouse pada objek untuk mengganti warna.
11. Pengayaan: thumbstick juga dapat memutar objek yang sedang digenggam pada sumbu Y.

## Struktur folder
```text
pertemuan-3/
├── index.html
├── main.js
└── README.md
```

## Cara menjalankan
1. Buka folder project di Visual Studio Code.
2. Jalankan `index.html` dengan ekstensi Live Server. Alternatif: buka terminal pada folder ini dan jalankan `python -m http.server 8000`.
3. Buka alamat localhost yang ditampilkan server pada Chrome atau Edge.
4. Pastikan koneksi internet aktif karena Three.js diambil dari CDN.
5. Untuk pengujian WebXR, aktifkan ekstensi Immersive Web Emulator di Chrome/Edge, buka Developer Tools (F12), lalu mulai emulator.
6. Tekan **ENTER VR**. Arahkan controller ke objek dan uji trigger, grip, serta thumbstick.
7. Tanpa emulator/headset, pengujian mode desktop tetap dapat dilakukan dengan memutar kamera dan mengeklik objek.

> Catatan: WebXR membutuhkan konteks aman, yaitu HTTPS atau localhost. Membuka file dengan klik ganda (`file://`) tidak didukung.

## Tabel uji fungsional
Isi kolom hasil aktual dan status setelah melakukan pengujian pada perangkat/emulator. Jangan menandai pengujian XR berhasil sebelum benar-benar dicoba.

| No. | Skenario uji | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|
| 1 | Buka halaman di browser | Scene dan objek tampil, tombol ENTER VR muncul | Belum diuji pada perangkat pengguna | Belum diuji |
| 2 | Masuk sesi XR | Controller dan garis sinar tampil | Belum diuji pada emulator/headset | Belum diuji |
| 3 | Arahkan sinar ke objek | Objek menyala (hover) | Belum diuji pada emulator/headset | Belum diuji |
| 4 | Tekan trigger pada objek | Objek mengikuti controller (grab) | Belum diuji pada emulator/headset | Belum diuji |
| 5 | Lepas trigger | Objek tetap pada posisi terakhir (release) | Belum diuji pada emulator/headset | Belum diuji |
| 6 | Tekan grip pada objek | Warna objek berubah (squeeze) | Belum diuji pada emulator/headset | Belum diuji |
| 7 | Geser thumbstick saat objek digenggam | Skala objek berubah, dibatasi 0,3–3 kali | Belum diuji pada emulator/headset | Belum diuji |
| 8 | Klik objek dengan mouse | Warna objek berubah pada mode desktop | Belum diuji pada browser pengguna | Belum diuji |

## Git: commit dan push
Jalankan perintah berikut dari folder repository utama, sesuaikan nama branch jika diperlukan:

```bash
git checkout -b pertemuan-3
git add pertemuan-3
git commit -m "P3: interaction build (hover, grab, release, squeeze, scale)"
git push origin pertemuan-3
git tag pertemuan-3
git push origin pertemuan-3
```

Setelah push, pastikan folder `pertemuan-3` terlihat di repository GitHub. Tambahkan bukti screenshot atau video demo 30–60 detik setelah fitur diuji, lalu kumpulkan tautan repository sesuai instruksi dosen.
