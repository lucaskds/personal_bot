class ParticipantRepository {
    constructor(model) {
        this.model = model;
    }

    async list() {
        return this.model.find();
         
    }

    async findUser(userName) {
        let user = {userName : userName};
        return this.model.find(user);
    }
}

module.exports = ParticipantRepository;