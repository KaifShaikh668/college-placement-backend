const handleLogin = async (e) => {
  e.preventDefault();

  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch(
      "http://localhost:5002/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // 🔐 Save JWT token
      localStorage.setItem("token", data.token);

      alert("Login successful");

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Server error");
  }
};
