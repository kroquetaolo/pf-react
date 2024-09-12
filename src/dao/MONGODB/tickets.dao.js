import { ticketsModel } from "../../models/tickets.model.js";

export default class TicketsDao {
    constructor() {
        this.model = ticketsModel
    }

    async getCount() {
        return this.model.countDocuments()
    }

    async create(purchaser, amount) {
        let result
        try {
            const count = await this.getCount()
            const new_ticket = {
                code: `TICKET_${count + 1}`,
                purchase_datetime: new Date(),
                purchaser,
                amount
            }
            if(amount !== 0) {
                const ticket = await this.model.create(new_ticket)
                result = {
                    message: 'Ticket created successfully',
                    ticket
                }
            } else {
                result = {
                    message: 'Ticket created successfully',
                    ticket: new_ticket
                }
            }

        } catch (error) {
            result = {
                message: 'Cannot create ticket, try again or contact the administrator', 
                result: error.message,
            };
        }
        return result;
    }

}