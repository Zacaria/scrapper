import mongoose from 'mongoose';
import config from 'config';

const init = () => {
    mongoose.connect(config.dbHost);
    mongoose.Promise = global.Promise;
};

export default init;
