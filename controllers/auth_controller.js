const express = require("express");
const supabase = require("../config/supabase");

const controller = {};

controller.signup = async (req, res) => {
  try {
    const { email, password, role = "student", name } = req.body;

    // Validate role
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase signup error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile if user was created successfully
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          email: email,
          role: role,
          name: name || null,
        })
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      res.json({
        user: authData.user,
        profile: profileData,
        session: authData.session,
      });
    } else {
      res.json(authData);
    }
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({
      error: "Internal server error",
      details: e.toString(),
    });
  }
};

controller.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    res.json({
      user: authData.user,
      profile: profile,
      session: authData.session.access_token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

controller.GetAdminAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.AdminChangeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: role })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Role updated successfully", profile: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.testingauth = (req, res) => {
  res.json({ message: "Testing auth route" });
};

module.exports = controller;
