const supabase = require("../config/supabase");

// exports.createGrade = async (req, res) => {
//   try {
//     const { user_id, materials_id, grade } = req.body;
//     const { data, error } = await supabase
//       .from("grade")
//       .insert([{ user_id, materials_id, grade }])
//       .select("*")
//       .single();
//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getGrade = async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const { data, error } = await supabase
//       .from("grade")
//       .select("*")
//       .eq("user_id", user_id);
//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.gradeQuiz = async (req, res) => {
  try {
    const { user_id, materials_id, grade, status = FALSE } = req.body; // answers: array jawaban murid, urut

    const { data: gradeData, error: gradeError } = await supabase
      .from("grade")
      .insert([
        {
          user_id,
          materials_id,
          grade,
          status,
        },
      ])
      .select("*")
      .single();

    if (gradeError) return res.status(400).json({ error: gradeError.message });

    res.status(201).json({
      message: "Grade calculated and saved",
      grade: gradeData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.gradeQuiz = async (req, res) => {
//   try {
//     const { user_id, materials_id, answers } = req.body; // answers: array jawaban murid, urut

//     // 1. Ambil semua quiz untuk materials_id, urut number
//     const { data: quizList, error: quizError } = await supabase
//       .from("quiz")
//       .select("quiz_id, number, type")
//       .eq("materials_id", materials_id)
//       .order("number", { ascending: true });

//     if (quizError) return res.status(400).json({ error: quizError.message });

//     // 2. Ambil semua answer untuk quiz-quiz tsb, urut number
//     const quizIds = quizList.map((q) => q.quiz_id);
//     const { data: answerList, error: answerError } = await supabase
//       .from("answer")
//       .select("quiz_id, number, correct_answer")
//       .in("quiz_id", quizIds)
//       .order("number", { ascending: true });

//     if (answerError)
//       return res.status(400).json({ error: answerError.message });

//     // 3. Penilaian
//     let grade = 0;
//     let hasShortAnswer = false;
//     for (let i = 0; i < quizList.length; i++) {
//       const quiz = quizList[i];
//       const userAnswer = answers[i];
//       const correct = answerList.find((a) => a.quiz_id === quiz.quiz_id);

//       if (quiz.type === "multiple_choice") {
//         if (userAnswer === correct.correct_answer) {
//           grade += 20;
//         }
//       } else if (quiz.type === "short_answer") {
//         hasShortAnswer = true;
//       }
//     }

//     // 4. Status
//     const status = !hasShortAnswer;

//     // 5. Simpan ke grade
//     const { data: gradeData, error: gradeError } = await supabase
//       .from("grade")
//       .insert([
//         {
//           user_id,
//           materials_id,
//           grade,
//           status,
//         },
//       ])
//       .select("*")
//       .single();

//     if (gradeError) return res.status(400).json({ error: gradeError.message });

//     res.status(201).json({
//       message: "Grade calculated and saved",
//       grade: gradeData,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Get grade for a user and a specific material

exports.getGradeByUserAndMaterial = async (req, res) => {
  try {
    const { user_id, materials_id } = req.params;
    const { data, error } = await supabase
      .from("grade")
      .select("*")
      .eq("user_id", user_id)
      .eq("materials_id", materials_id)
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all grades for a user
exports.getGradesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("grade")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all grades for a specific material
exports.getGradesByMaterial = async (req, res) => {
  try {
    const { materials_id } = req.params;
    const { data, error } = await supabase
      .from("grade")
      .select("*")
      .eq("materials_id", materials_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
