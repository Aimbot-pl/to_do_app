export default {
    togglePassword(input, button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.classList.add('bi-eye');
            button.classList.remove('bi-eye-slash');
        } else {
            input.type = 'password';
            button.classList.add('bi-eye-slash');
            button.classList.remove('bi-eye');
        }
    }
}