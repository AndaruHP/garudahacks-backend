const supabase = require("../config/supabase");

exports.createMaterialsWithQuiz = async (req, res) => {
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
