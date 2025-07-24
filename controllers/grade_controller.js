const supabase = require("../config/supabase");

exports.createGrade = async (req, res) => {
  try {
    const { user_id, materials_id, grade } = req.body;
    const { data, error } = await supabase
      .from("grade")
      .insert([{ user_id, materials_id, grade }])
      .select("*")
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGrade = async (req, res) => {
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
