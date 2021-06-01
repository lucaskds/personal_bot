class ParticipantRepository {
    constructor(model) {
        this.model = model;
    }

    async list() {
        return this.model.find();
         
    }

    async findUser(userName) {
        return this.model.find({userName : userName});
    }
}

module.exports = ParticipantRepository;