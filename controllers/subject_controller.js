const express = require("express");
const supabase = require("../config/supabase");

const controller = {};

controller.GetSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from("subject").select("*");
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

controller.CreateSubject = async (req, res) => {
  try {
    const { class: classNumber, name, description } = req.body;
    const { data, error } = await supabase
      .from("subject")
      .insert([{ class: classNumber, name, description }])
      .select("*")
      .single();
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (e) {
    console.error("Unexpected error:", e);
    res
      .status(500)
      .json({ error: "Internal server error", details: e.toString() });
  }
};

controller.GetSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("subject")
      .select("*")
      .eq("subject_id", id)
      .single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

controller.GetSubjectsByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;
    const { data, error } = await supabase
      .from("subject")
      .select("*")
      .eq("class", classNumber);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = controller;
