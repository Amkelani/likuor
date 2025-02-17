class AddressStore {
    private address: string = '';

    setAddress(address: string) {
        this.address = address;
    }

    getAddress(): string {
        return this.address;
    }
}

export default new AddressStore();