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
    const { user_id, materials_id, grade, answers, status = FALSE } = req.body; // answers: array jawaban murid, urut

    const { data: gradeData, error: gradeError } = await supabase
      .from("grade")
      .insert([
        {
          user_id,
          materials_id,
          grade,
          status,
          answers: JSON.stringify(answers), 
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

exports.updateGradeQuiz = async (req, res) => {
  try {
    const { user_id, materials_id } = req.params; // user_id: id murid, materials_id: id materi
    const { grade, status = TRUE } = req.body;

    const { data: gradeData, error: gradeError } = await supabase
      .from("grade")
      .update({
        grade,
        status,
      })
      .eq("user_id", user_id)
      .eq("materials_id", materials_id)
      .select("*")
      .single();

    if (gradeError) return res.status(400).json({ error: gradeError.message });
    res.status(200).json({
      message: "Grade updated successfully",
      grade: gradeData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
// exports.getGradesByUser = async (req, res) => {
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
