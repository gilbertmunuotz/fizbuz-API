import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import sequelize from "./sequelize.js";
const sessionStore = new (SequelizeStore(session.Store))({
    db: sequelize,
});
export default sessionStore;
