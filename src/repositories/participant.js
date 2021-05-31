class ParticipantRepository {
    constructor(model) {
        this.model = model;
    }

    async list() {
        const participants = await this.model.find();
        return participants;
    }
}

module.exports = ParticipantRepository;