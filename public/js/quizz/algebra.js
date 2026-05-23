function generateAlgebra1() {
  // 1. Tentukan komponen angka secara acak
  // Math.floor(Math.random() * max) + min
  const a = Math.floor(Math.random() * 5) + 2;  // Angka pengali x (antara 2 sampai 6)
  const b = Math.floor(Math.random() * 10) + 1; // Angka konstanta penambah (antara 1 sampai 10)
  const xCorrect = Math.floor(Math.random() * 7) + 2; // Jawaban x yang benar (antara 2 sampai 8)

  // 2. Hitung nilai C berdasarkan x yang sudah ditentukan
  const c = (a * xCorrect) + b;

  // 3. Buat teks soal
  const questionText = `${a}x + ${b} = ${c}, berapa nilai x?`;

  // 4. Buat pilihan jawaban (1 benar, 3 salah)
  // Kita buat set agar tidak ada angka pilihan yang kembar
  const optionsSet = new Set([xCorrect]);
  
  while (optionsSet.size < 4) {
    // Berikan alternatif jawaban acak di sekitar nilai x asli
    const fakeX = xCorrect + (Math.floor(Math.random() * 7) - 3); // x-3 sampai x+3
    if (fakeX > 0) { // Pastikan pilihan salah tidak minus jika ingin angka positif saja
      optionsSet.add(fakeX);
    }
  }

  // Ubah Set menjadi Array dan acak urutannya (shuffle)
  const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  // Mapping ke format A, B, C, D
  const labels = ['A', 'B', 'C', 'D'];
  const formattedOptions = {};
  let correctLetter = '';

  optionsArray.forEach((val, index) => {
    const letter = labels[index];
    formattedOptions[letter] = `x = ${val}`;
    if (val === xCorrect) {
      correctLetter = letter; // Simpan kunci jawaban (A/B/C/D)
    }
  });

  // Kembalikan objek data soal
  return {
    question: questionText,
    options: formattedOptions,
    correctAnswer: correctLetter,
    secretX: xCorrect // Untuk validasi backend/sistem jika diperlukan
  };
}