async function analyzePassword() {

  const password =
    document.getElementById("password").value;

  const response = await fetch(
    "http://localhost:5000/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ password })
    }
  );

  const data = await response.json();

  const output =
    document.getElementById("output");

  const bar =
    document.getElementById("strength-bar");

  let color = "";
  let width = "";

  if(data.strength === "Weak"){
    color = "red";
    width = "30%";
  }
  else if(data.strength === "Medium"){
    color = "orange";
    width = "65%";
  }
  else{
    color = "green";
    width = "100%";
  }

  bar.style.background = color;
  bar.style.width = width;

  output.innerHTML = `
    <h3>Strength: ${data.strength}</h3>

    <p>Entropy Score: ${data.entropy}</p>

    <p>Crack Time: ${data.crackTime}</p>

    <p>Common Password:
      ${data.commonPassword ? "YES ⚠️" : "NO ✅"}
    </p>

    <p>Suggestions:
      ${data.suggestions.join(", ")}
    </p>

    <p>Password Hash:</p>

    <small>${data.hashedPassword}</small>
  `;
}