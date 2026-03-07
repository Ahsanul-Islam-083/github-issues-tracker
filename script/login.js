const userNameInput = document.getElementById("userNameInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
    const userNameInputValue = userNameInput.value;
    const passInputValue = passInput.value;
    console.log(userNameInputValue, passInputValue);

    if (userNameInputValue == "admin" && passInputValue == "admin123") {
        alert('Login Success!');
        window.location.assign("/home.html");
    } else {
        alert('Login Failed!');
        return;
    }

})