const { canModifyQueue } = require("../util/EvobotUtil");
const { db } = require("../util/db");

module.exports = {
    name: "dbtest",
    description: "Test Database Connection",
    execute(message) {
        async function dbtestrun() {
            try {
                await db.put('test', 'If you can see this the database is operating correctly.');
                message.reply(await db.get('test'));
            }
            catch (error) {
                message.reply("An error occured running that command.")
                console.log("Error:", error)
            }
        }

        dbtestrun()
    }
};
