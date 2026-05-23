function generateGeometry1() {
  // 1. Tentukan radius (r) secara acak (misal antara 2 sampai 12)
  const r = Math.floor(Math.random() * 11) + 2;

  // 2. Hitung komponen luasnya (r kuadrat)
  // Karena pilihan jawaban berbentuk angka diikuti π, kita cukup simpan angka r^2
  const correctAreaFactor = r * r; 

  // 3. Buat teks soal
  const questionText = `Berapa luas dari lingkaran yang memiliki radius ${r}?`;

  // 4. Buat pilihan jawaban pengecoh yang masuk akal bagi user
  // Pengecoh geometri biasanya: cuma dikali 2 (rumus keliling), atau r itu sendiri
  const wrong1 = r * 2;       // Pengecoh 1: Rumus keliling/diameter (2r)
  const wrong2 = r;           // Pengecoh 2: Cuma radiusnya saja (r)
  const wrong3 = correctAreaFactor + (Math.floor(Math.random() * 5) + 3); // Pengecoh 3: Angka acak

  const optionsSet = new Set([correctAreaFactor, wrong1, wrong2, wrong3]);

  // Jika set kurang dari 4 (karena ada angka yang tidak sengaja sama), tambahkan angka acak
  while (optionsSet.size < 4) {
    optionsSet.add(correctAreaFactor + Math.floor(Math.random() * 20) + 1);
  }

  // Acak posisi pilihan jawaban
  const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  // Mapping ke format A, B, C, D dengan imbuhan "π"
  const labels = ['A', 'B', 'C', 'D'];
  const formattedOptions = {};
  let correctLetter = '';

  optionsArray.forEach((val, index) => {
    const letter = labels[index];
    formattedOptions[letter] = `${val}π`; // Menambahkan simbol π di akhir
    
    if (val === correctAreaFactor) {
      correctLetter = letter;
    }
  });

  return {
    category: "Geometri",
    question: questionText,
    options: formattedOptions,
    correctAnswer: correctLetter
  };
}