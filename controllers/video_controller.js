const supabase = require("../config/supabase");

const controller = {};

controller.getVideos = async (req, res) => {
  try {
    const { data, error } = await supabase.from("video").select("*");
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("video")
      .select("*")
      .eq("user_id", id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.createVideo = async (req, res) => {
  try {
    const { user_id, video_url, prompt, folder_name } = req.body;
    const { data, error } = await supabase
      .from("video")
      .insert([{ user_id, video_url, prompt, folder_name }])
      .select()
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = controller;
