const handleRegister = async (e) => {
  e.preventDefault();

  const userData = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch(
      "http://localhost:5002/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful");
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Server error");
  }
};
