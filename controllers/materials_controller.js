const supabase = require("../config/supabase");
const axios = require("axios");

const controller = {};

controller.createMaterialsWithAI = async (req, res) => {
  try {
    const { title, bahasa, subject_id } = req.body;

    const { data: subject, error } = await supabase
      .from("subject")
      .select("class")
      .eq("subject_id", subject_id)
      .single();

    if (error || !subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const grade_level = `kelas ${subject.class} SD`;

    // Call external API
    const apiUrl = process.env.GENERATE_MATERIAL;
    let material_result = null;
    try {
      console.log("Body to GENERATE_MATERIAL:", { title, bahasa, grade_level });
      const apiResponse = await axios.post(apiUrl, {
        topic: title,
        language: bahasa,
        grade_level,
      });
      material_result = apiResponse.data;
    } catch (apiErr) {
      return res.status(502).json({
        error: "Failed to fetch from GENERATE_MATERIAL API",
        details: apiErr.message,
      });
    }

    // Insert to materials table
    const { data: materialsData, error: materialsError } = await supabase
      .from("materials")
      .insert([
        {
          nama_materi: title,
          hasil_materi: material_result, // langsung simpan JSON
          subject_id,
        },
      ])
      .select("*")
      .single();

    if (materialsError) {
      return res.status(400).json({ error: materialsError.message });
    }

    // Setelah berhasil insert ke materials:
    const materials_id = materialsData.materials_id;
    const { rencana_belajar, materi_belajar, latihan_soal, kunci_jawaban } =
      material_result;

    // (Opsional) Update materials dengan rencana_belajar dan materi_belajar jika ada kolomnya
    await supabase
      .from("materials")
      .update({
        rencana_belajar,
        materi_belajar,
      })
      .eq("materials_id", materials_id);

    // Insert ke quiz dan answer
    for (let i = 0; i < latihan_soal.length; i++) {
      const soal = latihan_soal[i];
      // Insert ke quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quiz")
        .insert([
          {
            materials_id,
            number: soal.number, // nomor urut soal
            question: soal.question,
            type: soal.type,
            options: soal.options ? soal.options : null, // simpan opsi jika ada
          },
        ])
        .select("quiz_id")
        .single();

      if (quizError) continue; // atau handle error sesuai kebutuhan

      // Insert ke answer (cocokkan dengan kunci_jawaban berdasarkan number)
      const kunci = kunci_jawaban.find((j) => j.number === soal.number);
      if (kunci) {
        await supabase.from("answer").insert([
          {
            quiz_id: quizData.quiz_id,
            number: kunci.number, // nomor urut jawaban
            correct_answer: kunci.answer,
            explanation: kunci.explanation,
          },
        ]);
      }
    }

    res.status(201).json({
      message: "Materials created and saved successfully",
      materials: materialsData,
    });
  } catch (err) {
    console.error("Error in createMaterialsWithAI:", err);
    return res.status(500).json({ error: err.message });
  }
};

controller.createMaterialsWithQuiz = async (req, res) => {
  try {
    const { nama_materi, hasil_materi, subject_id, quiz, answer } = req.body;

    // insert materials
    const { data: materialsData, error: materialsError } = await supabase
      .from("materials")
      .insert([
        {
          nama_materi,
          hasil_materi: hasil_materi, // json format
          subject_id,
        },
      ])
      .select("materials_id")
      .single();

    if (materialsError)
      return res.status(400).json({ error: materialsError.message });

    const materials_id = materialsData.materials_id;

    // insert quiz and answer
    const quizResults = [];
    for (let i = 0; i < quiz.length; i++) {
      const { question, type } = quiz[i];

      // insert quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quiz")
        .insert([
          {
            materials_id,
            question,
            type,
          },
        ])
        .select("quiz_id")
        .single();

      if (quizError) return res.status(400).json({ error: quizError.message });

      const quiz_id = quizData.quiz_id;

      // answer
      const { data: answerData, error: answerError } = await supabase
        .from("answer")
        .insert([
          {
            quiz_id,
            correct_answer: answer[i],
          },
        ])
        .select("answer_id")
        .single();

      if (answerError)
        return res.status(400).json({ error: answerError.message });

      quizResults.push({
        quiz_id,
        question,
        type,
        answer: answer[i],
      });
    }

    return res.status(201).json({
      materials_id,
      subject_id,
      nama_materi,
      materi: hasil_materi,
      quiz: quizResults,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

controller.getMaterials = async (req, res) => {
  try {
    const { data, error } = await supabase.from("materials").select("*");
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.getMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("materials_id", id)
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.getMaterialsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("subject_id", subject_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
