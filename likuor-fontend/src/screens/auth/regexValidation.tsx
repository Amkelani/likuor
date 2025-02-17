export function validateEmailAddress(email: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

export function validatePhoneNumber(phoneNumber: string) {
    const regex = /^0\d{9}$/;
    return regex.test(phoneNumber);
}

export function validatePassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    return regex.test(password);
}
