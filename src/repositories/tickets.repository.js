export default class TicketsRepository {
    constructor(ticketsDao) {
        this.ticketsDao = ticketsDao;
    }
    getTicketsCount = async () => this.ticketsDao.getCounts();
    createTicket = async (purchaser, amount) => this.ticketsDao.create(purchaser, amount)
}