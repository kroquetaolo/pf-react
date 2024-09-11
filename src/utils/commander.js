import { Command } from "commander"

export const commander = new Command()

commander
    .option('--mode <mode>', 'modo de ejecución del servidor', 'production')
    .parse()

