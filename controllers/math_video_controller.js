const supabase = require("../config/supabase");
const axios = require("axios");

exports.createMathVideo = async (req, res) => {
  try {
    const { user_id, prompt, bahasa } = req.body;
    const apiUrl = process.env.MANIM_URL + "/generate";
    let apiResponseData;
    try {
      console.log("Calling MANIM_URL:", apiUrl);
      const apiResponse = await axios.post(apiUrl, { user_id, prompt, bahasa });
      apiResponseData = apiResponse.data;
    } catch (apiErr) {
      console.error("MANIM_URL error:", apiErr.message);
      if (apiErr.response) {
        console.error("Response data:", apiErr.response.data);
        console.error("Response status:", apiErr.response.status);
      }
      console.error("Request config:", apiErr.config);
      return res.status(502).json({
        error: "Failed to fetch from MANIM_URL API",
        details: apiErr.message,
        apiUrl,
        apiResponse: apiErr.response?.data,
        apiStatus: apiErr.response?.status,
        apiConfig: apiErr.config,
      });
    }

    const { video_url, folder_name } = apiResponseData;
    const created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("video")
      .insert([
        {
          user_id,
          video_url,
          prompt,
          folder_name,
          created_at,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: apiResponseData.message || "Video berhasil dibuat!",
      video: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserVideos = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("video")
      .select("prompt, video_url, folder_name")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const { video_id } = req.params;
    const { data, error } = await supabase
      .from("video")
      .select("*")
      .eq("video_id", video_id)
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
