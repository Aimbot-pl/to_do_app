export default {
    togglePassword(input, button) {
        if (input.type === "password") {
            input.type = 'text'
            button.classList.value = 'btn btn-success'
            button.textContent = 'Hide'
        } else {
            input.type = 'password'
            button.classList.value = 'btn btn-outline-success'
            button.textContent = 'Show'
        }
    }
}