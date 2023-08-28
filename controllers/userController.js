const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user,
  });
};

// update user Details
module.exports.updateUser = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      console.log("Passwords do not match");
      return res.redirect("back");
    }

    if (!user) {
      console.log("User not found");
      return res.redirect("back");
    }

    user.username = username;
    user.password = password;

    await user.save();
    console.log("Profile updated successfully");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    console.log("Error updating profile");
    return res.redirect("back");
  }
};


// render the Sign In page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signin.ejs");
};

// render the Sign Up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signup.ejs");
};

// creating up a new user
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // if password doesn't match
    if (password !== confirm_password) {
      return res.redirect("back");
    }

    // If employee does not have work email, redirect back
    const domain = email.split('@')[1];
    if (domain.toLowerCase() !== "codingninjas.com") {
      console.log('User not authorized to signup!');
      return res.redirect('back');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const newUser = await User.create({
        email,
        password,
        username,
      });
      if (newUser) {
        return res.redirect("/");
      } else {
        console.log("Error: Couldn't sign Up");
        return res.redirect("back");
      }
    } else {
      console.log("Error: Email already registered!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
  }
};

// sign in and create a session for the user
module.exports.createSession = (req, res) => {
  return res.redirect("/dashboard");
};

// clears the cookie
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
};