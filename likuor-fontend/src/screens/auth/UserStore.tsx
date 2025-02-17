class UserStore {
    private email: string = '';

    setEmail(email: string) {
        this.email = email;
    }

    getEmail(): string {
        return this.email;
    }
}




export default new UserStore();