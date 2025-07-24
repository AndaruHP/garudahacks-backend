const express = require("express");
const supabase = require("../config/supabase");

const controller = {};

controller.GetSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from("subjects").select("*");
    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (e) {
    console.error("Unexpected error:", e);
    res
      .status(500)
      .json({ error: "Internal server error", details: e.toString() });
  }
};
